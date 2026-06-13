import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import PaymentCard from '../payment-card';

import type { AdminOrderResponseModel } from '@/apis';
import { Toaster } from '@/components/sonner';
import type { AdminOrderDetailViewModel } from '@/features/admin';
import { PaymentStatusEnum } from '@/features/payment';
import { createTestQueryClient, renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';
const PAYMENT_STATUS_URL = `${API_BASE}/admin/orders/:id/payment-status`;

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const ORDER_ID = 'order-1';
const SLUG_ID = 'A1B2C3';

const detailViewModel: AdminOrderDetailViewModel = {
    id: ORDER_ID,
    slugId: SLUG_ID,
    totalAmount: 485_000,
    paymentMethod: 'card',
    deliveryStatus: 'on-the-way',
    paymentStatus: PaymentStatusEnum.Unpaid,
    paidAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deliveryNotes: null,
    items: [],
    deliveryStatusTiming: {
        orderPlacedCompletedAt: null,
        preparingCompletedAt: null,
        onTheWayCompletedAt: null,
        deliveredCompletedAt: null,
    },
};

function buildApiResponse(paymentStatus: string): AdminOrderResponseModel {
    return {
        id: ORDER_ID,
        slugId: SLUG_ID,
        userId: 'user-1',
        userEmail: 'a@example.com',
        userName: 'Alice',
        totalAmount: 485_000,
        deliveryStatus: 'on-the-way',
        paymentStatus,
        createdAt: detailViewModel.createdAt,
        updatedAt: detailViewModel.updatedAt,
        totalItems: 0,
        deliveryNotes: null,
    };
}

function renderCard(overrides: Partial<AdminOrderDetailViewModel> = {}) {
    const order = { ...detailViewModel, ...overrides };
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(['admin', 'orders', 'detail', order.slugId], order);
    const utils = renderWithProviders(
        <>
            <PaymentCard
                orderId={order.id}
                slugId={order.slugId}
                paymentStatus={order.paymentStatus}
                paymentMethod={order.paymentMethod}
            />
            <Toaster />
        </>,
        { queryClient }
    );
    return { ...utils, queryClient, order };
}

/** The read-only "Current status" badge text (scoped to its row). */
function currentBadgeText(): string {
    const label = screen.getByText('Current status');
    const row = label.parentElement as HTMLElement;
    const badge = row.querySelector('[data-slot="badge"]') ?? row.lastElementChild;
    return badge?.textContent ?? '';
}

/** Opens the Select and clicks the option with the given visible label. */
async function pickStatus(user: ReturnType<typeof userEvent.setup>, optionLabel: string) {
    const trigger = screen.getByRole('combobox', { name: /update payment status/i });
    await user.click(trigger);
    const option = await screen.findByRole('option', { name: optionLabel });
    await user.click(option);
}

describe('PaymentCard', () => {
    it('renders the current payment-status badge and the method in the default state', () => {
        renderCard({ paymentStatus: PaymentStatusEnum.Paid, paymentMethod: 'card' });

        expect(currentBadgeText()).toBe('Paid');
        expect(screen.getByText('card')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /update payment status/i })).toBeEnabled();
    });

    it('does NOT open the dialog when the admin re-selects the status the order already has', async () => {
        const user = userEvent.setup();
        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Unpaid');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('opens the confirmation dialog when a different status is selected', async () => {
        const user = userEvent.setup();
        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Paid');

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Change payment status?')).toBeInTheDocument();
    });

    it('leaves the payment status unchanged when the dialog is cancelled', async () => {
        const user = userEvent.setup();
        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Paid');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        // Badge still shows the original status.
        expect(currentBadgeText()).toBe('Pending Payment');
        expect(screen.queryByText('Paid')).not.toBeInTheDocument();
    });

    it('confirms the change: fires the PATCH mutation and the badge reflects the new status', async () => {
        const user = userEvent.setup();
        let requestBody: { paymentStatus?: string } | null = null;
        server.use(
            http.patch(PAYMENT_STATUS_URL, async ({ request }) => {
                requestBody = (await request.json()) as { paymentStatus: string };
                return HttpResponse.json(buildApiResponse('paid'));
            })
        );

        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Paid');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Confirm change' }));

        await waitFor(() => expect(requestBody).toEqual({ paymentStatus: 'paid' }));
        await waitFor(() => expect(currentBadgeText()).toBe('Paid'));
    });

    it('shows the saving spinner while the change persists', async () => {
        const user = userEvent.setup();
        server.use(
            http.patch(PAYMENT_STATUS_URL, async () => {
                await delay(100);
                return HttpResponse.json(buildApiResponse('paid'));
            })
        );

        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Paid');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Confirm change' }));

        expect(await screen.findByText('Saving…')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /update payment status/i })).toBeDisabled();
    });

    it('reverts the badge and shows a destructive toast when the change fails', async () => {
        const user = userEvent.setup();
        server.use(http.patch(PAYMENT_STATUS_URL, () => new HttpResponse(null, { status: 500 })));

        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Paid');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Confirm change' }));

        // Failure toast copy.
        await waitFor(() =>
            expect(screen.getByText("Couldn't update the payment status. Please try again.")).toBeInTheDocument()
        );
        // Badge reverted to the original status.
        await waitFor(() => expect(currentBadgeText()).toBe('Pending Payment'));
    });

    it('allows the change for a cash-on-delivery order regardless of payment method', async () => {
        const user = userEvent.setup();
        let requestBody: { paymentStatus?: string } | null = null;
        server.use(
            http.patch(PAYMENT_STATUS_URL, async ({ request }) => {
                requestBody = (await request.json()) as { paymentStatus: string };
                return HttpResponse.json(buildApiResponse('failed'));
            })
        );

        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid, paymentMethod: 'cash on delivery' });

        await pickStatus(user, 'Failed');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Confirm change' }));

        await waitFor(() => expect(requestBody).toEqual({ paymentStatus: 'failed' }));
        await waitFor(() => expect(currentBadgeText()).toBe('Failed'));
    });
});
