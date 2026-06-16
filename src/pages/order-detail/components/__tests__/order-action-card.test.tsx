import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import OrderActionCard, { type OrderActionCardProps } from '../order-action-card';

import i18n from '@/app/i18n/i18n';
import { DeliveryStatusEnum, PaymentMethodEnum, type RefundSummaryViewModel } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const withinWindow = () => new Date(Date.now() - 60 * 60 * 1000).toISOString();
const beyondWindow = () => new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

const PENDING_REFUND: RefundSummaryViewModel = {
    id: 'refund-1',
    slugId: 'REF-0001',
    orderId: 'order-1',
    orderSlugId: 'ORD-0001',
    amount: 485000,
    status: 'pending',
    createdAt: '2026-06-13T10:00:00Z',
    paidAt: null,
};

const PAID_REFUND: RefundSummaryViewModel = {
    ...PENDING_REFUND,
    status: 'paid',
    paidAt: '2026-06-14T10:00:00Z',
};

const baseProps: OrderActionCardProps = {
    slugId: 'ORD-0001',
    orderDate: '12 June 2026, 09:02',
    deliveryStatus: DeliveryStatusEnum.Delivered,
    totalAmount: 485000,
    paymentMethod: PaymentMethodEnum.Banking,
    deliveredCompletedAt: withinWindow(),
    refund: null,
};

const renderCard = (overrides: Partial<OrderActionCardProps> = {}) =>
    renderWithProviders(<OrderActionCard {...baseProps} {...overrides} />);

describe('OrderActionCard — refund region', () => {
    it('shows the "Request refund" action for a delivered bank-transfer order within 24h with no refund', () => {
        renderCard({ onConfirmRefund: vi.fn() });

        expect(screen.getByRole('button', { name: t('orderDetail.requestRefund') })).toBeInTheDocument();
    });

    it('hides the action for a cash-on-delivery order', () => {
        renderCard({ paymentMethod: PaymentMethodEnum.CashOnDelivery, onConfirmRefund: vi.fn() });

        expect(screen.queryByRole('button', { name: t('orderDetail.requestRefund') })).not.toBeInTheDocument();
    });

    it('hides the action beyond the 24h window', () => {
        renderCard({ deliveredCompletedAt: beyondWindow(), onConfirmRefund: vi.fn() });

        expect(screen.queryByRole('button', { name: t('orderDetail.requestRefund') })).not.toBeInTheDocument();
    });

    it('hides the action for a not-yet-delivered order', () => {
        renderCard({ deliveryStatus: DeliveryStatusEnum.Preparing, onConfirmRefund: vi.fn() });

        expect(screen.queryByRole('button', { name: t('orderDetail.requestRefund') })).not.toBeInTheDocument();
    });

    it('opens a confirm dialog and triggers the refund request on confirm', async () => {
        const onConfirmRefund = vi.fn();
        renderCard({ onConfirmRefund });

        await userEvent.click(screen.getByRole('button', { name: t('orderDetail.requestRefund') }));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText(t('orderDetail.requestRefundConfirmTitle'))).toBeInTheDocument();

        await userEvent.click(within(dialog).getByRole('button', { name: t('orderDetail.requestRefund') }));

        expect(onConfirmRefund).toHaveBeenCalledTimes(1);
    });

    it('replaces the action with a "Refund pending" panel when a pending refund exists', () => {
        renderCard({ refund: PENDING_REFUND, onConfirmRefund: vi.fn() });

        expect(screen.queryByRole('button', { name: t('orderDetail.requestRefund') })).not.toBeInTheDocument();
        expect(screen.getByText(t('order.refund.statuses.pending'))).toBeInTheDocument();
    });

    it('shows a "Refund sent" panel when the refund is paid', () => {
        renderCard({ refund: PAID_REFUND, onConfirmRefund: vi.fn() });

        expect(screen.getByText(t('order.refund.statuses.paid'))).toBeInTheDocument();
    });
});
