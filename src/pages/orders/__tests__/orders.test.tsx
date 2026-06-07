import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import Orders from '../orders';

import { PAGE_SIZE } from '@/app/constants';
import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const ORDERS_URL = 'http://localhost:5000/api/orders';

// react-intersection-observer never reports inView in jsdom, so drive the
// sentinel via a controllable flag. Default is true (simulates the sentinel
// being scrolled into view); the "first batch only" test flips it off to
// represent the un-scrolled initial render.
let mockInView = true;
vi.mock('react-intersection-observer', () => ({
    useInView: () => ({ ref: vi.fn(), inView: mockInView }),
}));

const makeOrder = (n: number) => ({
    id: `order-${n}`,
    slugId: `ORD-${String(n).padStart(4, '0')}`,
    totalAmount: 100000 + n,
    paymentMethod: 'banking',
    deliveryStatus: 'orderPlaced',
    paymentStatus: 'unpaid',
    paidAt: null,
    paymentQr: null,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-06-01T10:00:00Z',
    deliveryNotes: null,
    items: [
        {
            id: `item-${n}`,
            foodId: `food-${n}`,
            foodName: `Food ${n}`,
            unitPrice: 100000,
            discountPrice: 0,
            quantity: 1,
            totalPrice: 100000,
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
});

const makePage = (start: number, count: number) => Array.from({ length: count }, (_, i) => makeOrder(start + i));

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
    server.resetHandlers();
    mockInView = true;
});
afterAll(() => server.close());

describe('Orders — incremental loading', () => {
    it('shows only the first batch on open', async () => {
        mockInView = false;
        const total = PAGE_SIZE * 3;
        server.use(
            http.get(ORDERS_URL, ({ request }) => {
                const url = new URL(request.url);
                const skip = Number(url.searchParams.get('skip'));
                const take = Number(url.searchParams.get('take'));
                return HttpResponse.json({
                    totalCount: total,
                    items: makePage(skip, Math.min(take, total - skip)),
                });
            })
        );

        renderWithProviders(<Orders />);

        expect(await screen.findByText('ORD-0000')).toBeInTheDocument();
        // Last of first batch present, first of second batch not yet.
        expect(screen.getByText(`ORD-${String(PAGE_SIZE - 1).padStart(4, '0')}`)).toBeInTheDocument();
        expect(screen.queryByText(`ORD-${String(PAGE_SIZE).padStart(4, '0')}`)).not.toBeInTheDocument();
    });

    it('appends the next batch when scrolled to the bottom', async () => {
        const total = PAGE_SIZE * 2;
        server.use(
            http.get(ORDERS_URL, ({ request }) => {
                const url = new URL(request.url);
                const skip = Number(url.searchParams.get('skip'));
                const take = Number(url.searchParams.get('take'));
                return HttpResponse.json({
                    totalCount: total,
                    items: makePage(skip, Math.min(take, total - skip)),
                });
            })
        );

        renderWithProviders(<Orders />);

        await screen.findByText('ORD-0000');
        // Sentinel is inView (mocked) -> the second batch loads and appends.
        expect(await screen.findByText(`ORD-${String(PAGE_SIZE).padStart(4, '0')}`)).toBeInTheDocument();
    });

    it('shows an end-of-list indicator and stops loading once all orders are loaded', async () => {
        const total = 3;
        let requestCount = 0;
        server.use(
            http.get(ORDERS_URL, ({ request }) => {
                requestCount += 1;
                const url = new URL(request.url);
                const skip = Number(url.searchParams.get('skip'));
                const take = Number(url.searchParams.get('take'));
                return HttpResponse.json({
                    totalCount: total,
                    items: makePage(skip, Math.min(take, total - skip)),
                });
            })
        );

        renderWithProviders(<Orders />);

        expect(await screen.findByText(t('orders.endOfList'))).toBeInTheDocument();
        // One page covers everything: no spurious second request.
        expect(requestCount).toBe(1);
    });

    it('shows the empty state when there are no orders', async () => {
        server.use(http.get(ORDERS_URL, () => HttpResponse.json({ totalCount: 0, items: [] })));

        renderWithProviders(<Orders />);

        expect(await screen.findByText(t('orders.empty.title'))).toBeInTheDocument();
    });

    it('shows an error with retry when the next batch fails, and retry loads it', async () => {
        const total = PAGE_SIZE * 2;
        let firstBatchServed = false;
        let failNextBatch = true;
        server.use(
            http.get(ORDERS_URL, ({ request }) => {
                const url = new URL(request.url);
                const skip = Number(url.searchParams.get('skip'));
                const take = Number(url.searchParams.get('take'));
                if (skip === 0) {
                    firstBatchServed = true;
                    return HttpResponse.json({ totalCount: total, items: makePage(0, PAGE_SIZE) });
                }
                if (failNextBatch) {
                    return new HttpResponse(null, { status: 500 });
                }
                return HttpResponse.json({
                    totalCount: total,
                    items: makePage(skip, Math.min(take, total - skip)),
                });
            })
        );

        renderWithProviders(<Orders />);

        await screen.findByText('ORD-0000');
        expect(firstBatchServed).toBe(true);

        // Second batch fails -> inline error with retry, first batch still visible.
        expect(await screen.findByText(t('orders.loadMoreFailed'))).toBeInTheDocument();
        expect(screen.getByText('ORD-0000')).toBeInTheDocument();

        failNextBatch = false;
        await userEvent.click(screen.getByRole('button', { name: t('orders.retry') }));

        expect(await screen.findByText(`ORD-${String(PAGE_SIZE).padStart(4, '0')}`)).toBeInTheDocument();
        await waitFor(() => expect(screen.queryByText(t('orders.loadMoreFailed'))).not.toBeInTheDocument());
    });
});
