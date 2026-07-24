import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import AdminRefundsTable from '../admin-refunds-table';

import { ADMIN_ENDPOINTS } from '@/apis/admin/admin.constant';
import i18n from '@/core/i18n/i18n';
import { buildUrl } from '@/mocks/utils';
import { server } from '@/test/server';
import { findByI18nText, queryByI18nText, renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const REFUNDS_URL = buildUrl(ADMIN_ENDPOINTS.REFUNDS);

const makeRefund = (n: number, status: string, overrides: Record<string, unknown> = {}) => ({
    id: `refund-${n}`,
    orderId: `order-${n}`,
    orderSlugId: `ORD${String(n).padStart(4, '0')}`,
    amount: 100000 + n,
    status,
    transferReference: null,
    createdAt: '2026-06-13T10:40:00Z',
    paidAt: null,
    ...overrides,
});

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AdminRefundsTable', () => {
    it('lists refunds with order reference, amount, status, transfer reference and dates', async () => {
        server.use(
            http.get(REFUNDS_URL, () =>
                HttpResponse.json({
                    totalCount: 1,
                    items: [
                        makeRefund(1, 'paid', {
                            transferReference: 'VCB-TRF-20260613-0099431',
                            paidAt: '2026-06-13T09:18:00Z',
                        }),
                    ],
                })
            )
        );

        renderWithProviders(<AdminRefundsTable onRefundClick={vi.fn()} />);

        const row = (await screen.findByText('#ORD0001')).closest('tr') as HTMLElement;
        expect(within(row).getByText('VCB-TRF-20260613-0099431')).toBeInTheDocument();
        expect(within(row).getByText(t('order.refund.statuses.paid'))).toBeInTheDocument();
    });

    it('sends the active status filter to the query', async () => {
        let requestedStatus: string | null = null;
        server.use(
            http.get(REFUNDS_URL, ({ request }) => {
                requestedStatus = new URL(request.url).searchParams.get('status');
                return HttpResponse.json({ totalCount: 1, items: [makeRefund(1, 'pending')] });
            })
        );

        renderWithProviders(<AdminRefundsTable status='pending' onRefundClick={vi.fn()} />);

        await screen.findByText('#ORD0001');
        expect(requestedStatus).toBe('pending');
    });

    it('shows the empty state when the filter returns no refunds', async () => {
        server.use(http.get(REFUNDS_URL, () => HttpResponse.json({ totalCount: 0, items: [] })));

        renderWithProviders(<AdminRefundsTable status='paid' onRefundClick={vi.fn()} />);

        expect(await findByI18nText('admin.refunds.empty')).toBeInTheDocument();
    });

    it('shows a loading skeleton while refunds load', () => {
        server.use(
            http.get(
                REFUNDS_URL,
                () => new Promise(() => {}) // never resolves
            )
        );

        renderWithProviders(<AdminRefundsTable onRefundClick={vi.fn()} />);

        expect(screen.getByTestId('admin-refunds-skeleton')).toBeInTheDocument();
    });

    it('shows an error state with retry when loading fails, and retry reloads', async () => {
        let shouldFail = true;
        server.use(
            http.get(REFUNDS_URL, () => {
                if (shouldFail) return new HttpResponse(null, { status: 500 });
                return HttpResponse.json({ totalCount: 1, items: [makeRefund(1, 'pending')] });
            })
        );

        renderWithProviders(<AdminRefundsTable onRefundClick={vi.fn()} />);

        expect(await findByI18nText('admin.refunds.failedToLoad')).toBeInTheDocument();

        shouldFail = false;
        await userEvent.click(screen.getByRole('button', { name: t('common.retry') }));

        expect(await screen.findByText('#ORD0001')).toBeInTheDocument();
        await waitFor(() => expect(queryByI18nText('admin.refunds.failedToLoad')).not.toBeInTheDocument());
    });

    it('emits onRefundClick with the refund id when the view action is pressed', async () => {
        const onRefundClick = vi.fn();
        server.use(
            http.get(REFUNDS_URL, () => HttpResponse.json({ totalCount: 1, items: [makeRefund(1, 'pending')] }))
        );

        renderWithProviders(<AdminRefundsTable onRefundClick={onRefundClick} />);

        const row = (await screen.findByText('#ORD0001')).closest('tr') as HTMLElement;
        await userEvent.click(within(row).getByRole('button', { name: t('admin.refunds.viewRefund') }));

        expect(onRefundClick).toHaveBeenCalledWith('refund-1');
    });

    it('renders a placeholder in the Order column when the order slug is absent', async () => {
        server.use(
            http.get(REFUNDS_URL, () =>
                HttpResponse.json({ totalCount: 1, items: [makeRefund(1, 'pending', { orderSlugId: '' })] })
            )
        );

        renderWithProviders(<AdminRefundsTable onRefundClick={vi.fn()} />);

        const viewButton = await screen.findByRole('button', { name: t('admin.refunds.viewRefund') });
        const row = viewButton.closest('tr') as HTMLElement;
        expect(within(row).queryByText(/#ORD/)).not.toBeInTheDocument();
        const orderCell = row.querySelector('td') as HTMLElement;
        expect(within(orderCell).getByText('—')).toBeInTheDocument();
    });
});
