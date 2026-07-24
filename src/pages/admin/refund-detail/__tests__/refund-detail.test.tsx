import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import AdminRefundDetail from '../refund-detail';

import type { AdminRefundDetailResponseModel } from '@/apis';
import { ADMIN_ENDPOINTS } from '@/apis/admin/admin.constant';
import { RefundStatusType } from '@/features/order';
import { buildUrl } from '@/mocks/utils';
import type { SharedNotification } from '@/notification';
import { server } from '@/test/server';
import { findByI18nText, getByI18nText, queryByI18nText, renderWithProviders } from '@/test/utils';

const REFUND_ID = 'rf-123';
const DETAIL_URL = buildUrl(ADMIN_ENDPOINTS.REFUND_DETAIL(REFUND_ID));
const APPROVE_URL = buildUrl(ADMIN_ENDPOINTS.REFUND_APPROVE(REFUND_ID));
const RETRY_URL = buildUrl(ADMIN_ENDPOINTS.REFUND_RETRY(REFUND_ID));

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

vi.mock('@/notification/use-notifications.hook', async importOriginal => {
    const actual = await importOriginal<typeof import('@/notification/use-notifications.hook')>();
    return {
        ...actual,
        useNotifications: (options: { onNotification: (payload: SharedNotification) => void }) => {
            capturedOnNotification = options.onNotification;
        },
    };
});

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
        status: RefundStatusType.Pending,
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

        expect(await findByI18nText('admin.refundDetail.failedToLoad')).toBeInTheDocument();
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
                    makeRefund({ status: approved ? RefundStatusType.Processing : RefundStatusType.Pending })
                )
            )
        );
        server.use(
            http.post(APPROVE_URL, () => {
                approveSpy();
                approved = true;
                return HttpResponse.json(makeRefund({ status: RefundStatusType.Processing }), { status: 202 });
            })
        );

        renderPage();

        await user.click(await screen.findByRole('button', { name: 'Approve refund' }));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Approve' }));

        await waitFor(() => expect(approveSpy).toHaveBeenCalledTimes(1));
        expect(await findByI18nText('admin.refundDetail.processingTitle')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Approve refund' })).not.toBeInTheDocument();
    });

    it('does not approve when the confirm dialog is cancelled', async () => {
        const user = userEvent.setup();
        const approveSpy = vi.fn();
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund())));
        server.use(
            http.post(APPROVE_URL, () => {
                approveSpy();
                return HttpResponse.json(makeRefund({ status: RefundStatusType.Processing }), { status: 202 });
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
                        status: RefundStatusType.Paid,
                        paidAt: '2026-06-13T14:27:00Z',
                        transferReference: 'VCB-TRF-20260613-0099431',
                    })
                )
            )
        );

        renderPage();

        expect(await findByI18nText('admin.refundDetail.transferRecordTitle')).toBeInTheDocument();
        expect(screen.getByText('VCB-TRF-20260613-0099431')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Approve refund' })).not.toBeInTheDocument();
    });

    it('renders the failure reason for a failed refund', async () => {
        const reason = 'Beneficiary account number rejected by the receiving bank.';
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(makeRefund({ status: RefundStatusType.Failed, failureReason: reason }))
            )
        );

        renderPage();

        expect(await findByI18nText('admin.refundDetail.failureTitle')).toBeInTheDocument();
        expect(screen.getByText(reason)).toBeInTheDocument();
    });

    it('renders the retry action for a failed refund', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(makeRefund({ status: RefundStatusType.Failed, failureReason: 'Bank rejected.' }))
            )
        );

        renderPage();

        expect(await screen.findByRole('button', { name: 'Retry refund' })).toBeInTheDocument();
    });

    it('does not render the retry action for a paid refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ status: RefundStatusType.Paid }))));

        renderPage();

        await screen.findByText(REFUND_ID);
        expect(screen.queryByRole('button', { name: 'Retry refund' })).not.toBeInTheDocument();
    });

    it('does not render the retry action for a pending refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ status: RefundStatusType.Pending }))));

        renderPage();

        await screen.findByRole('button', { name: 'Approve refund' });
        expect(screen.queryByRole('button', { name: 'Retry refund' })).not.toBeInTheDocument();
    });

    it('does not render the retry action for a processing refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ status: RefundStatusType.Processing }))));

        renderPage();

        await findByI18nText('admin.refundDetail.processingTitle');
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
                            ? { status: RefundStatusType.Processing }
                            : { status: RefundStatusType.Failed, failureReason: 'Bank rejected.' }
                    )
                )
            )
        );
        server.use(
            http.post(RETRY_URL, () => {
                retrySpy();
                retried = true;
                return HttpResponse.json(makeRefund({ status: RefundStatusType.Processing }), { status: 202 });
            })
        );

        renderPage();

        await user.click(await screen.findByRole('button', { name: 'Retry refund' }));

        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Retry' }));

        await waitFor(() => expect(retrySpy).toHaveBeenCalledTimes(1));
        expect(await findByI18nText('admin.refundDetail.processingTitle')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Retry refund' })).not.toBeInTheDocument();
    });

    it('shows the VietQR payment card while a refund is processing', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    makeRefund({
                        status: RefundStatusType.Processing,
                        bankCode: 'VCB',
                        accountNumber: '1023456789',
                        accountHolderName: 'Nguyen Van A',
                    })
                )
            )
        );

        renderPage();

        expect(await findByI18nText('admin.refundDetail.qrTitle')).toBeInTheDocument();
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('shows the missing payout details state while processing without saved bank details', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    makeRefund({
                        status: RefundStatusType.Processing,
                        bankCode: null,
                        accountNumber: null,
                        accountHolderName: null,
                    })
                )
            )
        );

        renderPage();

        expect(await findByI18nText('admin.refundDetail.qrTitle')).toBeInTheDocument();
        expect(getByI18nText('admin.refundDetail.qrMissingTitle')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('does not show the VietQR card for a pending refund', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(makeRefund({ status: RefundStatusType.Pending }))));

        renderPage();

        await screen.findByRole('button', { name: 'Approve refund' });
        expect(queryByI18nText('admin.refundDetail.qrTitle')).not.toBeInTheDocument();
    });

    it('does not show the VietQR card for a paid refund', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    makeRefund({
                        status: RefundStatusType.Paid,
                        paidAt: '2026-06-13T14:27:00Z',
                        transferReference: 'VCB-TRF-20260613-0099431',
                    })
                )
            )
        );

        renderPage();

        await findByI18nText('admin.refundDetail.transferRecordTitle');
        expect(queryByI18nText('admin.refundDetail.qrTitle')).not.toBeInTheDocument();
    });

    it('does not show the VietQR card for a failed refund', async () => {
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(makeRefund({ status: RefundStatusType.Failed, failureReason: 'Bank rejected.' }))
            )
        );

        renderPage();

        await findByI18nText('admin.refundDetail.failureTitle');
        expect(queryByI18nText('admin.refundDetail.qrTitle')).not.toBeInTheDocument();
    });

    it('does not retry when the confirm dialog is cancelled', async () => {
        const user = userEvent.setup();
        const retrySpy = vi.fn();
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(makeRefund({ status: RefundStatusType.Failed, failureReason: 'Bank rejected.' }))
            )
        );
        server.use(
            http.post(RETRY_URL, () => {
                retrySpy();
                return HttpResponse.json(makeRefund({ status: RefundStatusType.Processing }), { status: 202 });
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
                              status: RefundStatusType.Paid,
                              paidAt: '2026-06-13T14:27:00Z',
                              transferReference: 'VCB-TRF-20260613-0099431',
                          })
                        : makeRefund({ status: RefundStatusType.Processing })
                )
            )
        );

        renderPage();

        expect(await findByI18nText('admin.refundDetail.processingTitle')).toBeInTheDocument();

        paid = true;
        await pushNotification({
            type: 'refund-status-changed',
            refundId: REFUND_ID,
            status: 'paid',
            timestamp: '2026-06-13T14:27:00Z',
        });

        expect(await findByI18nText('admin.refundDetail.transferRecordTitle')).toBeInTheDocument();
        expect(screen.getByText('VCB-TRF-20260613-0099431')).toBeInTheDocument();
    });

    it('flips the open refund from processing to failed without a manual refresh', async () => {
        const reason = 'Beneficiary account number rejected by the receiving bank.';
        let failed = false;
        server.use(
            http.get(DETAIL_URL, () =>
                HttpResponse.json(
                    failed
                        ? makeRefund({ status: RefundStatusType.Failed, failureReason: reason })
                        : makeRefund({ status: RefundStatusType.Processing })
                )
            )
        );

        renderPage();

        expect(await findByI18nText('admin.refundDetail.processingTitle')).toBeInTheDocument();

        failed = true;
        await pushNotification({
            type: 'refund-status-changed',
            refundId: REFUND_ID,
            status: 'failed',
            timestamp: '2026-06-13T14:30:00Z',
        });

        expect(await findByI18nText('admin.refundDetail.failureTitle')).toBeInTheDocument();
        expect(screen.getByText(reason)).toBeInTheDocument();
    });

    it('ignores a refund-status-changed notification for a different refund id', async () => {
        let refetched = false;
        server.use(
            http.get(DETAIL_URL, () => {
                if (refetched) {
                    return HttpResponse.json(
                        makeRefund({
                            status: RefundStatusType.Paid,
                            paidAt: '2026-06-13T14:27:00Z',
                            transferReference: 'VCB-TRF-20260613-0099431',
                        })
                    );
                }
                return HttpResponse.json(makeRefund({ status: RefundStatusType.Processing }));
            })
        );

        renderPage();

        expect(await findByI18nText('admin.refundDetail.processingTitle')).toBeInTheDocument();

        refetched = true;
        await pushNotification({
            type: 'refund-status-changed',
            refundId: 'rf-999-other',
            status: 'paid',
            timestamp: '2026-06-13T14:27:00Z',
        });

        // No refetch should be triggered, so the detail stays processing.
        await waitFor(() => expect(getByI18nText('admin.refundDetail.processingTitle')).toBeInTheDocument());
        expect(queryByI18nText('admin.refundDetail.transferRecordTitle')).not.toBeInTheDocument();
    });

    it('ignores a non-matching notification type', async () => {
        let refetched = false;
        server.use(
            http.get(DETAIL_URL, () => {
                if (refetched) {
                    return HttpResponse.json(
                        makeRefund({
                            status: RefundStatusType.Paid,
                            paidAt: '2026-06-13T14:27:00Z',
                            transferReference: 'VCB-TRF-20260613-0099431',
                        })
                    );
                }
                return HttpResponse.json(makeRefund({ status: RefundStatusType.Processing }));
            })
        );

        renderPage();

        expect(await findByI18nText('admin.refundDetail.processingTitle')).toBeInTheDocument();

        refetched = true;
        await pushNotification({
            type: 'payment-success',
            orderId: 'ord-1',
            slugId: 'ORD-ABC123',
            message: 'Payment confirmed',
            timestamp: '2026-06-13T14:27:00Z',
        });

        await waitFor(() => expect(getByI18nText('admin.refundDetail.processingTitle')).toBeInTheDocument());
        expect(queryByI18nText('admin.refundDetail.transferRecordTitle')).not.toBeInTheDocument();
    });
});
