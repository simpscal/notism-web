import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaymentMethod from '../payment-method';

import { PaymentMethodEnum } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

describe('PaymentMethod', () => {
    it('renders Cash on Delivery option always', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
    });

    it('renders Banking option always', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(screen.getByText('Banking')).toBeInTheDocument();
        expect(screen.getByText('Online banking transfer')).toBeInTheDocument();
    });

    it('renders both payment options when value is Cash on Delivery', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
        expect(screen.getByText('Banking')).toBeInTheDocument();
    });

    it('highlights Banking when selected', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.Banking} onValueChange={() => {}} />);

        expect(screen.getByText('Banking')).toBeInTheDocument();
    });
});
