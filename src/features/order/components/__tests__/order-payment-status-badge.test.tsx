import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OrderPaymentStatusBadge from '../order-payment-status-badge';

import { renderWithProviders } from '@/test/utils';

describe('OrderPaymentStatusBadge', () => {
    it('renders "Paid" badge with success variant when paymentStatus is paid', () => {
        renderWithProviders(<OrderPaymentStatusBadge paymentStatus='paid' />);

        const badge = screen.getByText('Paid');
        expect(badge).toBeInTheDocument();
    });

    it('renders "Pending Payment" badge with secondary variant when paymentStatus is unpaid', () => {
        renderWithProviders(<OrderPaymentStatusBadge paymentStatus='unpaid' />);

        const badge = screen.getByText('Pending Payment');
        expect(badge).toBeInTheDocument();
    });

    it('renders "Pending Payment" badge for an unknown paymentStatus value', () => {
        renderWithProviders(<OrderPaymentStatusBadge paymentStatus='unknown' />);

        const badge = screen.getByText('Pending Payment');
        expect(badge).toBeInTheDocument();
    });
});
