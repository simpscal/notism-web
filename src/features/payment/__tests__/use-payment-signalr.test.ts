import { renderHook, act } from '@testing-library/react';
import { toast } from 'sonner';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { usePaymentSignalR } from '../use-payment-signalr';

const mockStart = vi.fn().mockResolvedValue(undefined);
const mockStop = vi.fn().mockResolvedValue(undefined);
const mockInvoke = vi.fn().mockResolvedValue(undefined);
const mockOn = vi.fn();

const mockConnection = {
    start: mockStart,
    stop: mockStop,
    invoke: mockInvoke,
    on: mockOn,
};

vi.mock('../payment-signalr', () => ({
    createPaymentHubConnection: vi.fn(() => mockConnection),
    subscribeToPaymentEvents: vi.fn((connection, onSuccess) => {
        // Simulate the subscription by storing the callback for tests to trigger
        (connection as { _testOnSuccess?: (payload: unknown) => void })._testOnSuccess = onSuccess;
    }),
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
    },
}));

describe('usePaymentSignalR', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStart.mockResolvedValue(undefined);
        mockStop.mockResolvedValue(undefined);
        mockInvoke.mockResolvedValue(undefined);
    });

    it('starts the connection on mount', async () => {
        renderHook(() => usePaymentSignalR());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it('invokes SubscribeToPaymentEvents after connection starts', async () => {
        renderHook(() => usePaymentSignalR());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockInvoke).toHaveBeenCalledWith('SubscribeToPaymentEvents');
    });

    it('stops the connection on unmount', async () => {
        const { unmount } = renderHook(() => usePaymentSignalR());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        unmount();

        expect(mockStop).toHaveBeenCalledTimes(1);
    });

    it('shows a success toast when payment-success event fires', async () => {
        const { subscribeToPaymentEvents } = await import('../payment-signalr');

        renderHook(() => usePaymentSignalR());

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Retrieve the onSuccess callback that was passed to subscribeToPaymentEvents
        const onSuccess = (subscribeToPaymentEvents as ReturnType<typeof vi.fn>).mock.calls[0]?.[1];
        expect(onSuccess).toBeDefined();

        act(() => {
            onSuccess({ type: 'payment-success', orderId: '1', message: 'Paid!', timestamp: '' });
        });

        expect(toast.success).toHaveBeenCalledWith('Paid!');
    });

    it('does not throw when connection start fails', async () => {
        mockStart.mockRejectedValueOnce(new Error('Network error'));

        expect(() => renderHook(() => usePaymentSignalR())).not.toThrow();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    });
});
