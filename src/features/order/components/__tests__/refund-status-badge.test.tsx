import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RefundStatusBadge from '../refund-status-badge';

import { RefundStatusEnum } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

describe('RefundStatusBadge', () => {
    it('renders "Pending" badge with warning variant when status is Pending', () => {
        renderWithProviders(<RefundStatusBadge status={RefundStatusEnum.Pending} />);

        const badge = screen.getByText('Pending');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-warning');
    });

    it('renders "Paid" badge with success variant when status is Paid', () => {
        renderWithProviders(<RefundStatusBadge status={RefundStatusEnum.Paid} />);

        const badge = screen.getByText('Paid');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-success');
    });

    it('renders "Failed" badge with destructive variant when status is Failed', () => {
        renderWithProviders(<RefundStatusBadge status={RefundStatusEnum.Failed} />);

        const badge = screen.getByText('Failed');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-destructive-foreground');
    });

    it('renders "Processing" badge with a spinner when status is Processing', () => {
        renderWithProviders(<RefundStatusBadge status={RefundStatusEnum.Processing} />);

        const badge = screen.getByText('Processing');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-secondary-foreground');
    });
});
