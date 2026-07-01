import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AdminLayout from '../admin-layout';

import { ROUTES } from '@/app/constants';
import { NotificationStatus } from '@/core/hooks';
import { getAllByI18nText, renderWithProviders } from '@/test/utils';

const useNewOrderAlertsMock = vi.fn();

vi.mock('@/features/order/hooks/use-new-order-alerts', () => ({
    useNewOrderAlerts: () => useNewOrderAlertsMock(),
}));

function renderLayout({ initialPath = `/${ROUTES.ADMIN.DASHBOARD}` }: { initialPath?: string } = {}) {
    renderWithProviders(
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path={`/${ROUTES.ADMIN.DASHBOARD}`} element={<div>dashboard page body</div>} />
                <Route path={`/${ROUTES.ADMIN.ORDERS}`} element={<div>orders page body</div>} />
            </Route>
        </Routes>,
        { initialEntries: [initialPath] }
    );
}

describe('AdminLayout', () => {
    beforeEach(() => {
        useNewOrderAlertsMock.mockReturnValue({ status: NotificationStatus.Live });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('mounts the live new-order subscription once at the portal shell', () => {
        renderLayout();

        expect(useNewOrderAlertsMock).toHaveBeenCalled();
    });

    it('renders the live-feed pill in the persistent admin toolbar', () => {
        renderLayout();

        // Desktop + mobile toolbars both render the pill.
        expect(getAllByI18nText('admin.newOrder.feed.live').length).toBeGreaterThanOrEqual(1);
    });

    it('keeps the live-feed pill present on a non-dashboard admin route', () => {
        renderLayout({ initialPath: `/${ROUTES.ADMIN.ORDERS}` });

        expect(screen.getByText('orders page body')).toBeInTheDocument();
        expect(getAllByI18nText('admin.newOrder.feed.live').length).toBeGreaterThanOrEqual(1);
    });

    it('reflects the live-feed status from the subscription in the pill', () => {
        useNewOrderAlertsMock.mockReturnValue({ status: NotificationStatus.Connecting });

        renderLayout();

        expect(getAllByI18nText('admin.newOrder.feed.connecting').length).toBeGreaterThanOrEqual(1);
    });
});
