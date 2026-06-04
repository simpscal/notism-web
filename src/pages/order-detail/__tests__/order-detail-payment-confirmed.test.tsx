import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import OrderDetail from '../order-detail';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

// Mock SignalR so tests don't attempt real WebSocket connections
vi.mock('@/features/payment', async importOriginal => {
    const actual = await importOriginal<typeof import('@/features/payment')>();
    return {
        ...actual,
        usePaymentSignalR: vi.fn(),
    };
});

// Mock useParams to provide the order id
vi.mock('react-router-dom', async importOriginal => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useParams: () => ({ id: 'test-order-id' }),
    };
});

const BASE_ORDER = {
    id: 'test-order-id',
    slugId: 'ORD-20260601-7843',
    totalAmount: 150000,
    paymentMethod: 'banking',
    paymentStatus: 'unpaid',
    paidAt: null,
    deliveryStatus: 'orderPlaced',
    deliveryNotes: null,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
    paymentQr: null,
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
        orderPlacedCompletedAt: null,
        preparingCompletedAt: null,
        onTheWayCompletedAt: null,
        deliveredCompletedAt: null,
    },
};

const PAID_BANKING_ORDER = {
    ...BASE_ORDER,
    paymentStatus: 'paid',
    paidAt: '2026-06-01T10:30:00Z',
};

const UNPAID_BANKING_ORDER = {
    ...BASE_ORDER,
    paymentStatus: 'unpaid',
};

const COD_ORDER = {
    ...BASE_ORDER,
    paymentMethod: 'cashOnDelivery',
    paymentStatus: 'unpaid',
};

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('OrderDetail — payment confirmed panel', () => {
    it('shows payment confirmed panel for banking order with paid status', async () => {
        server.use(
            http.get('http://localhost:5000/api/orders/test-order-id', () => HttpResponse.json(PAID_BANKING_ORDER))
        );

        renderWithProviders(<OrderDetail />);

        // Wait for the confirmed panel — it has aria-live="polite"
        const panels = await screen.findAllByRole('status');
        const confirmedPanel = panels.find(el => el.getAttribute('aria-live') === 'polite');
        expect(confirmedPanel).toBeInTheDocument();

        expect(screen.getByText(t('orderDetail.paymentConfirmed.title'))).toBeInTheDocument();
        // The slug ID badge should appear inside the confirmed panel
        expect(within(confirmedPanel!).getByText('ORD-20260601-7843')).toBeInTheDocument();
    });

    it('does not show payment confirmed panel for unpaid banking order', async () => {
        server.use(
            http.get('http://localhost:5000/api/orders/test-order-id', () => HttpResponse.json(UNPAID_BANKING_ORDER))
        );

        renderWithProviders(<OrderDetail />);

        // Wait for the order to load (order items heading should appear)
        await screen.findByText(t('orderDetail.orderItems'));

        // No element with aria-live="polite" (the confirmed panel marker) should exist
        const statusEls = screen.queryAllByRole('status');
        const confirmedPanel = statusEls.find(el => el.getAttribute('aria-live') === 'polite');
        expect(confirmedPanel).toBeUndefined();
    });

    it('does not show payment confirmed panel for COD order', async () => {
        server.use(http.get('http://localhost:5000/api/orders/test-order-id', () => HttpResponse.json(COD_ORDER)));

        renderWithProviders(<OrderDetail />);

        await screen.findByText(t('orderDetail.orderItems'));

        const statusEls = screen.queryAllByRole('status');
        const confirmedPanel = statusEls.find(el => el.getAttribute('aria-live') === 'polite');
        expect(confirmedPanel).toBeUndefined();
    });

    it('displays formatted total amount inside the confirmed panel', async () => {
        server.use(
            http.get('http://localhost:5000/api/orders/test-order-id', () => HttpResponse.json(PAID_BANKING_ORDER))
        );

        renderWithProviders(<OrderDetail />);

        const panels = await screen.findAllByRole('status');
        const confirmedPanel = panels.find(el => el.getAttribute('aria-live') === 'polite');

        // Amount 150000 formatted as "150,000 ₫" should appear inside the confirmed panel
        expect(confirmedPanel).toHaveTextContent('150,000');
    });
});
