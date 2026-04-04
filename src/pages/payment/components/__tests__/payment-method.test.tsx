import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaymentMethod from '../payment-method';

import { PaymentMethodEnum } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

describe('PaymentMethod', () => {
    it('renders Cash on Delivery option always', () => {
        renderWithProviders(
            <PaymentMethod
                value={PaymentMethodEnum.CashOnDelivery}
                onValueChange={() => {}}
                bankAccountConfigured={false}
            />
        );

        expect(screen.getByText('Cash on Delivery')).toBeInTheDocument();
    });

    it('renders Banking option when bankAccountConfigured is true', () => {
        renderWithProviders(
            <PaymentMethod
                value={PaymentMethodEnum.CashOnDelivery}
                onValueChange={() => {}}
                bankAccountConfigured={true}
            />
        );

        expect(screen.getByText('Banking')).toBeInTheDocument();
        expect(screen.getByText('Online banking transfer')).toBeInTheDocument();
    });

    it('does NOT render Banking option when bankAccountConfigured is false', () => {
        renderWithProviders(
            <PaymentMethod
                value={PaymentMethodEnum.CashOnDelivery}
                onValueChange={() => {}}
                bankAccountConfigured={false}
            />
        );

        expect(screen.queryByText('Banking')).not.toBeInTheDocument();
    });

    it('does NOT render Banking option when bankAccountConfigured is undefined', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(screen.queryByText('Banking')).not.toBeInTheDocument();
    });
});
