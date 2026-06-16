import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import RefundPaidBanner, { type RefundPaidBannerData } from '../refund-paid-banner';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const REFUND: RefundPaidBannerData = {
    refundId: 'rfd-9001',
    orderId: 'A1B2C3',
    orderRef: 'ORD-20260613-0099',
    amount: 485_000,
    sentDate: '13 June 2026, 14:27',
};

const renderBanner = (overrides: Partial<React.ComponentProps<typeof RefundPaidBanner>> = {}) =>
    renderWithProviders(<RefundPaidBanner refund={REFUND} onOpenOrder={vi.fn()} onDismiss={vi.fn()} {...overrides} />);

describe('RefundPaidBanner', () => {
    it('renders the refund-sent title and the order reference', () => {
        renderBanner();

        expect(screen.getByText(t('order.refund.paidBanner.title'))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(REFUND.orderRef))).toBeInTheDocument();
    });

    it('routes to the order when the message region is clicked', async () => {
        const onOpenOrder = vi.fn();
        renderBanner({ onOpenOrder });

        await userEvent.click(screen.getByRole('button', { name: new RegExp(t('order.refund.paidBanner.title')) }));

        expect(onOpenOrder).toHaveBeenCalledWith(REFUND.orderId);
    });

    it('dismisses without routing when the close control is clicked', async () => {
        const onOpenOrder = vi.fn();
        const onDismiss = vi.fn();
        renderBanner({ onOpenOrder, onDismiss });

        await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));

        expect(onDismiss).toHaveBeenCalledWith(REFUND.refundId);
        expect(onOpenOrder).not.toHaveBeenCalled();
    });
});
