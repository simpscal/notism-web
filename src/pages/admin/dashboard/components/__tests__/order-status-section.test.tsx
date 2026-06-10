import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import { Route, Routes, useLocation } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import OrderStatusSection from '../order-status-section';

import type { GetDashboardOrderStatusSummaryResponseModel } from '@/apis';
import { renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';
const SUMMARY_URL = `${API_BASE}/admin/dashboard/order-status-summary`;

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const populatedSummary: GetDashboardOrderStatusSummaryResponseModel = {
    new: 12,
    inProgress: 5,
    completed: 184,
};

const emptySummary: GetDashboardOrderStatusSummaryResponseModel = {
    new: 0,
    inProgress: 0,
    completed: 184,
};

/** Captures the current location so navigation can be asserted. */
function LocationProbe() {
    const location = useLocation();
    return <div data-testid='location-display'>{`${location.pathname}${location.search}`}</div>;
}

function renderSection() {
    return renderWithProviders(
        <Routes>
            <Route path='/' element={<OrderStatusSection />} />
            <Route path='/admin/orders' element={<LocationProbe />} />
        </Routes>
    );
}

describe('OrderStatusSection', () => {
    it('renders a card with the count for each status in the success state', async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(populatedSummary)));

        renderSection();

        await waitFor(() => {
            expect(screen.getByText('New')).toBeInTheDocument();
        });

        expect(screen.getByText('In Progress')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('12')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('184')).toBeInTheDocument();
    });

    it('shows a count of zero when a status has no orders', async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(emptySummary)));

        renderSection();

        await waitFor(() => {
            expect(screen.getByText('New')).toBeInTheDocument();
        });

        // Both "New" and "In Progress" are zero.
        expect(screen.getAllByText('0')).toHaveLength(2);
    });

    it('shows skeleton placeholders while the order data is loading', async () => {
        server.use(
            http.get(SUMMARY_URL, async () => {
                await delay('infinite');
                return HttpResponse.json(populatedSummary);
            })
        );

        const { container } = renderSection();

        // Skeletons render immediately; the populated cards do not.
        expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
        expect(screen.queryByText('12')).not.toBeInTheDocument();
    });

    it('shows an error message with a retry action when loading fails, and refetches on retry', async () => {
        let attempts = 0;
        server.use(
            http.get(SUMMARY_URL, () => {
                attempts += 1;
                if (attempts === 1) {
                    return new HttpResponse(null, { status: 500 });
                }
                return HttpResponse.json(populatedSummary);
            })
        );

        renderSection();

        await waitFor(() => {
            expect(screen.getByText("Couldn't load order status counts")).toBeInTheDocument();
        });

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        await userEvent.click(retryButton);

        await waitFor(() => {
            expect(screen.getByText('12')).toBeInTheDocument();
        });
    });

    it('navigates to the filtered orders list when a status card is clicked', async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(populatedSummary)));

        renderSection();

        const card = await screen.findByRole('button', {
            name: 'New orders: 12. View filtered list.',
        });

        await userEvent.click(card);

        await waitFor(() => {
            expect(screen.getByTestId('location-display')).toHaveTextContent('/admin/orders?status=new');
        });
    });
});
