import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import OrderDetail from '../order-detail';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const navigateMock = vi.fn();

vi.mock('@/features/payment', async importOriginal => {
    const actual = await importOriginal<typeof import('@/features/payment')>();
    return {
        ...actual,
        usePaymentSignalR: vi.fn(),
    };
});

vi.mock('react-router-dom', async importOriginal => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useParams: () => ({ id: 'test-order-id' }),
        useNavigate: () => navigateMock,
    };
});

const DELIVERED_RECENTLY = new Date(Date.now() - 60 * 60 * 1000).toISOString();

const REFUNDABLE_BANKING_ORDER = {
    id: 'test-order-id',
    slugId: 'ORD-20260601-7843',
    totalAmount: 150000,
    paymentMethod: 'banking',
    paymentStatus: 'paid',
    paidAt: '2026-06-01T10:30:00Z',
    deliveryStatus: 'delivered',
    deliveryNotes: null,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
    paymentQr: null,
    refund: null,
    items: [
        {
            id: 'item-1',
            foodId: 'food-1',
            foodName: 'Test Food',
            unitPrice: 150000,
            discountPrice: 0,
            quantity: 1,
            totalPrice: 150000,
            imageUrl: '',
            surcharge: null,
            customisationLabel: null,
        },
    ],
    deliveryStatusTiming: {
        orderPlacedCompletedAt: '2026-06-01T10:05:00Z',
        preparingCompletedAt: '2026-06-01T10:15:00Z',
        onTheWayCompletedAt: '2026-06-01T10:20:00Z',
        deliveredCompletedAt: DELIVERED_RECENTLY,
    },
};

const BANK_ACCOUNT = {
    bankCode: 'VCB',
    accountNumber: '0123456789',
    accountHolderName: 'Test Customer',
};

const ORDER_URL = 'http://localhost:5000/api/orders/test-order-id';
const BANK_ACCOUNT_URL = 'http://localhost:5000/api/payments/bank-account';
const REQUEST_REFUND_URL = 'http://localhost:5000/api/orders/test-order-id/refund';

let requestRefundCalled = false;

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    navigateMock.mockReset();
    requestRefundCalled = false;
});
afterAll(() => server.close());

function arrangeRequestRefundEndpoint() {
    server.use(
        http.post(REQUEST_REFUND_URL, () => {
            requestRefundCalled = true;
            return HttpResponse.json({});
        })
    );
}

describe('OrderDetail — request refund bank-details gate (AC3)', () => {
    it('calls the request-refund mutation when the customer has bank details on file', async () => {
        server.use(
            http.get(ORDER_URL, () => HttpResponse.json(REFUNDABLE_BANKING_ORDER)),
            http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(BANK_ACCOUNT))
        );
        arrangeRequestRefundEndpoint();

        const user = userEvent.setup();
        renderWithProviders(<OrderDetail />);

        const requestButton = await screen.findByRole('button', { name: t('orderDetail.requestRefund') });
        await user.click(requestButton);

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText(t('orderDetail.requestRefundConfirmTitle'))).toBeInTheDocument();

        const confirmButton = within(dialog).getByRole('button', { name: t('orderDetail.requestRefund') });
        await user.click(confirmButton);

        await waitFor(() => expect(requestRefundCalled).toBe(true));
    });

    it('shows the add-bank-details prompt and does NOT call the mutation when no bank details are on file', async () => {
        server.use(
            http.get(ORDER_URL, () => HttpResponse.json(REFUNDABLE_BANKING_ORDER)),
            http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null))
        );
        arrangeRequestRefundEndpoint();

        const user = userEvent.setup();
        renderWithProviders(<OrderDetail />);

        const requestButton = await screen.findByRole('button', { name: t('orderDetail.requestRefund') });
        await user.click(requestButton);

        const dialog = await screen.findByRole('dialog');
        await waitFor(() => expect(within(dialog).getByText(t('orderDetail.addBankDetailsTitle'))).toBeInTheDocument());
        expect(within(dialog).getByText(t('orderDetail.addBankDetailsDescription'))).toBeInTheDocument();

        const addButton = within(dialog).getByRole('button', { name: t('orderDetail.addBankDetails') });
        expect(addButton).toBeInTheDocument();

        // The mutation must never be called when bank details are missing.
        expect(requestRefundCalled).toBe(false);
    });

    it('navigates to settings/payment when the customer clicks "Add bank details"', async () => {
        server.use(
            http.get(ORDER_URL, () => HttpResponse.json(REFUNDABLE_BANKING_ORDER)),
            http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null))
        );

        const user = userEvent.setup();
        renderWithProviders(<OrderDetail />);

        const requestButton = await screen.findByRole('button', { name: t('orderDetail.requestRefund') });
        await user.click(requestButton);

        const dialog = await screen.findByRole('dialog');
        const addButton = await within(dialog).findByRole('button', { name: t('orderDetail.addBankDetails') });
        await user.click(addButton);

        await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/settings/payment'));
    });
});
