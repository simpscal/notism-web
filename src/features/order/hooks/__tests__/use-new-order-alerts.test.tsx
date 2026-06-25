import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Toaster } from '@/components/sonner';
import type { SharedNotification } from '@/features/order';
import { PaymentSignalRStatus } from '@/features/order';
import { useNewOrderAlerts } from '@/features/order/hooks/use-new-order-alerts';
import { renderWithProviders } from '@/test/utils';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock };
});

let capturedOnNotification: ((payload: SharedNotification) => void) | undefined;
let mockStatus: PaymentSignalRStatus = PaymentSignalRStatus.Live;

vi.mock('@/features/order/hooks/use-notifications', async () => {
    const actual = await vi.importActual<typeof import('@/features/order/hooks/use-notifications')>(
        '@/features/order/hooks/use-notifications'
    );
    return {
        ...actual,
        useNotifications: (options: { onNotification?: (payload: SharedNotification) => void }) => {
            capturedOnNotification = options.onNotification;
            return { status: mockStatus };
        },
    };
});

interface OrderFixture {
    orderId: string;
    orderNumber: string;
    placedAt: string;
    total: number;
    itemCount: number;
}

const ORDER_ONE: OrderFixture = {
    orderId: 'ord-8001',
    orderNumber: 'ORD-20260625-1042',
    placedAt: '25 Jun 2026, 12:04',
    total: 285_000,
    itemCount: 3,
};

const ORDER_TWO: OrderFixture = {
    orderId: 'ord-8002',
    orderNumber: 'ORD-20260625-1043',
    placedAt: '25 Jun 2026, 12:04',
    total: 95_000,
    itemCount: 1,
};

function StatusProbe() {
    const { status } = useNewOrderAlerts();
    return <span data-testid='feed-status'>{status}</span>;
}

function Harness() {
    return (
        <>
            <StatusProbe />
            <Toaster />
        </>
    );
}

const pushOrder = (payload: OrderFixture) => {
    act(() => {
        capturedOnNotification?.({
            type: 'order-placed',
            orderId: payload.orderId,
            orderNumber: payload.orderNumber,
            placedAt: payload.placedAt,
            total: payload.total,
            itemCount: payload.itemCount,
            timestamp: '2026-06-25T12:04:00.000Z',
        });
    });
};

describe('useNewOrderAlerts', () => {
    beforeEach(() => {
        navigateMock.mockReset();
        capturedOnNotification = undefined;
        mockStatus = PaymentSignalRStatus.Live;
    });

    afterEach(async () => {
        const { toast } = await import('sonner');
        toast.dismiss();
        vi.clearAllMocks();
    });

    it('surfaces a new-order alert with the order number and placed-at time when an order-placed event arrives', async () => {
        renderWithProviders(<Harness />);

        pushOrder(ORDER_ONE);

        await waitFor(() => {
            expect(screen.getByText(ORDER_ONE.orderNumber)).toBeInTheDocument();
        });
        expect(screen.getByText(new RegExp(ORDER_ONE.placedAt))).toBeInTheDocument();
    });

    it('shows a distinct alert per order placed in quick succession', async () => {
        renderWithProviders(<Harness />);

        pushOrder(ORDER_ONE);
        pushOrder(ORDER_TWO);

        await waitFor(() => {
            expect(screen.getByText(ORDER_ONE.orderNumber)).toBeInTheDocument();
            expect(screen.getByText(ORDER_TWO.orderNumber)).toBeInTheDocument();
        });
    });

    it('ignores non-order-placed notifications on the shared channel', async () => {
        renderWithProviders(<Harness />);

        act(() => {
            capturedOnNotification?.({
                type: 'payment-success',
                orderId: 'ord-8001',
                slugId: 'ORD-20260625-1042',
                message: 'Payment confirmed',
                timestamp: '2026-06-25T12:04:00.000Z',
            });
        });

        await new Promise(resolve => setTimeout(resolve, 50));
        expect(screen.queryByText(ORDER_ONE.orderNumber)).not.toBeInTheDocument();
    });

    it('navigates to the admin order detail when an alert is acted on', async () => {
        renderWithProviders(<Harness />);

        pushOrder(ORDER_ONE);

        const viewButton = await screen.findByRole('button', { name: /view order/i });
        await userEvent.click(viewButton);

        expect(navigateMock).toHaveBeenCalledWith(`/admin/orders/${ORDER_ONE.orderId}`);
    });

    it('exposes the live-feed status from the SignalR subscription', () => {
        mockStatus = PaymentSignalRStatus.Connecting;
        renderWithProviders(<Harness />);

        expect(screen.getByTestId('feed-status')).toHaveTextContent(PaymentSignalRStatus.Connecting);
    });
});
