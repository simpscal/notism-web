import { HubConnectionState } from '@microsoft/signalr';
import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { useNotifications, NotificationStatus } from '../use-notifications.hook';

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

const mockWithUrl = vi.fn();
const mockWithAutomaticReconnect = vi.fn();
const mockBuild = vi.fn(() => mockConnection);

vi.mock('@microsoft/signalr', async () => {
    const actual = await vi.importActual<typeof import('@microsoft/signalr')>('@microsoft/signalr');

    class MockHubConnectionBuilder {
        withUrl(...args: unknown[]) {
            mockWithUrl(...args);
            return this;
        }
        withAutomaticReconnect(...args: unknown[]) {
            mockWithAutomaticReconnect(...args);
            return this;
        }
        build() {
            return mockBuild();
        }
    }

    return {
        ...actual,
        HubConnectionBuilder: MockHubConnectionBuilder,
    };
});

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

    it('invokes SubscribeToNotifications after connection starts', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockInvoke).toHaveBeenCalledWith('SubscribeToNotifications');
    });

    it('registers the onNotification callback via connection.on', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn() }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockOn).toHaveBeenCalledWith('ReceiveNotification', expect.any(Function));
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

    it('calls onNotification with payment-failure payload when ReceiveNotification fires with failure type', async () => {
        const onNotification = vi.fn();
        renderHook(() => useNotifications({ onNotification }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const registeredHandler = mockOn.mock.calls.find(
            (args: unknown[]) => args[0] === 'ReceiveNotification'
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

    it('does not register ReceiveNotification handler when enabled is false', async () => {
        renderHook(() => useNotifications({ onNotification: vi.fn(), enabled: false }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        expect(mockOn).not.toHaveBeenCalled();
    });

    it('calls onNotification with a refund-paid payload when ReceiveNotification fires with refund-paid type', async () => {
        const onNotification = vi.fn();
        renderHook(() => useNotifications({ onNotification }));

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        const registeredHandler = mockOn.mock.calls.find(
            (args: unknown[]) => args[0] === 'ReceiveNotification'
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

    it('calls onNotification with an order-placed payload when ReceiveNotification fires', async () => {
        const onNotification = vi.fn();
        renderHook(() => useNotifications({ onNotification }));

        await flushAsync();

        const registeredHandler = mockOn.mock.calls.find(
            (args: unknown[]) => args[0] === 'ReceiveNotification'
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

            expect(result.current.status).toBe(NotificationStatus.Connecting);

            await act(async () => {
                resolveStart();
                await Promise.resolve();
            });
        });

        it('reports live once the connection is connected', async () => {
            mockConnection.state = HubConnectionState.Connected;

            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            expect(result.current.status).toBe(NotificationStatus.Live);
        });

        it('reports disconnected when the connection fails to start', async () => {
            mockStart.mockRejectedValueOnce(new Error('Network error'));

            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            expect(result.current.status).toBe(NotificationStatus.Disconnected);
        });

        it('reports connecting on auto-reconnect attempt then live on reconnected', async () => {
            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            const onReconnecting = mockOnreconnecting.mock.calls[0]?.[0] as (() => void) | undefined;
            const onReconnected = mockOnreconnected.mock.calls[0]?.[0] as (() => void) | undefined;

            act(() => onReconnecting!());
            expect(result.current.status).toBe(NotificationStatus.Connecting);

            act(() => onReconnected!());
            expect(result.current.status).toBe(NotificationStatus.Live);
        });

        it('reports disconnected when the connection closes without recovery', async () => {
            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            const onClose = mockOnclose.mock.calls[0]?.[0] as (() => void) | undefined;

            act(() => onClose!());

            expect(result.current.status).toBe(NotificationStatus.Disconnected);
        });

        it('reports disconnected and never connects when enabled is false', async () => {
            const { result } = renderHook(() => useNotifications({ onNotification: vi.fn(), enabled: false }));

            await flushAsync();

            expect(result.current.status).toBe(NotificationStatus.Disconnected);
            expect(mockStart).not.toHaveBeenCalled();
        });
    });

    describe('connection build', () => {
        it('builds the connection against the notification hub url with the api-suffix stripped', async () => {
            renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            expect(mockWithUrl).toHaveBeenCalledWith(
                'http://localhost:5000/hubs/notification',
                expect.objectContaining({ accessTokenFactory: expect.any(Function) })
            );
        });

        it('enables automatic reconnect', async () => {
            renderHook(() => useNotifications({ onNotification: vi.fn() }));

            await flushAsync();

            expect(mockWithAutomaticReconnect).toHaveBeenCalledTimes(1);
        });
    });
});
