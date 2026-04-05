import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaymentMethod from '../payment-method';

import i18n from '@/app/i18n/i18n';
import { PaymentMethodEnum } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

const t = (key: string) => i18n.t(key);

describe('PaymentMethod', () => {
    it('renders Cash on Delivery option always', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(screen.getByText(t('payment.cashOnDelivery'))).toBeInTheDocument();
    });

    it('renders Banking option always', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(screen.getByText(t('payment.banking'))).toBeInTheDocument();
        expect(screen.getByText(t('payment.onlineBanking'))).toBeInTheDocument();
    });

    it('renders both payment options when value is Cash on Delivery', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.CashOnDelivery} onValueChange={() => {}} />);

        expect(screen.getByText(t('payment.cashOnDelivery'))).toBeInTheDocument();
        expect(screen.getByText(t('payment.banking'))).toBeInTheDocument();
    });

    it('highlights Banking when selected', () => {
        renderWithProviders(<PaymentMethod value={PaymentMethodEnum.Banking} onValueChange={() => {}} />);

        expect(screen.getByText(t('payment.banking'))).toBeInTheDocument();
    });
});
