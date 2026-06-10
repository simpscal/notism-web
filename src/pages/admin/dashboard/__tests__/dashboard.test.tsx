import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import Dashboard from '../dashboard';

import type { GetDashboardOrderStatusSummaryResponseModel, GetDashboardTodaySalesResponseModel } from '@/apis';
import { renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';
const SUMMARY_URL = `${API_BASE}/admin/dashboard/order-status-summary`;
const TODAY_SALES_URL = `${API_BASE}/admin/dashboard/today-sales`;

const server = setupServer();

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
        expect(screen.getByText('Orders by status')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('New')).toBeInTheDocument();
        });
    });

    it("renders the today's sales metrics section above the order status section", async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(summary)));
        server.use(http.get(TODAY_SALES_URL, () => HttpResponse.json(todaySales)));

        renderWithProviders(<Dashboard />);

        expect(screen.getByText("Today's sales")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('4,185,000 ₫')).toBeInTheDocument();
        });

        const salesHeading = screen.getByText("Today's sales");
        const statusHeading = screen.getByText('Orders by status');
        expect(salesHeading.compareDocumentPosition(statusHeading)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
});
