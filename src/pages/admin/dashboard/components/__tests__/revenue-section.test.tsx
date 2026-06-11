import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import RevenueSection from '../revenue-section';

import type { GetDashboardRevenueSeriesResponseModel } from '@/apis';
import { renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';
const REVENUE_SERIES_URL = `${API_BASE}/admin/dashboard/revenue-series`;

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const monthSeries: GetDashboardRevenueSeriesResponseModel = {
    granularity: 'month',
    points: [
        { period: 'Jan', revenue: 72_400_000 },
        { period: 'Feb', revenue: 64_900_000 },
        { period: 'Mar', revenue: 81_350_000 },
        // Deliberate zero-revenue period — still rendered as a labelled bar.
        { period: 'Apr', revenue: 0 },
        { period: 'May', revenue: 95_700_000 },
        { period: 'Jun', revenue: 41_870_000 },
    ],
};

const yearSeries: GetDashboardRevenueSeriesResponseModel = {
    granularity: 'year',
    points: [
        { period: '2022', revenue: 0 },
        { period: '2023', revenue: 612_400_000 },
        { period: '2024', revenue: 938_750_000 },
    ],
};

function renderSection() {
    return renderWithProviders(<RevenueSection />);
}

/**
 * Resolve a chart bar (the SVG rectangle) for a given period by its accessible
 * label. Recharts renders the per-period aria-label onto the bar rectangle.
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

describe('RevenueSection', () => {
    it('sends the client-computed UTC boundary set, per-bucket labels, and granularity hint', async () => {
        let received: { boundaries: string[]; labels: string[]; granularity: string | null } | undefined;
        server.use(
            http.get(REVENUE_SERIES_URL, ({ request }) => {
                const params = new URL(request.url).searchParams;
                received = {
                    boundaries: params.getAll('boundaries'),
                    labels: params.getAll('labels'),
                    granularity: params.get('granularity'),
                };
                return HttpResponse.json(monthSeries);
            })
        );

        renderSection();

        await waitFor(() => {
            expect(received).toBeDefined();
        });

        // Default monthly granularity: 12 buckets → 12 labels, 13 ascending UTC boundaries.
        expect(received?.granularity).toBe('month');
        expect(received?.labels).toHaveLength(12);
        expect(received?.boundaries).toHaveLength(13);
        received!.boundaries.forEach(boundary => expect(boundary.endsWith('Z')).toBe(true));
        for (let i = 1; i < received!.boundaries.length; i += 1) {
            expect(new Date(received!.boundaries[i]).getTime()).toBeGreaterThan(
                new Date(received!.boundaries[i - 1]).getTime()
            );
        }
    });

    it('renders the per-period revenue chart defaulting to monthly granularity', async () => {
        server.use(http.get(REVENUE_SERIES_URL, () => HttpResponse.json(monthSeries)));

        const { container } = renderSection();

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: /Month/ })).toBeInTheDocument();
        });

        // Defaults to Month: the Month toggle is pressed.
        expect(screen.getByRole('radio', { name: /Month/ })).toHaveAttribute('data-state', 'on');

        // Total of the month series is shown formatted in VND.
        const total = 72_400_000 + 64_900_000 + 81_350_000 + 0 + 95_700_000 + 41_870_000;
        expect(screen.getByText(`${total.toLocaleString('en-US')} ₫`)).toBeInTheDocument();

        // Every period — including the zero-revenue April — is present as a labelled bar.
        expect(await findBar(container, 'Jan: 72,400,000 ₫')).not.toBeNull();
        expect(getBar(container, 'Apr: 0 ₫')).not.toBeNull();
    });

    it('refetches and re-totals when the admin switches granularity to Year', async () => {
        server.use(
            http.get(REVENUE_SERIES_URL, ({ request }) => {
                const granularity = new URL(request.url).searchParams.get('granularity');
                return HttpResponse.json(granularity === 'year' ? yearSeries : monthSeries);
            })
        );

        const { container } = renderSection();

        await findBar(container, 'Jan: 72,400,000 ₫');

        await userEvent.click(screen.getByRole('radio', { name: /Year/ }));

        await findBar(container, '2024: 938,750,000 ₫');

        // Re-totalled into the year series.
        const yearTotal = 0 + 612_400_000 + 938_750_000;
        expect(screen.getByText(`${yearTotal.toLocaleString('en-US')} ₫`)).toBeInTheDocument();
        // Zero-revenue year is kept on the chart.
        expect(getBar(container, '2022: 0 ₫')).not.toBeNull();
    });

    it('shows a loading placeholder in place of the chart while revenue data is loading', async () => {
        server.use(
            http.get(REVENUE_SERIES_URL, async () => {
                await delay('infinite');
                return HttpResponse.json(monthSeries);
            })
        );

        const { container } = renderSection();

        expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('shows an error message with a retry action when loading fails, and refetches on retry', async () => {
        let attempts = 0;
        server.use(
            http.get(REVENUE_SERIES_URL, () => {
                attempts += 1;
                if (attempts === 1) {
                    return new HttpResponse(null, { status: 500 });
                }
                return HttpResponse.json(monthSeries);
            })
        );

        renderSection();

        await waitFor(() => {
            expect(screen.getByText("Couldn't load revenue over time")).toBeInTheDocument();
        });

        // No chart is shown while the section is in its error state.
        expect(screen.queryByRole('img')).not.toBeInTheDocument();

        const retryButton = screen.getByRole('button', { name: 'Retry' });
        await userEvent.click(retryButton);

        await waitFor(() => {
            expect(screen.getByText('Revenue over time')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByRole('radio', { name: /Month/ })).toBeInTheDocument();
        });

        const toggle = screen.getByRole('group', { name: 'Revenue granularity' });
        expect(within(toggle).getByRole('radio', { name: /Month/ })).toHaveAttribute('data-state', 'on');
    });
});
