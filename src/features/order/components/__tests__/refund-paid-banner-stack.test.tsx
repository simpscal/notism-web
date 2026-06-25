import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import RefundPaidBannerStack from '../refund-paid-banner-stack';

import i18n from '@/app/i18n/i18n';
import type { SharedNotification } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock };
});

let capturedOnNotification: ((payload: SharedNotification) => void) | undefined;

vi.mock('@/features/order/hooks/use-notifications', () => ({
    useNotifications: (options: { onNotification?: (payload: SharedNotification) => void }) => {
        capturedOnNotification = options.onNotification;
    },
}));

interface RefundFixture {
    refundId: string;
    orderId: string;
    orderRef: string;
    amount: number;
    timestamp: string;
}

const REFUND_ONE: RefundFixture = {
    refundId: 'rfd-9001',
    orderId: 'A1B2C3',
    orderRef: 'ORD-20260613-0099',
    amount: 485_000,
    timestamp: '13 June 2026, 14:27',
};

const REFUND_TWO: RefundFixture = {
    refundId: 'rfd-9002',
    orderId: 'D4E5F6',
    orderRef: 'ORD-20260612-0074',
    amount: 215_000,
    timestamp: '12 June 2026, 10:05',
};

const pushRefund = async (payload: RefundFixture) => {
    const { act } = await import('@testing-library/react');
    act(() => {
        capturedOnNotification?.({
            type: 'refund-status-changed',
            status: 'paid',
            refundId: payload.refundId,
            orderId: payload.orderId,
            orderRef: payload.orderRef,
            amount: payload.amount,
            message: 'Your refund has been paid',
            timestamp: payload.timestamp,
        });
    });
};

describe('RefundPaidBannerStack', () => {
    beforeEach(() => {
        navigateMock.mockReset();
        capturedOnNotification = undefined;
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('renders nothing when no refund has been pushed', () => {
        renderWithProviders(<RefundPaidBannerStack />);

        expect(screen.queryByText(t('order.refund.paidBanner.title'))).not.toBeInTheDocument();
    });

    it('shows a banner when a refund-paid event is pushed', async () => {
        renderWithProviders(<RefundPaidBannerStack />);

        await pushRefund(REFUND_ONE);

        expect(screen.getByText(new RegExp(REFUND_ONE.orderRef))).toBeInTheDocument();
    });

    it('stacks one banner per paid refund, newest first', async () => {
        renderWithProviders(<RefundPaidBannerStack />);

        await pushRefund(REFUND_ONE);
        await pushRefund(REFUND_TWO);

        const buttons = screen.getAllByRole('button', { name: new RegExp(t('order.refund.paidBanner.title')) });
        expect(buttons).toHaveLength(2);
        expect(buttons[0]).toHaveTextContent(REFUND_TWO.orderRef);
        expect(buttons[1]).toHaveTextContent(REFUND_ONE.orderRef);
    });

    it('navigates to the order detail when a banner message is clicked', async () => {
        renderWithProviders(<RefundPaidBannerStack />);

        await pushRefund(REFUND_ONE);
        await userEvent.click(screen.getByRole('button', { name: new RegExp(t('order.refund.paidBanner.title')) }));

        expect(navigateMock).toHaveBeenCalledWith(`/orders/${REFUND_ONE.orderId}`);
    });

    it('persists dismissal to localStorage and hides the banner', async () => {
        renderWithProviders(<RefundPaidBannerStack />);

        await pushRefund(REFUND_ONE);
        await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

        expect(screen.queryByText(new RegExp(REFUND_ONE.orderRef))).not.toBeInTheDocument();
        expect(localStorage.getItem('refund-paid-banner-dismissed')).toContain(REFUND_ONE.refundId);
    });

    it('does not re-show a refund that was already dismissed in a previous session', async () => {
        localStorage.setItem('refund-paid-banner-dismissed', JSON.stringify([REFUND_ONE.refundId]));
        renderWithProviders(<RefundPaidBannerStack />);

        await pushRefund(REFUND_ONE);

        expect(screen.queryByText(new RegExp(REFUND_ONE.orderRef))).not.toBeInTheDocument();
    });

    it('ignores non-refund-paid notifications on the shared channel', async () => {
        const { act } = await import('@testing-library/react');
        renderWithProviders(<RefundPaidBannerStack />);

        act(() => {
            capturedOnNotification?.({
                type: 'payment-success',
                orderId: 'A1B2C3',
                slugId: 'ORD-ABC123',
                message: 'Payment confirmed',
                timestamp: '2026-06-13T14:27:00.000Z',
            });
        });

        expect(screen.queryByText(t('order.refund.paidBanner.title'))).not.toBeInTheDocument();
    });
});
