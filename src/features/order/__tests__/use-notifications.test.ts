import { HubConnectionState } from '@microsoft/signalr';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useNotifications, PaymentSignalRStatus } from '../hooks/use-notifications';

const mockStart = vi.fn().mockResolvedValue(undefined);
const mockStop = vi.fn().mockResolvedValue(undefined);
const mockInvoke = vi.fn().mockResolvedValue(undefined);
const mockOn = vi.fn();
const mockOnreconnecting = vi.fn();
const mockOnreconnected = vi.fn();
const mockOnclose = vi.fn();

const mockConnection = {
    start: mockStart,
    stop: mockStop,
    invoke: mockInvoke,
    on: mockOn,
    onreconnecting: mockOnreconnecting,
    onreconnected: mockOnreconnected,
    onclose: mockOnclose,
    state: HubConnectionState.Connected,
};

vi.mock('../notification-signalr', () => ({
    createNotificationHubConnection: vi.fn(() => mockConnection),
}));

const flushAsync = () =>
    act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });

describe('useNotifications', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockStart.mockResolvedValue(undefined);
        mockStop.mockResolvedValue(undefined);
        mockInvoke.mockResolvedValue(undefined);
        mockConnection.state = HubConnectionState.Connected;
    });

    it('starts the connection on mount', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it('invokes SubscribeToPaymentEvents after connection starts', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockInvoke).toHaveBeenCalledWith('SubscribeToPaymentEvents');
    });

    it('registers the onNotification callback via connection.on', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockOn).toHaveBeenCalledWith('ReceivePaymentNotification', expect.any(Function));
    });

    it('stops the connection on unmount', async () => {
        const { unmount } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        unmount();

        // StrictMode double-invokes effects: unmount cleanup + StrictMode cleanup
        expect(mockStop).toHaveBeenCalled();
    });

    it('does not throw when connection start fails', async () => {
        mockStart.mockRejectedValueOnce(new Error('Network error'));

        expect(() => renderHook(() => useNotifications({ onNotification: vi.fn() }))).not.toThrow();

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });
    });

    it('calls onNotification with payment-failure payload when ReceivePaymentNotification fires with failure type', async () => {
        const onNotification = vi.fn();
        renderHook(() => useNotifications({ onNotification }));

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
        renderHook(() => useNotifications({ onNotification: vi.fn(), enabled: false }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockStart).not.toHaveBeenCalled();
    });

    it('starts the connection when enabled is true explicitly', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn(), enabled: true }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockStart).toHaveBeenCalledTimes(1);
    });

    it('does not register ReceivePaymentNotification handler when enabled is false', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn(), enabled: false }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockOn).not.toHaveBeenCalled();
    });

    it('calls onNotification with a refund-paid payload when ReceivePaymentNotification fires with refund-paid type', async () => {
        const onNotification = vi.fn();
        renderHook(() => useNotifications({ onNotification }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const registeredHandler = mockOn.mock.calls.find(
            (args: unknown[]) => args[0] === 'ReceivePaymentNotification'
        )?.[1] as ((payload: unknown) => void) | undefined;

        expect(registeredHandler).toBeDefined();

        const refundPaidPayload = {
            type: 'refund-status-changed',
            status: 'paid',
            refundId: 'refund-id',
            orderId: 'order-id',
            orderRef: 'A1B2C3',
            amount: 485_000,
            message: 'Your refund has been paid',
            timestamp: '2026-06-13T14:27:00.000Z',
        };

        act(() => {
            registeredHandler!(refundPaidPayload);
        });

        expect(onNotification).toHaveBeenCalledWith(refundPaidPayload);
    });

    it('does not register a dedicated ReceiveRefundPaidNotification handler', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const refundCall = mockOn.mock.calls.find((args: unknown[]) => args[0] === 'ReceiveRefundPaidNotification');
        expect(refundCall).toBeUndefined();
    });

    it('calls onNotification with an order-placed payload when ReceivePaymentNotification fires', async () => {
        const onNotification = vi.fn();
        renderHook(() => useNotifications({ onNotification }));

        await flushAsync();

        const registeredHandler = mockOn.mock.calls.find(
            (args: unknown[]) => args[0] === 'ReceivePaymentNotification'
        )?.[1] as ((payload: unknown) => void) | undefined;

        expect(registeredHandler).toBeDefined();

        const orderPlacedPayload = {
            type: 'order-placed',
            orderId: 'order-id',
            orderNumber: 'ORD-2026-001',
            placedAt: '2026-06-25T10:00:00.000Z',
            total: 320_000,
            itemCount: 3,
            timestamp: '2026-06-25T10:00:00.000Z',
        };

        act(() => {
            registeredHandler!(orderPlacedPayload);
        });

        expect(onNotification).toHaveBeenCalledWith(orderPlacedPayload);
    });

    describe('connection status', () => {
        it('reports connecting while the connection is starting', async () => {
            let resolveStart: () => void = () => {};
            mockStart.mockImplementationOnce(
                () =>
                    new Promise<void>(resolve => {
                        resolveStart = resolve;
                    })
            );

            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            expect(result.current.status).toBe(PaymentSignalRStatus.Connecting);

            await act(async () => {
                resolveStart();
                await Promise.resolve();
            });
        });

        it('reports live once the connection is connected', async () => {
            mockConnection.state = HubConnectionState.Connected;

            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            expect(result.current.status).toBe(PaymentSignalRStatus.Live);
        });

        it('reports disconnected when the connection fails to start', async () => {
            mockStart.mockRejectedValueOnce(new Error('Network error'));

            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            expect(result.current.status).toBe(PaymentSignalRStatus.Disconnected);
        });

        it('reports connecting on auto-reconnect attempt then live on reconnected', async () => {
            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            const onReconnecting = mockOnreconnecting.mock.calls[0]?.[0] as (() => void) | undefined;
            const onReconnected = mockOnreconnected.mock.calls[0]?.[0] as (() => void) | undefined;

            act(() => onReconnecting!());
            expect(result.current.status).toBe(PaymentSignalRStatus.Connecting);

            act(() => onReconnected!());
            expect(result.current.status).toBe(PaymentSignalRStatus.Live);
        });

        it('reports disconnected when the connection closes without recovery', async () => {
            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            const onClose = mockOnclose.mock.calls[0]?.[0] as (() => void) | undefined;

            act(() => onClose!());

            expect(result.current.status).toBe(PaymentSignalRStatus.Disconnected);
        });

        it('reports disconnected and never connects when enabled is false', async () => {
            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn(), enabled: false }));

            await flushAsync();

            expect(result.current.status).toBe(PaymentSignalRStatus.Disconnected);
            expect(mockStart).not.toHaveBeenCalled();
        });
    });
});
