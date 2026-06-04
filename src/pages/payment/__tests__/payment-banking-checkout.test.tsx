import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import Payment from '../payment';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

vi.mock('@/features/payment', async importOriginal => {
    const actual = await importOriginal<typeof import('@/features/payment')>();
    return {
        ...actual,
        usePaymentSignalR: vi.fn(),
    };
});

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
    customisations: [],
    totalSurcharge: 0,
};

const CREATE_ORDER_URL = '*/orders';
const BANKING_CHECKOUT_URL = '*/payments/banking/checkout';
const BANK_ACCOUNT_URL = '*/payments/bank-account';

const server = setupServer(
    http.post(CREATE_ORDER_URL, () => HttpResponse.json({ slugId: 'ORD-001' }, { status: 201 })),
    http.post(BANKING_CHECKOUT_URL, () => HttpResponse.json({ checkoutId: '550e8400-e29b-41d4-a716-446655440000' })),
    http.get(BANK_ACCOUNT_URL, () =>
        HttpResponse.json({
            bankCode: 'VCB',
            accountNumber: '1234567890',
            accountHolderName: 'Test Account',
        })
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const t = (key: string) => i18n.t(key);

describe('Payment — Banking Checkout Transition', () => {
    it('auto-initiates banking checkout when banking radio is selected', async () => {
        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') })).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') }));

        // After selecting banking, checkout is auto-initiated → QR card appears
        await waitFor(() => {
            expect(screen.getByText(t('payment.qr.completePayment'))).toBeInTheDocument();
        });
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

        const placeOrderBtn = screen.getByRole('button', { name: /place order/i });
        await userEvent.click(placeOrderBtn);

        await waitFor(() => {
            expect(orderCreated).toBe(true);
        });

        expect(screen.queryByText(t('payment.awaitingTransfer'))).not.toBeInTheDocument();
    });
});
