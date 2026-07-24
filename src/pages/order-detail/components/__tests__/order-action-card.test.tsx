import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import OrderActionCard, { type OrderActionCardProps } from '../order-action-card';

import type { RefundSummaryModel } from '@/apis';
import i18n from '@/app/i18n/i18n';
import { DeliveryStatusType, PaymentMethodType } from '@/features/order';
import { getByI18nText, renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const withinWindow = () => new Date(Date.now() - 60 * 60 * 1000).toISOString();
const beyondWindow = () => new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

const PENDING_REFUND: RefundSummaryModel = {
    id: 'refund-1',
    slugId: 'REF-0001',
    orderId: 'order-1',
    orderSlugId: 'ORD-0001',
    amount: 485000,
    status: 'pending',
    createdAt: '2026-06-13T10:00:00Z',
    paidAt: null,
    transferReference: null,
};

const PAID_REFUND: RefundSummaryModel = {
    ...PENDING_REFUND,
    status: 'paid',
    paidAt: '2026-06-14T10:00:00Z',
    transferReference: 'VCB-TRF-20260613-0099431',
};

const baseProps: OrderActionCardProps = {
    slugId: 'ORD-0001',
    orderDate: '12 June 2026, 09:02',
    deliveryStatus: DeliveryStatusType.Delivered,
    totalAmount: 485000,
    paymentMethod: PaymentMethodType.Banking,
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

    it('shows the action for a delivered cash-on-delivery order within 24h with no refund', () => {
        renderCard({ paymentMethod: PaymentMethodType.CashOnDelivery, onConfirmRefund: vi.fn() });

        expect(screen.getByRole('button', { name: t('orderDetail.requestRefund') })).toBeInTheDocument();
    });

    it('hides the action beyond the 24h window', () => {
        renderCard({ deliveredCompletedAt: beyondWindow(), onConfirmRefund: vi.fn() });

        expect(screen.queryByRole('button', { name: t('orderDetail.requestRefund') })).not.toBeInTheDocument();
    });

    it('hides the action for a not-yet-delivered order', () => {
        renderCard({ deliveryStatus: DeliveryStatusType.Preparing, onConfirmRefund: vi.fn() });

        expect(screen.queryByRole('button', { name: t('orderDetail.requestRefund') })).not.toBeInTheDocument();
    });

    it('opens a confirm dialog and triggers the refund request on confirm', async () => {
        const onConfirmRefund = vi.fn();
        renderCard({ onConfirmRefund, hasBankDetails: true });

        await userEvent.click(screen.getByRole('button', { name: t('orderDetail.requestRefund') }));

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText(t('orderDetail.requestRefundConfirmTitle'))).toBeInTheDocument();

        await userEvent.click(within(dialog).getByRole('button', { name: t('orderDetail.requestRefund') }));

        expect(onConfirmRefund).toHaveBeenCalledTimes(1);
    });

    it('replaces the action with a "Refund pending" panel when a pending refund exists', () => {
        renderCard({ refund: PENDING_REFUND, onConfirmRefund: vi.fn() });

        expect(screen.queryByRole('button', { name: t('orderDetail.requestRefund') })).not.toBeInTheDocument();
        expect(getByI18nText('order.refund.statuses.pending')).toBeInTheDocument();
    });

    it('shows a "Refund sent" panel when the refund is paid', () => {
        renderCard({ refund: PAID_REFUND, onConfirmRefund: vi.fn() });

        expect(getByI18nText('order.refund.statuses.paid')).toBeInTheDocument();
    });

    it('shows the transfer reference on the paid panel', () => {
        renderCard({ refund: PAID_REFUND, onConfirmRefund: vi.fn() });

        expect(screen.getByText(PAID_REFUND.transferReference!)).toBeInTheDocument();
        expect(getByI18nText('orderDetail.refund.transferReference')).toBeInTheDocument();
    });
});
