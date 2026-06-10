import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import TodaySalesSection from '../today-sales-section';

import type { GetDashboardTodaySalesResponseModel } from '@/apis';
import { renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';
const TODAY_SALES_URL = `${API_BASE}/admin/dashboard/today-sales`;

const server = setupServer();

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
    it('renders revenue and order count cards in the success state', async () => {
        server.use(http.get(TODAY_SALES_URL, () => HttpResponse.json(populatedSales)));

        renderSection();

        await waitFor(() => {
            expect(screen.getByText("Today's revenue")).toBeInTheDocument();
        });

        expect(screen.getByText("Today's orders")).toBeInTheDocument();
        expect(screen.getByText('4,185,000 ₫')).toBeInTheDocument();
        expect(screen.getByText('17')).toBeInTheDocument();
        expect(screen.getByText('Gross sales since midnight')).toBeInTheDocument();
        expect(screen.getByText('Orders placed since midnight')).toBeInTheDocument();
    });

    it('renders zero revenue and zero orders with the zero-state sublabels', async () => {
        server.use(http.get(TODAY_SALES_URL, () => HttpResponse.json(emptySales)));

        renderSection();

        await waitFor(() => {
            expect(screen.getByText("Today's revenue")).toBeInTheDocument();
        });

        expect(screen.getByText('0 ₫')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('No sales yet today')).toBeInTheDocument();
        expect(screen.getByText('No orders placed yet today')).toBeInTheDocument();
    });

    it('shows skeleton placeholders while the metrics are loading', async () => {
        server.use(
            http.get(TODAY_SALES_URL, async () => {
                await delay('infinite');
                return HttpResponse.json(populatedSales);
            })
        );

        const { container } = renderSection();

        expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
        expect(screen.queryByText('4,185,000 ₫')).not.toBeInTheDocument();
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
            expect(screen.getByText("Couldn't load today's metrics")).toBeInTheDocument();
        });

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        await userEvent.click(retryButton);

        await waitFor(() => {
            expect(screen.getByText('4,185,000 ₫')).toBeInTheDocument();
        });
    });
});
