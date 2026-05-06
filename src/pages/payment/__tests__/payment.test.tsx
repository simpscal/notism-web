import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import Payment from '../payment';

import i18n from '@/app/i18n/i18n';
import { PaymentNotificationType } from '@/features/payment';
import { store } from '@/store';
import { loadCart } from '@/store/cart';
import { renderWithProviders } from '@/test/utils';

const t = (key: string) => i18n.t(key);

// Mock SignalR so tests don't attempt real WebSocket connections
vi.mock('@/features/payment', async importOriginal => {
    const actual = await importOriginal<typeof import('@/features/payment')>();
    return {
        ...actual,
        usePaymentSignalR: vi.fn(),
    };
});

const BANK_ACCOUNT_URL = '*/payments/bank-account';

const server = setupServer(
    http.get(BANK_ACCOUNT_URL, () =>
        HttpResponse.json({
            bankCode: 'VCB',
            accountNumber: '1234567890',
            accountHolderName: 'Nguyen Van A',
        })
    )
);

const CART_STORAGE_KEY = 'cart_items';

const MOCK_CART_ITEM = {
    id: 'item-1',
    name: 'Test Food',
    description: 'A test food item',
    price: 50000,
    discountPrice: null,
    imageUrl: '',
    category: 'Test',
    quantity: 2,
    stockQuantity: 10,
    quantityUnit: 'portion',
    isSelected: true,
};

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    localStorage.removeItem(CART_STORAGE_KEY);
});
afterAll(() => server.close());

// Seed Redux cart state via localStorage before each test
beforeEach(async () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([MOCK_CART_ITEM]));
    await act(async () => {
        await store.dispatch(loadCart());
    });
});

describe('Payment — bankingCheckout flow', () => {
    it('renders Place Order button in normal flow (not banking checkout)', async () => {
        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: t('payment.placeOrder') })).toBeInTheDocument();
        });
    });

    it('renders pending badge and disabled View Order button after banking method triggers checkout', async () => {
        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByText(t('payment.banking'))).toBeInTheDocument();
        });

        const bankingOption = screen.getByRole('radio', { name: /banking/i });
        await userEvent.click(bankingOption);

        // Click Place Order to enter bankingCheckout mode
        const placeOrderBtn = screen.getByRole('button', { name: t('payment.placeOrder') });
        await userEvent.click(placeOrderBtn);

        // Should now show the banking checkout view with Pending badge
        await waitFor(() => {
            expect(screen.getByText(t('payment.pending'))).toBeInTheDocument();
        });

        // View Order button should be disabled
        const disabledBtn = screen.getByRole('button', { name: t('payment.viewOrder') });
        expect(disabledBtn).toBeDisabled();
    });

    it('shows confirmed badge and active View Order button after payment notification arrives', async () => {
        const { usePaymentSignalR } = await import('@/features/payment');
        const mockUsePaymentSignalR = vi.mocked(usePaymentSignalR);

        let capturedCallback:
            | ((payload: { type: string; orderId: string; slugId: string; message: string; timestamp: string }) => void)
            | null = null;

        mockUsePaymentSignalR.mockImplementation(({ onNotification }) => {
            capturedCallback = onNotification as typeof capturedCallback;
        });

        renderWithProviders(<Payment />);

        // Enter banking checkout mode
        await waitFor(() => {
            expect(screen.getByText(t('payment.banking'))).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: /banking/i }));
        await userEvent.click(screen.getByRole('button', { name: t('payment.placeOrder') }));

        await waitFor(() => {
            expect(screen.getByText(t('payment.pending'))).toBeInTheDocument();
        });

        // Simulate payment success notification
        expect(capturedCallback).not.toBeNull();

        act(() => {
            capturedCallback!({
                type: PaymentNotificationType.Success,
                orderId: 'order-id-1',
                slugId: 'ORD-TEST123',
                message: 'Payment confirmed',
                timestamp: '2026-05-06T00:00:00Z',
            });
        });

        // Badge should switch from pending to confirmed
        await waitFor(() => {
            expect(screen.getByText(t('payment.confirmed'))).toBeInTheDocument();
        });

        expect(screen.queryByText(t('payment.pending'))).not.toBeInTheDocument();

        // View Order button should now be enabled
        const viewOrderBtn = screen.getByRole('button', { name: t('payment.viewOrder') });
        expect(viewOrderBtn).not.toBeDisabled();
    });
});
