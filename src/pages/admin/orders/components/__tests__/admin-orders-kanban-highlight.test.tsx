import { act, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import AdminOrdersKanban from '../admin-orders-kanban';

import type { AdminOrdersModel } from '@/apis';
import { ADMIN_ENDPOINTS } from '@/apis/admin/admin.constant';
import { DeliveryStatusType } from '@/features/order';
import { buildUrl } from '@/mocks/utils';
import { server } from '@/test/server';
import { renderWithProviders } from '@/test/utils';
import { HIGHLIGHT_DURATION_MS } from '@/uis/kanban';

vi.mock('react-intersection-observer', () => ({
    useInView: () => ({ ref: vi.fn(), inView: false }),
}));

const KANBAN_URL = buildUrl(ADMIN_ENDPOINTS.ORDERS_KANBAN);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const emptyColumn: AdminOrdersModel = { items: [], totalCount: 0 };

beforeAll(() => {
    // jsdom does not implement scrollIntoView.
    Element.prototype.scrollIntoView = vi.fn();
});

const countHighlightedColumns = () => document.querySelectorAll('.ring-primary\\/40').length;

describe('AdminOrdersKanban — transient status highlight', () => {
    it('emphasises only the columns mapped from the selected status keys', async () => {
        server.use(http.get(KANBAN_URL, () => HttpResponse.json(emptyColumn)));

        renderWithProviders(
            <AdminOrdersKanban
                onOrderClick={vi.fn()}
                highlightedStatuses={[DeliveryStatusType.Preparing, DeliveryStatusType.OnTheWay]}
            />
        );

        // Columns render and pulse once the queries settle.
        await waitFor(() => {
            expect(countHighlightedColumns()).toBe(2);
        });
    });

    it('does not highlight any column when no status key is selected', async () => {
        server.use(http.get(KANBAN_URL, () => HttpResponse.json(emptyColumn)));

        renderWithProviders(<AdminOrdersKanban onOrderClick={vi.fn()} highlightedStatuses={[]} />);

        await waitFor(() => {
            // Placed column header is rendered, confirming the board has mounted.
            expect(screen.getAllByText('(0)').length).toBeGreaterThan(0);
        });

        expect(countHighlightedColumns()).toBe(0);
    });

    describe('with fake timers', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.runOnlyPendingTimers();
            vi.useRealTimers();
        });

        it('auto-fades the highlight after HIGHLIGHT_DURATION_MS', async () => {
            server.use(http.get(KANBAN_URL, () => HttpResponse.json(emptyColumn)));

            renderWithProviders(
                <AdminOrdersKanban
                    onOrderClick={vi.fn()}
                    highlightedStatuses={[DeliveryStatusType.Preparing, DeliveryStatusType.OnTheWay]}
                />
            );

            // Flush pending queries/effects so the columns mount and pulse.
            await vi.waitFor(() => {
                expect(countHighlightedColumns()).toBe(2);
            });

            // Advancing past the highlight duration clears every pulsing column.
            act(() => {
                vi.advanceTimersByTime(HIGHLIGHT_DURATION_MS);
            });

            expect(countHighlightedColumns()).toBe(0);
        });

        it('scrolls a highlighted column into view on activation', async () => {
            server.use(http.get(KANBAN_URL, () => HttpResponse.json(emptyColumn)));

            const scrollSpy = vi.spyOn(Element.prototype, 'scrollIntoView');

            renderWithProviders(
                <AdminOrdersKanban onOrderClick={vi.fn()} highlightedStatuses={[DeliveryStatusType.Preparing]} />
            );

            await vi.waitFor(() => {
                expect(countHighlightedColumns()).toBe(1);
            });

            expect(scrollSpy).toHaveBeenCalled();
        });
    });
});
