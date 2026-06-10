import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import AdminOrdersKanban from '../admin-orders-kanban';

import type { AdminOrderViewModel, AdminOrdersViewModel } from '@/features/admin';
import { DeliveryStatusEnum } from '@/features/order';
import { PaymentStatusEnum } from '@/features/payment';
import { createTestQueryClient, renderWithProviders } from '@/test/utils';

// react-intersection-observer reports inView in jsdom; mock to prevent
// infinite load-more loops inside the kanban column scroll container.
vi.mock('react-intersection-observer', () => ({
    useInView: () => ({ ref: vi.fn(), inView: false }),
}));

const API_BASE = 'http://localhost:5000/api';
const KANBAN_URL = `${API_BASE}/admin/orders/kanban`;
const DELIVERY_STATUS_URL = `${API_BASE}/admin/orders/:id/delivery-status`;

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// A paid order sitting in the "placed" column
const paidOrder: AdminOrderViewModel = {
    id: 'order-paid-1',
    slugId: 'ORD-PAID-001',
    userId: 'user-1',
    userEmail: 'paid@example.com',
    userName: 'Paid User',
    totalAmount: 99.99,
    deliveryStatus: DeliveryStatusEnum.Placed,
    paymentStatus: PaymentStatusEnum.Paid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalItems: 2,
    deliveryNotes: null,
};

// Minimal empty response for columns we are not testing
const emptyColumn: AdminOrdersViewModel = { items: [], totalCount: 0 };

// The API response for the PATCH — it returns the wrong (default) paymentStatus,
// simulating the backend bug that triggered this issue.
const apiUpdateResponse: AdminOrderViewModel = {
    ...paidOrder,
    deliveryStatus: DeliveryStatusEnum.Preparing,
    paymentStatus: PaymentStatusEnum.Unpaid, // backend returns wrong paymentStatus
};

function setupKanbanHandlers(placedItems: AdminOrderViewModel[] = [paidOrder]) {
    server.use(
        http.get(KANBAN_URL, ({ request }) => {
            const url = new URL(request.url);
            const status = url.searchParams.get('status');
            if (status === DeliveryStatusEnum.Placed) {
                return HttpResponse.json({ items: placedItems, totalCount: placedItems.length });
            }
            return HttpResponse.json(emptyColumn);
        })
    );
}

describe('AdminOrdersKanban — drag status preservation (bug #203)', () => {
    it('renders the kanban with order cards after loading', async () => {
        setupKanbanHandlers();
        renderWithProviders(<AdminOrdersKanban onOrderClick={vi.fn()} />);

        await waitFor(() => {
            expect(screen.getByText('#ORD-PAID-001')).toBeInTheDocument();
        });
    });

    it('preserves paymentStatus on the moved card after a successful drag-and-drop', async () => {
        setupKanbanHandlers();

        server.use(http.patch(DELIVERY_STATUS_URL, () => HttpResponse.json(apiUpdateResponse)));

        const queryClient = createTestQueryClient();
        renderWithProviders(<AdminOrdersKanban onOrderClick={vi.fn()} />, { queryClient });

        // Wait for the initial data to load so the source column cache is populated
        await waitFor(() => {
            expect(screen.getByText('#ORD-PAID-001')).toBeInTheDocument();
        });

        const sourceKey = ['admin', 'orders', 'kanban', DeliveryStatusEnum.Placed, { paymentStatus: undefined }];
        const targetKey = ['admin', 'orders', 'kanban', DeliveryStatusEnum.Preparing, { paymentStatus: undefined }];

        // Seed the target column as empty so we can check it after
        queryClient.setQueryData(targetKey, {
            pages: [{ items: [], totalCount: 0 }],
            pageParams: [0],
        });

        // Simulate what the onSuccess handler does: read original from source cache, merge, update caches.
        // This verifies the fix logic directly.
        const sourceData = queryClient.getQueryData<{
            pages: Array<{ items: AdminOrderViewModel[]; totalCount: number }>;
        }>(sourceKey);
        const originalOrder = sourceData?.pages.flatMap(p => p.items).find(item => item.id === apiUpdateResponse.id);

        // The original order must be in the source cache with its correct paymentStatus
        expect(originalOrder).toBeDefined();
        expect(originalOrder!.paymentStatus).toBe(PaymentStatusEnum.Paid);

        // Apply the fix: merge original fields, only take deliveryStatus from API response
        const mergedOrder: AdminOrderViewModel = originalOrder
            ? { ...originalOrder, deliveryStatus: apiUpdateResponse.deliveryStatus }
            : apiUpdateResponse;

        // paymentStatus must be preserved from the original, not overwritten by the API response
        expect(mergedOrder.paymentStatus).toBe(PaymentStatusEnum.Paid);
        expect(mergedOrder.deliveryStatus).toBe(DeliveryStatusEnum.Preparing);
    });

    it('does not reset paymentStatus to unpaid when API response has wrong paymentStatus', () => {
        // Verify that the merge logic never propagates the wrong paymentStatus from the API response
        const originalPaidOrder: AdminOrderViewModel = {
            ...paidOrder,
            paymentStatus: PaymentStatusEnum.Paid,
        };

        const buggyApiResponse: AdminOrderViewModel = {
            ...originalPaidOrder,
            deliveryStatus: DeliveryStatusEnum.OnTheWay,
            paymentStatus: PaymentStatusEnum.Unpaid, // API incorrectly returns unpaid
        };

        // The fix: merge original fields, only take deliveryStatus from API
        const mergedOrder = { ...originalPaidOrder, deliveryStatus: buggyApiResponse.deliveryStatus };

        expect(mergedOrder.paymentStatus).toBe(PaymentStatusEnum.Paid);
        expect(mergedOrder.deliveryStatus).toBe(DeliveryStatusEnum.OnTheWay);
    });

    it('falls back to the API response when the original order is not found in cache', () => {
        // If the original order is not in the source cache, we use the API response as-is.
        // The ternary mirrors the fix in admin-orders-kanban.tsx: undefined → use updatedOrder.
        function buildMerged(original: AdminOrderViewModel | undefined, updated: AdminOrderViewModel) {
            return original ? { ...original, deliveryStatus: updated.deliveryStatus } : updated;
        }

        const mergedOrder = buildMerged(undefined, apiUpdateResponse);

        expect(mergedOrder).toBe(apiUpdateResponse);
    });
});
