import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import Payment from '../payment';

import { ORDER_ENDPOINTS } from '@/apis/order/order.constant';
import i18n from '@/app/i18n/i18n';
import { buildUrl } from '@/mocks/utils';
import { server } from '@/test/server';
import { getByI18nText, queryByI18nText, renderWithProviders } from '@/test/utils';

vi.mock('@/features/order', async importOriginal => {
    const actual = await importOriginal<typeof import('@/features/order')>();
    return {
        ...actual,
        useNotifications: vi.fn(),
    };
});

vi.mock('@/features/cart/store', async importOriginal => {
    const original = await importOriginal<typeof import('@/features/cart/store')>();
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

const CREATE_ORDER_URL = buildUrl(ORDER_ENDPOINTS.BASE);
const BANKING_CHECKOUT_URL = buildUrl(ORDER_ENDPOINTS.BANKING_CHECKOUT);

const STORE_BANK_ACCOUNT = {
    bankCode: 'VCB',
    accountNumber: '1234567890',
    accountHolderName: 'Store Account',
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Default success handlers; individual tests layer overrides on top via server.use().
beforeEach(() => {
    server.use(
        http.post(CREATE_ORDER_URL, () => HttpResponse.json({ slugId: 'ORD-001' }, { status: 201 })),
        http.post(BANKING_CHECKOUT_URL, () =>
            HttpResponse.json({ checkoutId: '550e8400-e29b-41d4-a716-446655440000', bankAccount: STORE_BANK_ACCOUNT })
        )
    );
});

const t = (key: string) => i18n.t(key);

describe('Payment — Banking Checkout Transition', () => {
    it('shows the SePay QR panel built from the store bank account in the checkout response', async () => {
        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') })).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') }));

        await waitFor(() => {
            expect(getByI18nText('payment.bankTransfer.title')).toBeInTheDocument();
        });

        expect(screen.getByText(STORE_BANK_ACCOUNT.accountNumber)).toBeInTheDocument();

        const img = screen.getByRole('img', { name: t('payment.bankTransfer.qrImageAlt') });
        const src = new URL(img.getAttribute('src') ?? '');

        expect(`${src.origin}${src.pathname}`).toBe('https://qr.sepay.vn/img');
        expect(src.searchParams.get('bank')).toBe(STORE_BANK_ACCOUNT.bankCode);
        expect(src.searchParams.get('acc')).toBe(STORE_BANK_ACCOUNT.accountNumber);
        expect(src.searchParams.get('amount')).toBe('50000');
        expect(src.searchParams.get('des')).toBe('550e8400e29b41d4a716446655440000');
    });

    it('shows the unavailable terminal state (no perpetual spinner) when the checkout response has no bank account', async () => {
        server.use(
            http.post(BANKING_CHECKOUT_URL, () =>
                HttpResponse.json({ checkoutId: '550e8400-e29b-41d4-a716-446655440000', bankAccount: null })
            )
        );

        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') })).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') }));

        await waitFor(() => {
            expect(getByI18nText('payment.bankTransfer.notAvailableTitle')).toBeInTheDocument();
        });

        expect(getByI18nText('payment.bankTransfer.notAvailableDescription')).toBeInTheDocument();
        expect(queryByI18nText('payment.bankTransfer.title')).not.toBeInTheDocument();
    });

    it('shows a spinner while the checkout request is in flight', async () => {
        server.use(
            http.post(BANKING_CHECKOUT_URL, async () => {
                await delay('infinite');
                return HttpResponse.json({ checkoutId: 'x', bankAccount: STORE_BANK_ACCOUNT });
            })
        );

        const { container } = renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') })).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') }));

        await waitFor(() => {
            expect(container.querySelector('.animate-spin')).toBeTruthy();
        });

        expect(queryByI18nText('payment.bankTransfer.title')).not.toBeInTheDocument();
        expect(queryByI18nText('payment.bankTransfer.notAvailableTitle')).not.toBeInTheDocument();
    });

    it('shows the error state when the checkout request fails', async () => {
        server.use(
            http.post(BANKING_CHECKOUT_URL, () => HttpResponse.json({ message: 'Server error' }, { status: 500 }))
        );

        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') })).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: new RegExp(t('payment.banking'), 'i') }));

        await waitFor(() => {
            expect(getByI18nText('payment.bankTransfer.loadErrorTitle')).toBeInTheDocument();
        });

        expect(queryByI18nText('payment.bankTransfer.title')).not.toBeInTheDocument();
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

        expect(queryByI18nText('payment.awaitingTransfer')).not.toBeInTheDocument();
    });
});
