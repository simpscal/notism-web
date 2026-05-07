import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { usePaymentSignalR } from '../hooks/use-payment-signalr';

const mockStart = vi.fn().mockResolvedValue(undefined);
const mockStop = vi.fn().mockResolvedValue(undefined);
const mockInvoke = vi.fn().mockResolvedValue(undefined);
const mockOn = vi.fn();
const mockOnreconnected = vi.fn();

const mockConnection = {
    start: mockStart,
    stop: mockStop,
    invoke: mockInvoke,
    on: mockOn,
    onreconnected: mockOnreconnected,
};

vi.mock('../payment-signalr', () => ({
    createPaymentHubConnection: vi.fn(() => mockConnection),
}));

describe('usePaymentSignalR', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStart.mockResolvedValue(undefined);
        mockStop.mockResolvedValue(undefined);
        mockInvoke.mockResolvedValue(undefined);
    });

    it('starts the connection on mount', async () => {
        renderHook(() => usePaymentSignalR({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it('invokes SubscribeToPaymentEvents after connection starts', async () => {
        renderHook(() => usePaymentSignalR({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockInvoke).toHaveBeenCalledWith('SubscribeToPaymentEvents');
    });

    it('registers the onNotification callback via connection.on', async () => {
        renderHook(() => usePaymentSignalR({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockOn).toHaveBeenCalledWith('ReceivePaymentNotification', expect.any(Function));
    });

    it('stops the connection on unmount', async () => {
        const { unmount } = renderHook(() => usePaymentSignalR({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        unmount();

        // StrictMode double-invokes effects: unmount cleanup + StrictMode cleanup
        expect(mockStop).toHaveBeenCalled();
    });

    it('does not throw when connection start fails', async () => {
        mockStart.mockRejectedValueOnce(new Error('Network error'));

        expect(() => renderHook(() => usePaymentSignalR({ onNotification: vi.fn() }))).not.toThrow();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    });

    it('calls onNotification with payment-failure payload when ReceivePaymentNotification fires with failure type', async () => {
        const onNotification = vi.fn();
        renderHook(() => usePaymentSignalR({ onNotification }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const registeredHandler = mockOn.mock.calls.find(
            (args: unknown[]) => args[0] === 'ReceivePaymentNotification'
        )?.[1] as ((payload: unknown) => void) | undefined;

        expect(registeredHandler).toBeDefined();

        const failurePayload = {
            type: 'payment-failure',
            orderId: 'test-order-id',
            slugId: 'ORD-ABC123',
            message: 'Payment failed',
            timestamp: '2026-04-29T00:00:00.000Z',
        };

        act(() => {
            registeredHandler!(failurePayload);
        });

        expect(onNotification).toHaveBeenCalledWith(failurePayload);
    });

    it('does not start the connection when enabled is false', async () => {
        renderHook(() => usePaymentSignalR({ onNotification: vi.fn(), enabled: false }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockStart).not.toHaveBeenCalled();
    });

    it('starts the connection when enabled is true explicitly', async () => {
        renderHook(() => usePaymentSignalR({ onNotification: vi.fn(), enabled: true }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it('does not register ReceivePaymentNotification handler when enabled is false', async () => {
        renderHook(() => usePaymentSignalR({ onNotification: vi.fn(), enabled: false }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockOn).not.toHaveBeenCalled();
    });
});
