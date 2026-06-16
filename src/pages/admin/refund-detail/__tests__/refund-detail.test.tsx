import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import AdminRefundDetail from '../refund-detail';

import type { AdminRefundDetailResponseModel } from '@/apis';
import { RefundStatusEnum } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';
const REFUND_ID = 'rf-123';
const DETAIL_URL = `${API_BASE}/admin/refunds/${REFUND_ID}`;
const APPROVE_URL = `${API_BASE}/admin/refunds/${REFUND_ID}/approve`;

// Mock useParams to provide the id route param the page reads.
vi.mock('react-router-dom', async importOriginal => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useParams: () => ({ id: REFUND_ID }),
    };
});

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function makeRefund(overrides: Partial<AdminRefundDetailResponseModel> = {}): AdminRefundDetailResponseModel {
    return {
        id: REFUND_ID,
        orderId: 'ord-1',
        orderSlugId: 'A1B2C3',
        amount: 485_000,
        status: RefundStatusEnum.Pending,
        createdAt: '2026-06-13T10:40:00Z',
        paidAt: null,
        transferReference: null,
        failureReason: null,
        ...overrides,
    };
}

function renderPage() {
    return renderWithProviders(<AdminRefundDetail />);
}

describe('AdminRefundDetail page', () => {
    it('shows a loading spinner before the refund resolves', () => {
        server.use(http.get(DETAIL_URL, () => new Promise(() => undefined)));

        renderPage();

        expect(screen.getByRole('status', { name: 'Loading...' })).toBeInTheDocument();
    });

    it('renders an error state when the refund fails to load', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json({}, { status: 500 })));

        renderPage();

        expect(await screen.findByText('Failed to load refund details')).toBeInTheDocument();
    });

    it('renders the summary and the approve action for a pending refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund())));

        renderPage();

        expect(await screen.findByText(REFUND_ID)).toBeInTheDocument();
        expect(screen.getByText('#A1B2C3')).toBeInTheDocument();
        expect(screen.getByText('485,000 ₫')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Approve refund' })).toBeInTheDocument();
    });

    it('renders a placeholder for the order reference when the order slug is absent', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ orderSlugId: '' }))));

        renderPage();

        expect(await screen.findByText(REFUND_ID)).toBeInTheDocument();
        expect(screen.queryByText(/#A1B2C3/)).not.toBeInTheDocument();
        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('approves through the confirm dialog and moves the refund to processing', async () => {
        const user = userEvent.setup();
        const approveSpy = vi.fn();
        let approved = false;
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    makeRefund({ status: approved ? RefundStatusEnum.Processing : RefundStatusEnum.Pending })
                )
            )
        );
        server.use(
            http.post(APPROVE_URL, () => {
                approveSpy();
                approved = true;
                return HttpResponse.json(makeRefund({ status: RefundStatusEnum.Processing }), { status: 202 });
            })
        );

        renderPage();

        await user.click(await screen.findByRole('button', { name: 'Approve refund' }));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Approve' }));

        await waitFor(() => expect(approveSpy).toHaveBeenCalledTimes(1));
        expect(await screen.findByText('Transfer in progress')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Approve refund' })).not.toBeInTheDocument();
    });

    it('does not approve when the confirm dialog is cancelled', async () => {
        const user = userEvent.setup();
        const approveSpy = vi.fn();
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund())));
        server.use(
            http.post(APPROVE_URL, () => {
                approveSpy();
                return HttpResponse.json(makeRefund({ status: RefundStatusEnum.Processing }), { status: 202 });
            })
        );

        renderPage();

        await user.click(await screen.findByRole('button', { name: 'Approve refund' }));
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(approveSpy).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Approve refund' })).toBeInTheDocument();
    });

    it('renders the read-only transfer record for a paid refund', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    makeRefund({
                        status: RefundStatusEnum.Paid,
                        paidAt: '2026-06-13T14:27:00Z',
                        transferReference: 'VCB-TRF-20260613-0099431',
                    })
                )
            )
        );

        renderPage();

        expect(await screen.findByText('Transfer Record')).toBeInTheDocument();
        expect(screen.getByText('VCB-TRF-20260613-0099431')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Approve refund' })).not.toBeInTheDocument();
    });

    it('renders the failure reason for a failed refund', async () => {
        const reason = 'Beneficiary account number rejected by the receiving bank.';
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(makeRefund({ status: RefundStatusEnum.Failed, failureReason: reason }))
            )
        );

        renderPage();

        expect(await screen.findByText('Transfer Failed')).toBeInTheDocument();
        expect(screen.getByText(reason)).toBeInTheDocument();
    });
});
