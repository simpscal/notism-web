import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import Checkout from '../checkout';

import i18n from '@/app/i18n/i18n';
import { PaymentMethodEnum } from '@/features/order';
import { store } from '@/store';

function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
}

function renderCheckoutWithState(state?: { paymentMethod?: PaymentMethodEnum }) {
    const queryClient = createTestQueryClient();

    return render(
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter initialEntries={[{ pathname: '/checkout', state: state ?? null }]}>
                        <Routes>
                            <Route path='/checkout' element={<Checkout />} />
                            <Route path='/payment' element={<div>Payment Page</div>} />
                            <Route path='/cart' element={<div>Cart Page</div>} />
                        </Routes>
                    </MemoryRouter>
                </I18nextProvider>
            </QueryClientProvider>
        </Provider>
    );
}

describe('Checkout', () => {
    it('redirects to /payment when no state is provided', () => {
        renderCheckoutWithState(undefined);

        expect(screen.getByText('Payment Page')).toBeInTheDocument();
    });

    it('redirects to /payment when state does not have banking payment method', () => {
        renderCheckoutWithState({ paymentMethod: PaymentMethodEnum.CashOnDelivery });

        expect(screen.getByText('Payment Page')).toBeInTheDocument();
    });

    it('renders payment type "Banking" when state has banking payment method', () => {
        renderCheckoutWithState({ paymentMethod: PaymentMethodEnum.Banking });

        const bankingElements = screen.getAllByText(i18n.t('payment.banking'));
        expect(bankingElements.length).toBeGreaterThan(0);
    });

    it('renders pending status badge when banking state is provided', () => {
        renderCheckoutWithState({ paymentMethod: PaymentMethodEnum.Banking });

        expect(screen.getByText(i18n.t('checkout.pending'))).toBeInTheDocument();
    });

    it('renders Place Order button in disabled state', () => {
        renderCheckoutWithState({ paymentMethod: PaymentMethodEnum.Banking });

        const placeOrderButton = screen.getByRole('button', { name: i18n.t('payment.placeOrder') });
        expect(placeOrderButton).toBeDisabled();
    });

    it('navigates to cart when Back to Cart is clicked', async () => {
        const user = userEvent.setup();
        renderCheckoutWithState({ paymentMethod: PaymentMethodEnum.Banking });

        const backToCartButton = screen.getByRole('button', { name: i18n.t('payment.backToCart') });
        await user.click(backToCartButton);

        expect(screen.getByText('Cart Page')).toBeInTheDocument();
    });
});
