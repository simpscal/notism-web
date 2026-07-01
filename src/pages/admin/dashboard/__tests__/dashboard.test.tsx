import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import Dashboard from '../dashboard';

import type { GetDashboardOrderStatusSummaryResponseModel, GetDashboardTodaySalesResponseModel } from '@/apis';
import { ADMIN_ENDPOINTS } from '@/apis/admin/admin.constant';
import { buildUrl } from '@/mocks/utils';
import { server } from '@/test/server';
import { getByI18nText, renderWithProviders } from '@/test/utils';

const SUMMARY_URL = buildUrl(ADMIN_ENDPOINTS.DASHBOARD_ORDER_STATUS_SUMMARY);
const TODAY_SALES_URL = buildUrl(ADMIN_ENDPOINTS.DASHBOARD_TODAY_SALES);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const summary: GetDashboardOrderStatusSummaryResponseModel = {
    new: 3,
    inProgress: 1,
    completed: 9,
};

const todaySales: GetDashboardTodaySalesResponseModel = {
    revenue: 4_185_000,
    orderCount: 17,
};

describe('Dashboard page shell', () => {
    it('renders the dashboard header and the order status section', async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(summary)));
        server.use(http.get(TODAY_SALES_URL, () => HttpResponse.json(todaySales)));

        renderWithProviders(<Dashboard />);

        expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
        expect(getByI18nText('admin.dashboard.orderStatus.heading')).toBeInTheDocument();

        await waitFor(() => {
            expect(getByI18nText('admin.dashboard.orderStatus.statuses.new')).toBeInTheDocument();
        });
    });

    it("renders the today's sales metrics section above the order status section", async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(summary)));
        server.use(http.get(TODAY_SALES_URL, () => HttpResponse.json(todaySales)));

        renderWithProviders(<Dashboard />);

        expect(getByI18nText('admin.dashboard.todaySales.heading')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('4,185,000 ₫')).toBeInTheDocument();
        });

        const salesHeading = getByI18nText('admin.dashboard.todaySales.heading');
        const statusHeading = getByI18nText('admin.dashboard.orderStatus.heading');
        expect(salesHeading.compareDocumentPosition(statusHeading)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
});
