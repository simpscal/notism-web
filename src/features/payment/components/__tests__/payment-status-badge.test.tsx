import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaymentStatusBadge from '../payment-status-badge';

import { PaymentStatusEnum } from '@/features/payment';
import { renderWithProviders } from '@/test/utils';

describe('PaymentStatusBadge', () => {
    it('renders "Paid" badge with success variant when paymentStatus is Paid', () => {
        renderWithProviders(<PaymentStatusBadge paymentStatus={PaymentStatusEnum.Paid} />);

        const badge = screen.getByText('Paid');
        expect(badge).toBeInTheDocument();
    });

    it('renders "Pending Payment" badge with secondary variant when paymentStatus is Unpaid', () => {
        renderWithProviders(<PaymentStatusBadge paymentStatus={PaymentStatusEnum.Unpaid} />);

        const badge = screen.getByText('Pending Payment');
        expect(badge).toBeInTheDocument();
    });
});
