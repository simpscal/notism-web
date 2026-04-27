import { describe, expect, it, vi, beforeEach } from 'vitest';

import { subscribeToPaymentEvents, type PaymentNotificationPayload } from '../payment-signalr';

const mockOn = vi.fn();

const mockConnection = {
    on: mockOn,
};

describe('subscribeToPaymentEvents', () => {
    beforeEach(() => {
        mockOn.mockClear();
    });

    it('registers a listener for ReceivePaymentNotification event', () => {
        const onSuccess = vi.fn();
        subscribeToPaymentEvents(mockConnection as never, onSuccess);

        expect(mockOn).toHaveBeenCalledWith('ReceivePaymentNotification', expect.any(Function));
    });

    it('calls onSuccess when payload type is payment-success', () => {
        const onSuccess = vi.fn();
        subscribeToPaymentEvents(mockConnection as never, onSuccess);

        const registeredCallback = mockOn.mock.calls[0][1];
        const payload: PaymentNotificationPayload = {
            type: 'payment-success',
            orderId: 'order-123',
            message: 'Payment completed successfully',
            timestamp: '2024-01-01T00:00:00Z',
        };

        registeredCallback(payload);

        expect(onSuccess).toHaveBeenCalledWith(payload);
    });

    it('does not call onSuccess when payload type is not payment-success', () => {
        const onSuccess = vi.fn();
        subscribeToPaymentEvents(mockConnection as never, onSuccess);

        const registeredCallback = mockOn.mock.calls[0][1];
        const payload: PaymentNotificationPayload = {
            type: 'payment-failed',
            orderId: 'order-123',
            message: 'Payment failed',
            timestamp: '2024-01-01T00:00:00Z',
        };

        registeredCallback(payload);

        expect(onSuccess).not.toHaveBeenCalled();
    });
});
