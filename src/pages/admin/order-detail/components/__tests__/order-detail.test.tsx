import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import AdminOrderDetail from '../../order-detail';

import type { AdminOrderResponseModel } from '@/apis';
import { createTestQueryClient, renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';

const ORDER_ID = 'order-1';
const SLUG_ID = 'A1B2C3';

const ORDER_DETAIL_URL = `${API_BASE}/admin/orders/${SLUG_ID}`;
const PAYMENT_STATUS_URL = `${API_BASE}/admin/orders/:id/payment-status`;

// Mock useParams to provide the slug route param the page reads.
vi.mock('react-router-dom', async importOriginal => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useParams: () => ({ id: SLUG_ID }),
    };
});

function buildDetailResponse(paymentStatus: string, paymentMethod = 'card') {
    return {
        id: ORDER_ID,
        slugId: SLUG_ID,
        totalAmount: 485_000,
        paymentMethod,
        deliveryStatus: 'on-the-way',
        paymentStatus,
        paidAt: null,
        createdAt: new Date('2026-06-01T10:00:00Z').toISOString(),
        updatedAt: new Date('2026-06-01T10:00:00Z').toISOString(),
        deliveryNotes: null,
        items: [],
        deliveryStatusTiming: {
            orderPlacedCompletedAt: null,
            preparingCompletedAt: null,
            onTheWayCompletedAt: null,
            deliveredCompletedAt: null,
        },
    };
}

function buildPatchResponse(paymentStatus: string): AdminOrderResponseModel {
    return {
        id: ORDER_ID,
        slugId: SLUG_ID,
        userId: 'user-1',
        userEmail: 'a@example.com',
        userName: 'Alice',
        totalAmount: 485_000,
        deliveryStatus: 'on-the-way',
        paymentStatus,
        createdAt: new Date('2026-06-01T10:00:00Z').toISOString(),
        updatedAt: new Date('2026-06-01T10:00:00Z').toISOString(),
        totalItems: 0,
        deliveryNotes: null,
    };
}

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderPage() {
    const queryClient = createTestQueryClient();
    return renderWithProviders(<AdminOrderDetail />, { queryClient });
}

/** The read-only "Current status" badge text (scoped to its row). */
function currentBadgeText(): string {
    const label = screen.getByText('Current status');
    const row = label.parentElement as HTMLElement;
    const badge = row.querySelector('[data-slot="badge"]') ?? row.lastElementChild;
    return badge?.textContent ?? '';
}

async function pickStatus(user: ReturnType<typeof userEvent.setup>, optionLabel: string) {
    const trigger = screen.getByRole('combobox', { name: /update payment status/i });
    await user.click(trigger);
    const option = await screen.findByRole('option', { name: optionLabel });
    await user.click(option);
}

describe('AdminOrderDetail — payment status control', () => {
    it('sends the PATCH body { paymentStatus } and reconciles the badge on success', async () => {
        const user = userEvent.setup();
        let requestBody: { paymentStatus?: string } | null = null;
        server.use(
            http.get(ORDER_DETAIL_URL, () => HttpResponse.json(buildDetailResponse('unpaid'))),
            http.patch(PAYMENT_STATUS_URL, async ({ request }) => {
                requestBody = (await request.json()) as { paymentStatus: string };
                return HttpResponse.json(buildPatchResponse('paid'));
            })
        );

        renderPage();

        await screen.findByRole('combobox', { name: /update payment status/i });

        await pickStatus(user, 'Paid');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Confirm change' }));

        await waitFor(() => expect(requestBody).toEqual({ paymentStatus: 'paid' }));
        await waitFor(() => expect(currentBadgeText()).toBe('Paid'));
    });

    it('allows the change for a cash-on-delivery order', async () => {
        const user = userEvent.setup();
        let requestBody: { paymentStatus?: string } | null = null;
        server.use(
            http.get(ORDER_DETAIL_URL, () => HttpResponse.json(buildDetailResponse('unpaid', 'cash on delivery'))),
            http.patch(PAYMENT_STATUS_URL, async ({ request }) => {
                requestBody = (await request.json()) as { paymentStatus: string };
                return HttpResponse.json(buildPatchResponse('failed'));
            })
        );

        renderPage();

        await screen.findByRole('combobox', { name: /update payment status/i });

        await pickStatus(user, 'Failed');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Confirm change' }));

        await waitFor(() => expect(requestBody).toEqual({ paymentStatus: 'failed' }));
        await waitFor(() => expect(currentBadgeText()).toBe('Failed'));
    });
});
