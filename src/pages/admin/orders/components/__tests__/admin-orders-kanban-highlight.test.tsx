import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import AdminOrdersKanban from '../admin-orders-kanban';

import type { AdminOrdersViewModel } from '@/features/admin';
import { DeliveryStatusEnum } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

vi.mock('react-intersection-observer', () => ({
    useInView: () => ({ ref: vi.fn(), inView: false }),
}));

const API_BASE = 'http://localhost:5000/api';
const KANBAN_URL = `${API_BASE}/admin/orders/kanban`;

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const emptyColumn: AdminOrdersViewModel = { items: [], totalCount: 0 };

beforeAll(() => {
    // jsdom does not implement scrollIntoView.
    Element.prototype.scrollIntoView = vi.fn();
});

describe('AdminOrdersKanban — dashboard drill-through highlight', () => {
    it('emphasises only the columns mapped from the selected status bucket', async () => {
        server.use(http.get(KANBAN_URL, () => HttpResponse.json(emptyColumn)));

        renderWithProviders(
            <AdminOrdersKanban
                onOrderClick={vi.fn()}
                highlightedStatuses={[DeliveryStatusEnum.Preparing, DeliveryStatusEnum.OnTheWay]}
            />
        );

        // Columns render once the queries settle.
        await waitFor(() => {
            expect(document.querySelectorAll('.ring-primary\\/40').length).toBe(2);
        });
    });

    it('does not highlight any column when no status bucket is selected', async () => {
        server.use(http.get(KANBAN_URL, () => HttpResponse.json(emptyColumn)));

        renderWithProviders(<AdminOrdersKanban onOrderClick={vi.fn()} highlightedStatuses={[]} />);

        await waitFor(() => {
            // Placed column header is rendered, confirming the board has mounted.
            expect(screen.getAllByText('(0)').length).toBeGreaterThan(0);
        });

        expect(document.querySelectorAll('.ring-primary\\/40').length).toBe(0);
    });
});
