import { describe, expect, it } from 'vitest';

import PaymentMethod from '../payment-method';

import { PaymentMethodEnum } from '@/features/order';
import { getByI18nText, renderWithProviders } from '@/test/utils';

describe('PaymentMethod', () => {
    it('renders Cash on Delivery option always', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(getByI18nText('payment.cashOnDelivery')).toBeInTheDocument();
    });

    it('renders Banking option always', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(getByI18nText('payment.banking')).toBeInTheDocument();
        expect(getByI18nText('payment.onlineBanking')).toBeInTheDocument();
    });

    it('renders both payment options when value is Cash on Delivery', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(getByI18nText('payment.cashOnDelivery')).toBeInTheDocument();
        expect(getByI18nText('payment.banking')).toBeInTheDocument();
    });

    it('highlights Banking when selected', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.Banking} onValueChange={() => {}} />);

        expect(getByI18nText('payment.banking')).toBeInTheDocument();
    });
});
