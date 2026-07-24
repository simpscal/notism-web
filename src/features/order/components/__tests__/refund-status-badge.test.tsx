import { describe, expect, it } from 'vitest';

import RefundStatusBadge from '../refund-status-badge';

import { RefundStatusType } from '@/features/order';
import { getByI18nText, renderWithProviders } from '@/test/utils';

describe('RefundStatusBadge', () => {
    it('renders "Pending" badge with warning variant when status is Pending', () => {
        renderWithProviders(<RefundStatusBadge status={RefundStatusType.Pending} />);

        const badge = getByI18nText('order.refund.statuses.pending');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-warning');
    });

    it('renders "Paid" badge with success variant when status is Paid', () => {
        renderWithProviders(<RefundStatusBadge status={RefundStatusType.Paid} />);

        const badge = getByI18nText('order.refund.statuses.paid');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-success');
    });

    it('renders "Failed" badge with destructive variant when status is Failed', () => {
        renderWithProviders(<RefundStatusBadge status={RefundStatusType.Failed} />);

        const badge = getByI18nText('order.refund.statuses.failed');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-destructive-foreground');
    });

    it('renders "Processing" badge with a spinner when status is Processing', () => {
        renderWithProviders(<RefundStatusBadge status={RefundStatusType.Processing} />);

        const badge = getByI18nText('order.refund.statuses.processing');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-secondary-foreground');
    });
});
