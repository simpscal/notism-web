import { renderHook, act } from '@testing-library/react';
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
        const onNotification = vi.fn();

        renderHook(() => usePaymentSignalR({ onNotification }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockOn).toHaveBeenCalledWith('ReceivePaymentNotification', onNotification);
    });

    it('stops the connection on unmount', async () => {
        const { unmount } = renderHook(() => usePaymentSignalR({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        unmount();

        expect(mockStop).toHaveBeenCalledTimes(1);
    });

    it('does not throw when connection start fails', async () => {
        mockStart.mockRejectedValueOnce(new Error('Network error'));

        expect(() => renderHook(() => usePaymentSignalR({ onNotification: vi.fn() }))).not.toThrow();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    });
});
