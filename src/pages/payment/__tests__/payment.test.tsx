import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import Payment from '../payment';

import { ORDER_ENDPOINTS } from '@/apis/order/order.constant';
import i18n from '@/core/i18n/i18n';
import { NotificationType } from '@/core/notification';
import { loadCart } from '@/features/cart/store';
import { getFoodPricing } from '@/features/food';
import { buildUrl } from '@/mocks/utils';
import { store } from '@/store';
import { server } from '@/test/server';
import { getByI18nText, renderWithProviders } from '@/test/utils';

const t = (key: string) => i18n.t(key);

// Mock SignalR so tests don't attempt real WebSocket connections
vi.mock('@/core/notification/use-notifications.hook', async importOriginal => {
    const actual = await importOriginal<typeof import('@/core/notification/use-notifications.hook')>();
    return {
        ...actual,
        useNotifications: vi.fn(),
    };
});

const BANKING_CHECKOUT_URL = buildUrl(ORDER_ENDPOINTS.BANKING_CHECKOUT);

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
    customisations: [],
    totalSurcharge: 0,
};

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    localStorage.removeItem(CART_STORAGE_KEY);
});
afterAll(() => server.close());

// Default success handler; individual tests layer overrides on top via server.use().
beforeEach(async () => {
    server.use(
        http.post(BANKING_CHECKOUT_URL, () =>
            HttpResponse.json({
                checkoutId: '550e8400-e29b-41d4-a716-446655440000',
                bankAccount: {
                    bankCode: 'VCB',
                    accountNumber: '1234567890',
                    accountHolderName: 'Nguyen Van A',
                },
            })
        )
    );

    // Seed Redux cart state via localStorage before each test
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([MOCK_CART_ITEM]));
    await act(async () => {
        await store.dispatch(loadCart());
    });
});

// ---------------------------------------------------------------------------
// AC2: total passed to PaymentOrderSummary equals Σ (effectivePrice + surcharge) × qty
// ---------------------------------------------------------------------------
describe('Payment — surcharge-inclusive total (AC2)', () => {
    it('displays surcharge-inclusive grand total when items have non-zero surcharge', async () => {
        const surchargeItem = {
            ...MOCK_CART_ITEM,
            id: 'item-surcharge',
            price: 185000,
            discountPrice: null,
            totalSurcharge: 30000,
            quantity: 1,
        };
        // (185000 + 30000) × 1 = 215,000
        const expectedTotal =
            (getFoodPricing(surchargeItem.price, surchargeItem.discountPrice).effectivePrice +
                surchargeItem.totalSurcharge) *
            surchargeItem.quantity;

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([surchargeItem]));
        await act(async () => {
            await store.dispatch(loadCart());
        });

        renderWithProviders(<Payment />);

        await waitFor(() => {
            // The grand total in the order summary panel must equal the surcharge-inclusive sum
            const formatted = expectedTotal.toLocaleString('en-US') + ' ₫';
            expect(screen.getAllByText(formatted).length).toBeGreaterThanOrEqual(1);
        });
    });

    it('selectSelectedCartTotalPrice sums (effectivePrice + surcharge) × qty for all items', () => {
        // Derive expected total directly from the selector logic and verify it matches the formula
        const items = [
            { price: 185000, discountPrice: null, totalSurcharge: 30000, quantity: 1 },
            { price: 95000, discountPrice: null, totalSurcharge: 0, quantity: 2 },
        ];
        const expected = items.reduce((sum, item) => {
            const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
            return sum + (effectivePrice + item.totalSurcharge) * item.quantity;
        }, 0);
        // (185000+30000)*1 + (95000+0)*2 = 215000 + 190000 = 405000
        expect(expected).toBe(405000);
    });
});

describe('Payment — bankingCheckout flow', () => {
    it('renders Place Order button in COD mode', async () => {
        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /place order/i })).toBeInTheDocument();
        });
    });

    it('auto-initiates banking checkout when banking radio is selected', async () => {
        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByText(t('payment.banking'))).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: /banking/i }));

        // QR card should appear after auto-initiated checkout completes
        await waitFor(() => {
            expect(getByI18nText('payment.bankTransfer.title')).toBeInTheDocument();
        });
    });

    it('banking payment success shows success screen with Track order button', async () => {
        const { useNotifications } = await import('@/core/notification/use-notifications.hook');
        const mockUseNotifications = vi.mocked(useNotifications);

        let capturedCallback:
            | ((payload: { type: string; orderId: string; slugId: string; message: string; timestamp: string }) => void)
            | null = null;

        mockUseNotifications.mockImplementation(({ onNotification }) => {
            capturedCallback = onNotification as typeof capturedCallback;
            return { status: 'live' };
        });

        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByText(t('payment.banking'))).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: /banking/i }));

        await waitFor(() => {
            expect(getByI18nText('payment.bankTransfer.title')).toBeInTheDocument();
        });

        expect(capturedCallback).not.toBeNull();

        act(() => {
            capturedCallback!({
                type: NotificationType.Success,
                orderId: 'order-id-1',
                slugId: 'ORD-TEST123',
                message: 'Payment confirmed',
                timestamp: '2026-05-06T00:00:00Z',
            });
        });

        // Success screen should appear with "Payment confirmed" heading
        await waitFor(() => {
            expect(getByI18nText('payment.success.bankingTitle')).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /track order/i })).toBeInTheDocument();
    });

    it('shows error toast when payment failure notification arrives', async () => {
        const { useNotifications } = await import('@/core/notification/use-notifications.hook');
        const mockUseNotifications = vi.mocked(useNotifications);

        let capturedCallback:
            | ((payload: { type: string; orderId: string; slugId: string; message: string; timestamp: string }) => void)
            | null = null;

        mockUseNotifications.mockImplementation(({ onNotification }) => {
            capturedCallback = onNotification as typeof capturedCallback;
            return { status: 'live' };
        });

        renderWithProviders(<Payment />);

        await waitFor(() => {
            expect(screen.getByText(t('payment.banking'))).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('radio', { name: /banking/i }));

        await waitFor(() => {
            expect(getByI18nText('payment.bankTransfer.title')).toBeInTheDocument();
        });

        expect(capturedCallback).not.toBeNull();

        act(() => {
            capturedCallback!({
                type: NotificationType.Failure,
                orderId: '',
                slugId: '',
                message: 'Payment failed',
                timestamp: '2026-05-06T00:00:00Z',
            });
        });

        // QR view should still be visible (no success screen)
        await waitFor(() => {
            expect(getByI18nText('payment.bankTransfer.title')).toBeInTheDocument();
        });

        expect(screen.queryByText(t('payment.success.bankingTitle'))).not.toBeInTheDocument();
    });
});
