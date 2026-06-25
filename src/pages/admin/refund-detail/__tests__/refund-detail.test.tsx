import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import AdminRefundDetail from '../refund-detail';

import type { AdminRefundDetailResponseModel } from '@/apis';
import { RefundStatusEnum, type SharedNotification } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';
const REFUND_ID = 'rf-123';
const DETAIL_URL = `${API_BASE}/admin/refunds/${REFUND_ID}`;
const APPROVE_URL = `${API_BASE}/admin/refunds/${REFUND_ID}/approve`;
const RETRY_URL = `${API_BASE}/admin/refunds/${REFUND_ID}/retry`;

// Mock useParams to provide the id route param the page reads.
vi.mock('react-router-dom', async importOriginal => {
    const actual = await importOriginal<typeof import('react-router-dom')>();
    return {
        ...actual,
        useParams: () => ({ id: REFUND_ID }),
    };
});

// Capture the page's onNotification handler so tests can push hub events
// without opening a real WebSocket connection.
let capturedOnNotification: ((payload: SharedNotification) => void) | undefined;

vi.mock('@/features/order', async importOriginal => {
    const actual = await importOriginal<typeof import('@/features/order')>();
    return {
        ...actual,
        useNotifications: (options: { onNotification: (payload: SharedNotification) => void }) => {
            capturedOnNotification = options.onNotification;
        },
    };
});

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
    server.resetHandlers();
    capturedOnNotification = undefined;
});
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
        bankCode: null,
        accountNumber: null,
        accountHolderName: null,
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

    it('renders the retry action for a failed refund', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(makeRefund({ status: RefundStatusEnum.Failed, failureReason: 'Bank rejected.' }))
            )
        );

        renderPage();

        expect(await screen.findByRole('button', { name: 'Retry refund' })).toBeInTheDocument();
    });

    it('does not render the retry action for a paid refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ status: RefundStatusEnum.Paid }))));

        renderPage();

        await screen.findByText(REFUND_ID);
        expect(screen.queryByRole('button', { name: 'Retry refund' })).not.toBeInTheDocument();
    });

    it('does not render the retry action for a pending refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ status: RefundStatusEnum.Pending }))));

        renderPage();

        await screen.findByRole('button', { name: 'Approve refund' });
        expect(screen.queryByRole('button', { name: 'Retry refund' })).not.toBeInTheDocument();
    });

    it('does not render the retry action for a processing refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ status: RefundStatusEnum.Processing }))));

        renderPage();

        await screen.findByText('Transfer in progress');
        expect(screen.queryByRole('button', { name: 'Retry refund' })).not.toBeInTheDocument();
    });

    it('retries through the confirm dialog and moves the refund to processing', async () => {
        const user = userEvent.setup();
        const retrySpy = vi.fn();
        let retried = false;
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    makeRefund(
                        retried
                            ? { status: RefundStatusEnum.Processing }
                            : { status: RefundStatusEnum.Failed, failureReason: 'Bank rejected.' }
                    )
                )
            )
        );
        server.use(
            http.post(RETRY_URL, () => {
                retrySpy();
                retried = true;
                return HttpResponse.json(makeRefund({ status: RefundStatusEnum.Processing }), { status: 202 });
            })
        );

        renderPage();

        await user.click(await screen.findByRole('button', { name: 'Retry refund' }));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Retry' }));

        await waitFor(() => expect(retrySpy).toHaveBeenCalledTimes(1));
        expect(await screen.findByText('Transfer in progress')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Retry refund' })).not.toBeInTheDocument();
    });

    it('shows the VietQR payment card while a refund is processing', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    makeRefund({
                        status: RefundStatusEnum.Processing,
                        bankCode: 'VCB',
                        accountNumber: '1023456789',
                        accountHolderName: 'Nguyen Van A',
                    })
                )
            )
        );

        renderPage();

        expect(await screen.findByText('Scan to pay refund')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('shows the missing payout details state while processing without saved bank details', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    makeRefund({
                        status: RefundStatusEnum.Processing,
                        bankCode: null,
                        accountNumber: null,
                        accountHolderName: null,
                    })
                )
            )
        );

        renderPage();

        expect(await screen.findByText('Scan to pay refund')).toBeInTheDocument();
        expect(screen.getByText('No payout account on file')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('does not show the VietQR card for a pending refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ status: RefundStatusEnum.Pending }))));

        renderPage();

        await screen.findByRole('button', { name: 'Approve refund' });
        expect(screen.queryByText('Scan to pay refund')).not.toBeInTheDocument();
    });

    it('does not show the VietQR card for a paid refund', async () => {
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

        await screen.findByText('Transfer Record');
        expect(screen.queryByText('Scan to pay refund')).not.toBeInTheDocument();
    });

    it('does not show the VietQR card for a failed refund', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(makeRefund({ status: RefundStatusEnum.Failed, failureReason: 'Bank rejected.' }))
            )
        );

        renderPage();

        await screen.findByText('Transfer Failed');
        expect(screen.queryByText('Scan to pay refund')).not.toBeInTheDocument();
    });

    it('does not retry when the confirm dialog is cancelled', async () => {
        const user = userEvent.setup();
        const retrySpy = vi.fn();
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(makeRefund({ status: RefundStatusEnum.Failed, failureReason: 'Bank rejected.' }))
            )
        );
        server.use(
            http.post(RETRY_URL, () => {
                retrySpy();
                return HttpResponse.json(makeRefund({ status: RefundStatusEnum.Processing }), { status: 202 });
            })
        );

        renderPage();

        await user.click(await screen.findByRole('button', { name: 'Retry refund' }));
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(retrySpy).not.toHaveBeenCalled();
        expect(screen.getByRole('button', { name: 'Retry refund' })).toBeInTheDocument();
    });
});

describe('AdminRefundDetail — live refund-status-changed updates', () => {
    const pushNotification = async (payload: SharedNotification) => {
        const { act } = await import('@testing-library/react');
        act(() => {
            capturedOnNotification?.(payload);
        });
    };

    it('flips the open refund from processing to paid without a manual refresh', async () => {
        let paid = false;
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    paid
                        ? makeRefund({
                              status: RefundStatusEnum.Paid,
                              paidAt: '2026-06-13T14:27:00Z',
                              transferReference: 'VCB-TRF-20260613-0099431',
                          })
                        : makeRefund({ status: RefundStatusEnum.Processing })
                )
            )
        );

        renderPage();

        expect(await screen.findByText('Transfer in progress')).toBeInTheDocument();

        paid = true;
        await pushNotification({
            type: 'refund-status-changed',
            refundId: REFUND_ID,
            status: 'paid',
            timestamp: '2026-06-13T14:27:00Z',
        });

        expect(await screen.findByText('Transfer Record')).toBeInTheDocument();
        expect(screen.getByText('VCB-TRF-20260613-0099431')).toBeInTheDocument();
    });

    it('flips the open refund from processing to failed without a manual refresh', async () => {
        const reason = 'Beneficiary account number rejected by the receiving bank.';
        let failed = false;
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    failed
                        ? makeRefund({ status: RefundStatusEnum.Failed, failureReason: reason })
                        : makeRefund({ status: RefundStatusEnum.Processing })
                )
            )
        );

        renderPage();

        expect(await screen.findByText('Transfer in progress')).toBeInTheDocument();

        failed = true;
        await pushNotification({
            type: 'refund-status-changed',
            refundId: REFUND_ID,
            status: 'failed',
            timestamp: '2026-06-13T14:30:00Z',
        });

        expect(await screen.findByText('Transfer Failed')).toBeInTheDocument();
        expect(screen.getByText(reason)).toBeInTheDocument();
    });

    it('ignores a refund-status-changed notification for a different refund id', async () => {
        let refetched = false;
        server.use(
            http.get(DETAIL_URL, () => {
                if (refetched) {
                    return HttpResponse.json(
                        makeRefund({
                            status: RefundStatusEnum.Paid,
                            paidAt: '2026-06-13T14:27:00Z',
                            transferReference: 'VCB-TRF-20260613-0099431',
                        })
                    );
                }
                return HttpResponse.json(makeRefund({ status: RefundStatusEnum.Processing }));
            })
        );

        renderPage();

        expect(await screen.findByText('Transfer in progress')).toBeInTheDocument();

        refetched = true;
        await pushNotification({
            type: 'refund-status-changed',
            refundId: 'rf-999-other',
            status: 'paid',
            timestamp: '2026-06-13T14:27:00Z',
        });

        // No refetch should be triggered, so the detail stays processing.
        await waitFor(() => expect(screen.getByText('Transfer in progress')).toBeInTheDocument());
        expect(screen.queryByText('Transfer Record')).not.toBeInTheDocument();
    });

    it('ignores a non-matching notification type', async () => {
        let refetched = false;
        server.use(
            http.get(DETAIL_URL, () => {
                if (refetched) {
                    return HttpResponse.json(
                        makeRefund({
                            status: RefundStatusEnum.Paid,
                            paidAt: '2026-06-13T14:27:00Z',
                            transferReference: 'VCB-TRF-20260613-0099431',
                        })
                    );
                }
                return HttpResponse.json(makeRefund({ status: RefundStatusEnum.Processing }));
            })
        );

        renderPage();

        expect(await screen.findByText('Transfer in progress')).toBeInTheDocument();

        refetched = true;
        await pushNotification({
            type: 'payment-success',
            orderId: 'ord-1',
            slugId: 'ORD-ABC123',
            message: 'Payment confirmed',
            timestamp: '2026-06-13T14:27:00Z',
        });

        await waitFor(() => expect(screen.getByText('Transfer in progress')).toBeInTheDocument());
        expect(screen.queryByText('Transfer Record')).not.toBeInTheDocument();
    });
});
