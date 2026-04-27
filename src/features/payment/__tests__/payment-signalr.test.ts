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
        const onNotification = vi.fn();
        subscribeToPaymentEvents(mockConnection as never, onNotification);

        expect(mockOn).toHaveBeenCalledWith('ReceivePaymentNotification', expect.any(Function));
    });

    it('passes through any notification type to the callback', () => {
        const onNotification = vi.fn();
        subscribeToPaymentEvents(mockConnection as never, onNotification);

        const registeredCallback = mockOn.mock.calls[0][1];
        const payload: PaymentNotificationPayload = {
            type: 'payment-success',
            orderId: 'order-123',
            message: 'Payment completed successfully',
            timestamp: '2024-01-01T00:00:00Z',
        };

        registeredCallback(payload);

        expect(onNotification).toHaveBeenCalledWith(payload);
    });

    it('passes through payment-failure notification type to the callback', () => {
        const onNotification = vi.fn();
        subscribeToPaymentEvents(mockConnection as never, onNotification);

        const registeredCallback = mockOn.mock.calls[0][1];
        const payload: PaymentNotificationPayload = {
            type: 'payment-failure',
            orderId: 'order-123',
            message: 'Payment failed',
            timestamp: '2024-01-01T00:00:00Z',
        };

        registeredCallback(payload);

        expect(onNotification).toHaveBeenCalledWith(payload);
    });
});
