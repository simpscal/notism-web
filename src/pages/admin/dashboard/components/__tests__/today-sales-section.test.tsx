import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import TodaySalesSection from '../today-sales-section';

import type { GetDashboardTodaySalesResponseModel } from '@/apis';
import { ADMIN_ENDPOINTS } from '@/apis/admin/admin.constant';
import { buildUrl } from '@/mocks/utils';
import { server } from '@/test/server';
import { getByI18nText, renderWithProviders } from '@/test/utils';

const TODAY_SALES_URL = buildUrl(ADMIN_ENDPOINTS.DASHBOARD_TODAY_SALES);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const populatedSales: GetDashboardTodaySalesResponseModel = {
    revenue: 4_185_000,
    orderCount: 17,
};

const emptySales: GetDashboardTodaySalesResponseModel = {
    revenue: 0,
    orderCount: 0,
};

function renderSection() {
    return renderWithProviders(<TodaySalesSection />);
}

describe('TodaySalesSection', () => {
    it('sends the client-computed UTC today window as startUtc/endUtc query params', async () => {
        let received: { startUtc: string | null; endUtc: string | null } | undefined;
        server.use(
            http.get(TODAY_SALES_URL, ({ request }) => {
                const params = new URL(request.url).searchParams;
                received = { startUtc: params.get('startUtc'), endUtc: params.get('endUtc') };
                return HttpResponse.json(populatedSales);
            })
        );

        renderSection();

        await waitFor(() => {
            expect(screen.getByText('4,185,000 ₫')).toBeInTheDocument();
        });

        // The client owns the local→UTC conversion and sends a half-open 24h window.
        expect(received?.startUtc).toBeTruthy();
        expect(received?.endUtc).toBeTruthy();
        expect(received!.startUtc!.endsWith('Z')).toBe(true);
        expect(received!.endUtc!.endsWith('Z')).toBe(true);
        expect(new Date(received!.endUtc!).getTime() - new Date(received!.startUtc!).getTime()).toBe(
            24 * 60 * 60 * 1000
        );
    });

    it('renders the revenue and order-count bar gauges with their exact values in the success state', async () => {
        server.use(http.get(TODAY_SALES_URL, () => HttpResponse.json(populatedSales)));

        renderSection();

        await waitFor(() => {
            expect(screen.getByText('4,185,000 ₫')).toBeInTheDocument();
        });

        // Section heading is preserved from the merged implementation.
        expect(getByI18nText('admin.dashboard.todaySales.heading')).toBeInTheDocument();

        // Each figure is rendered as its own gauge with a clear label.
        expect(getByI18nText('admin.dashboard.todaySales.revenueLabel')).toBeInTheDocument();
        expect(getByI18nText('admin.dashboard.todaySales.ordersLabel')).toBeInTheDocument();
        expect(screen.getByText('17')).toBeInTheDocument();

        // Two independent single-value gauges, each on its own scale.
        const gauges = screen.getAllByRole('img');
        expect(gauges).toHaveLength(2);
        expect(screen.getByLabelText("Today's revenue: 4,185,000 ₫")).toBeInTheDocument();
        expect(screen.getByLabelText("Today's orders: 17")).toBeInTheDocument();
    });

    it('renders zero revenue and zero orders when no orders have been placed today', async () => {
        server.use(http.get(TODAY_SALES_URL, () => HttpResponse.json(emptySales)));

        renderSection();

        await waitFor(() => {
            expect(screen.getByText('0 ₫')).toBeInTheDocument();
        });

        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByLabelText("Today's revenue: 0 ₫")).toBeInTheDocument();
        expect(screen.getByLabelText("Today's orders: 0")).toBeInTheDocument();
    });

    it('shows a loading placeholder in place of the chart while the metrics are loading', async () => {
        server.use(
            http.get(TODAY_SALES_URL, async () => {
                await delay('infinite');
                return HttpResponse.json(populatedSales);
            })
        );

        const { container } = renderSection();

        expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
        expect(screen.queryByText('4,185,000 ₫')).not.toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('shows an error message with a retry action when loading fails, and refetches on retry', async () => {
        let attempts = 0;
        server.use(
            http.get(TODAY_SALES_URL, () => {
                attempts += 1;
                if (attempts === 1) {
                    return new HttpResponse(null, { status: 500 });
                }
                return HttpResponse.json(populatedSales);
            })
        );

        renderSection();

        await waitFor(() => {
            expect(getByI18nText('admin.dashboard.todaySales.errorTitle')).toBeInTheDocument();
        });

        // No chart is shown while the section is in its error state.
        expect(screen.queryByRole('img')).not.toBeInTheDocument();

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        await userEvent.click(retryButton);

        await waitFor(() => {
            expect(screen.getByText('4,185,000 ₫')).toBeInTheDocument();
        });
    });
});
