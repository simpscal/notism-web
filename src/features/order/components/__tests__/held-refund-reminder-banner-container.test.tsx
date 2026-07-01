import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import HeldRefundReminderBannerContainer from '../held-refund-reminder-banner-container';

import type { HeldRefundResponseModel } from '@/apis';
import { ORDER_ENDPOINTS } from '@/apis/order/order.constant';
import i18n from '@/app/i18n/i18n';
import { buildUrl } from '@/mocks/utils';
import { server } from '@/test/server';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const HELD_REFUNDS_URL = buildUrl(ORDER_ENDPOINTS.HELD_REFUNDS);

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock };
});

const HELD_ONE: HeldRefundResponseModel = {
    refundId: 'rfd-7001',
    orderReference: 'ORD-20260613-0099',
    amount: 485_000,
};

const HELD_TWO: HeldRefundResponseModel = {
    refundId: 'rfd-7002',
    orderReference: 'ORD-20260611-0063',
    amount: 215_000,
};

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => {
    server.resetHandlers();
    navigateMock.mockReset();
});
afterAll(() => server.close());

describe('HeldRefundReminderBannerContainer', () => {
    it('shows the single-refund reminder when one refund is held', async () => {
        server.use(http.get(HELD_REFUNDS_URL, () => HttpResponse.json([HELD_ONE])));

        renderWithProviders(<HeldRefundReminderBannerContainer />);

        expect(await screen.findByText(t('order.refund.heldReminderBanner.titleSingle'))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(HELD_ONE.orderReference))).toBeInTheDocument();
    });

    it('shows the consolidated reminder when multiple refunds are held', async () => {
        server.use(http.get(HELD_REFUNDS_URL, () => HttpResponse.json([HELD_ONE, HELD_TWO])));

        renderWithProviders(<HeldRefundReminderBannerContainer />);

        expect(await screen.findByText(t('order.refund.heldReminderBanner.titleMultiple'))).toBeInTheDocument();
        expect(
            screen.getByText(
                new RegExp(
                    t('order.refund.heldReminderBanner.messageMultiple', {
                        count: 2,
                        amount: '700,000 ₫',
                    }).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                )
            )
        ).toBeInTheDocument();
    });

    it('renders nothing when no refund is held', async () => {
        let called = false;
        server.use(
            http.get(HELD_REFUNDS_URL, () => {
                called = true;
                return HttpResponse.json([]);
            })
        );

        const { container } = renderWithProviders(<HeldRefundReminderBannerContainer />);

        await waitFor(() => {
            expect(called).toBe(true);
        });
        expect(screen.queryByText(t('order.refund.heldReminderBanner.titleSingle'))).not.toBeInTheDocument();
        expect(screen.queryByText(t('order.refund.heldReminderBanner.titleMultiple'))).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing while the query is loading', () => {
        server.use(http.get(HELD_REFUNDS_URL, async () => await delay('infinite')));

        const { container } = renderWithProviders(<HeldRefundReminderBannerContainer />);

        expect(container).toBeEmptyDOMElement();
    });

    it('routes to the bank-details settings page when the banner is clicked', async () => {
        server.use(http.get(HELD_REFUNDS_URL, () => HttpResponse.json([HELD_ONE])));

        renderWithProviders(<HeldRefundReminderBannerContainer />);

        const banner = await screen.findByRole('button', {
            name: new RegExp(t('order.refund.heldReminderBanner.titleSingle')),
        });
        await userEvent.click(banner);

        expect(navigateMock).toHaveBeenCalledWith('/settings/payment');
    });
});
