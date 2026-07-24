import { describe, expect, it } from 'vitest';

import PaymentStatusBadge from '../payment-status-badge';

import { PaymentStatusType } from '@/features/order';
import { getByI18nText, renderWithProviders } from '@/test/utils';

describe('PaymentStatusBadge', () => {
    it('renders "Paid" badge with success variant when paymentStatus is Paid', () => {
        renderWithProviders(<PaymentStatusBadge paymentStatus={PaymentStatusType.Paid} />);

        const badge = getByI18nText('payment.statuses.paid');
        expect(badge).toBeInTheDocument();
    });

    it('renders "Pending Payment" badge with secondary variant when paymentStatus is Unpaid', () => {
        renderWithProviders(<PaymentStatusBadge paymentStatus={PaymentStatusType.Unpaid} />);

        const badge = getByI18nText('payment.statuses.unpaid');
        expect(badge).toBeInTheDocument();
    });

    it('renders "Failed" badge when paymentStatus is Failed', () => {
        renderWithProviders(<PaymentStatusBadge paymentStatus={PaymentStatusType.Failed} />);

        const badge = getByI18nText('payment.statuses.failed');
        expect(badge).toBeInTheDocument();
    });

    it('renders "Refunded" badge with warning variant when paymentStatus is Refunded', () => {
        renderWithProviders(<PaymentStatusBadge paymentStatus={PaymentStatusType.Refunded} />);

        const badge = getByI18nText('payment.statuses.refunded');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-warning');
    });
});
