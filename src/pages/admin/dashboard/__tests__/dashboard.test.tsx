import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import Dashboard from '../dashboard';

import type { GetDashboardOrderStatusSummaryResponseModel } from '@/apis';
import { renderWithProviders } from '@/test/utils';

const API_BASE = 'http://localhost:5000/api';
const SUMMARY_URL = `${API_BASE}/admin/dashboard/order-status-summary`;

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const summary: GetDashboardOrderStatusSummaryResponseModel = {
    new: 3,
    inProgress: 1,
    completed: 9,
};

describe('Dashboard page shell', () => {
    it('renders the dashboard header and the order status section', async () => {
        server.use(http.get(SUMMARY_URL, () => HttpResponse.json(summary)));

        renderWithProviders(<Dashboard />);

        expect(screen.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
        expect(screen.getByText('Orders by status')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('New')).toBeInTheDocument();
        });
    });
});
