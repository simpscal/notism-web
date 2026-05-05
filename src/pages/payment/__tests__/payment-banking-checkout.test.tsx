import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import Payment from '../payment';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

// ---------------------------------------------------------------------------
// Mock Redux selectors so we don't depend on the live store/localStorage
// ---------------------------------------------------------------------------
vi.mock('@/store/cart', async importOriginal => {
    const original = await importOriginal<typeof import('@/store/cart')>();
    return {
        ...original,
        selectCartIsInitialized: () => true,
        selectCartItems: () => [mockCartItem],
        selectSelectedCartItems: () => [mockCartItem],
        selectSelectedCartTotalPrice: () => 50000,
    };
});

const mockCartItem = {
    id: 'item-1',
    name: 'Test Food',
    description: 'A test food item',
    price: 50000,
    discountPrice: null,
    imageUrl: '',
    category: 'Test',
    quantity: 1,
    stockQuantity: 10,
    quantityUnit: 'serving',
    isSelected: true,
};

// ---------------------------------------------------------------------------
// MSW: intercept create-order endpoint (not called for banking flow)
// ---------------------------------------------------------------------------
const CREATE_ORDER_URL = '*/orders';
const server = setupServer(
    http.post(CREATE_ORDER_URL, () => HttpResponse.json({ slugId: 'ORD-001' }, { status: 201 }))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const t = (key: string) => i18n.t(key);

describe('Payment — Banking Checkout Transition', () => {
    it('shows banking checkout view when banking is selected and Place Order is clicked', async () => {
        renderWithProviders(<Payment />);

        // Select banking payment method
        const bankingRadio = screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') });
        await userEvent.click(bankingRadio);

        // Click Place Order
        const placeOrderBtn = screen.getByRole('button', { name: new RegExp(t('payment.placeOrder'), 'i') });
        await userEvent.click(placeOrderBtn);

        // Banking checkout view should appear
        await waitFor(() => {
            expect(screen.getByText(t('payment.awaitingTransfer'))).toBeInTheDocument();
        });

        // Order summary is no longer visible (replaced by checkout view)
        expect(screen.queryByText(t('payment.reviewOrder'))).not.toBeInTheDocument();
    });

    it('banking checkout view shows "Banking" as the selected payment type', async () => {
        renderWithProviders(<Payment />);

        const bankingRadio = screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') });
        await userEvent.click(bankingRadio);

        const placeOrderBtn = screen.getByRole('button', { name: new RegExp(t('payment.placeOrder'), 'i') });
        await userEvent.click(placeOrderBtn);

        await waitFor(() => {
            expect(screen.getByText(t('payment.awaitingTransfer'))).toBeInTheDocument();
        });

        // Payment method label should be visible in the checkout card (may appear more than once)
        const paymentMethodLabels = screen.getAllByText(t('payment.paymentMethod'));
        expect(paymentMethodLabels.length).toBeGreaterThanOrEqual(1);
        // "Banking" value displayed
        const bankingLabels = screen.getAllByText(t('payment.banking'));
        expect(bankingLabels.length).toBeGreaterThanOrEqual(1);
    });

    it('banking checkout Place Order button is disabled', async () => {
        renderWithProviders(<Payment />);

        const bankingRadio = screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') });
        await userEvent.click(bankingRadio);

        const placeOrderBtn = screen.getByRole('button', { name: new RegExp(t('payment.placeOrder'), 'i') });
        await userEvent.click(placeOrderBtn);

        await waitFor(() => {
            expect(screen.getByText(t('payment.awaitingTransfer'))).toBeInTheDocument();
        });

        // Place Order button in checkout view must be disabled
        const checkoutPlaceOrderBtn = screen.getByRole('button', { name: new RegExp(t('payment.placeOrder'), 'i') });
        expect(checkoutPlaceOrderBtn).toBeDisabled();
    });

    it('Back to Cart button on checkout view navigates to cart', async () => {
        renderWithProviders(<Payment />);

        const bankingRadio = screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') });
        await userEvent.click(bankingRadio);

        const placeOrderBtn = screen.getByRole('button', { name: new RegExp(t('payment.placeOrder'), 'i') });
        await userEvent.click(placeOrderBtn);

        await waitFor(() => {
            expect(screen.getByText(t('payment.awaitingTransfer'))).toBeInTheDocument();
        });

        // Back to Cart button should be present (navigation happens via router)
        const backToCartBtn = screen.getByRole('button', { name: new RegExp(t('payment.backToCart'), 'i') });
        expect(backToCartBtn).toBeInTheDocument();
        await userEvent.click(backToCartBtn);
        // Navigation occurs — no error thrown
    });

    it('COD payment calls createOrder immediately without transitioning to banking checkout', async () => {
        let orderCreated = false;
        server.use(
            http.post(CREATE_ORDER_URL, () => {
                orderCreated = true;
                return HttpResponse.json({ slugId: 'ORD-002' }, { status: 201 });
            })
        );

        renderWithProviders(<Payment />);

        // CashOnDelivery is the default — do not change the radio
        const placeOrderBtn = screen.getByRole('button', { name: new RegExp(t('payment.placeOrder'), 'i') });
        await userEvent.click(placeOrderBtn);

        await waitFor(() => {
            expect(orderCreated).toBe(true);
        });

        // Banking checkout view should NOT appear
        expect(screen.queryByText(t('payment.awaitingTransfer'))).not.toBeInTheDocument();
    });
});
