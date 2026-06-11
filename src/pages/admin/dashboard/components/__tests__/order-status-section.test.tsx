import { fireEvent, screen, waitFor } from '@testing-library/react';
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

/**
 * Resolve the interactive chart bar (the SVG rectangle) for a given status by its
 * accessible label. Recharts can leak the same aria-label onto the bar's value
 * label text, so we scope strictly to the bar rectangle the user clicks.
 */
function getBar(container: HTMLElement, label: string): SVGPathElement | null {
    return container.querySelector<SVGPathElement>(`path.recharts-rectangle[aria-label="${label}"]`);
}

async function findBar(container: HTMLElement, label: string): Promise<SVGPathElement> {
    let bar: SVGPathElement | null = null;
    await waitFor(() => {
        bar = getBar(container, label);
        expect(bar).not.toBeNull();
    });
    return bar as unknown as SVGPathElement;
}

describe('OrderStatusSection', () => {
    it('renders a chart with a clickable bar carrying the count for each status in the success state', async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(populatedSummary)));

        const { container } = renderSection();

        const newBar = await findBar(container, 'New orders: 12. View orders filtered to New.');
        expect(newBar).toHaveAttribute('role', 'button');
        expect(getBar(container, 'In Progress orders: 5. View orders filtered to In Progress.')).not.toBeNull();
        expect(getBar(container, 'Completed orders: 184. View orders filtered to Completed.')).not.toBeNull();
    });

    it('still renders a labelled bar for a status with zero orders', async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(emptySummary)));

        const { container } = renderSection();

        // Zero-count statuses keep a labelled, accessible bar in the chart.
        await findBar(container, 'New orders: 0. View orders filtered to New.');
        expect(getBar(container, 'In Progress orders: 0. View orders filtered to In Progress.')).not.toBeNull();
        expect(getBar(container, 'Completed orders: 184. View orders filtered to Completed.')).not.toBeNull();
    });

    it('shows a skeleton placeholder in place of the chart while the order data is loading', async () => {
        server.use(
            http.get(SUMMARY_URL, async () => {
                await delay('infinite');
                return HttpResponse.json(populatedSummary);
            })
        );

        const { container } = renderSection();

        // Skeletons render immediately; the populated chart bars do not.
        expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
        expect(getBar(container, 'New orders: 12. View orders filtered to New.')).toBeNull();
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

        const { container } = renderSection();

        await waitFor(() => {
            expect(screen.getByText("Couldn't load order status counts")).toBeInTheDocument();
        });

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        await userEvent.click(retryButton);

        await findBar(container, 'New orders: 12. View orders filtered to New.');
    });

    it('navigates to the filtered orders list when a status bar is clicked', async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(populatedSummary)));

        const { container } = renderSection();

        const bar = await findBar(container, 'New orders: 12. View orders filtered to New.');

        // The bar is an SVG <path>; fireEvent dispatches the click recharts wires
        // up, whereas userEvent's hit-testing does not resolve SVG geometry in jsdom.
        fireEvent.click(bar);

        await waitFor(() => {
            expect(screen.getByTestId('location-display')).toHaveTextContent('/admin/orders?status=new');
        });
    });
});
