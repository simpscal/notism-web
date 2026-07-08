import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdminToolbarMobile from '../admin-toolbar-mobile';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { NotificationStatus } from '@/core/hooks';
import { getByI18nText, renderWithProviders } from '@/test/utils';

const USER: UserProfileModel = {
    id: '1',
    firstName: 'Tran',
    lastName: 'Minh',
    email: 'minh@example.com',
    avatarUrl: null,
    role: 'admin',
};

function renderToolbar({
    initialPath = `/${ROUTES.ADMIN.DASHBOARD}`,
    liveFeedStatus = NotificationStatus.Live,
}: { initialPath?: string; liveFeedStatus?: NotificationStatus } = {}) {
    const onLogout = vi.fn();

    renderWithProviders(<AdminToolbarMobile user={USER} onLogout={onLogout} liveFeedStatus={liveFeedStatus} />, {
        initialEntries: [initialPath],
    });

    return { onLogout };
}

describe('AdminToolbarMobile', () => {
    it('renders a Dashboard shortcut pointing at the admin dashboard route', () => {
        renderToolbar();

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).toHaveAttribute('href', `/${ROUTES.ADMIN.DASHBOARD}`);
    });

    it('renders the first four admin nav shortcuts', () => {
        renderToolbar();

        expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', `/${ROUTES.ADMIN.DASHBOARD}`);
        expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('href', `/${ROUTES.ADMIN.ORDERS}`);
        expect(screen.getByRole('link', { name: /refunds/i })).toHaveAttribute('href', `/${ROUTES.ADMIN.REFUNDS}`);
        expect(screen.getByRole('link', { name: /foods/i })).toHaveAttribute('href', `/${ROUTES.ADMIN.FOODS}`);
    });

    it('marks the Dashboard shortcut active via aria-current when on the dashboard route', () => {
        renderToolbar({ initialPath: `/${ROUTES.ADMIN.DASHBOARD}` });

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark the Dashboard shortcut active when on another admin route', () => {
        renderToolbar({ initialPath: `/${ROUTES.ADMIN.ORDERS}` });

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).not.toHaveAttribute('aria-current', 'page');
    });

    it('renders the live new-order feed pill in the toolbar', () => {
        renderToolbar({ liveFeedStatus: NotificationStatus.Live });

        expect(getByI18nText('admin.newOrder.feed.live')).toBeInTheDocument();
    });

    it('reflects the disconnected live-feed status in the pill', () => {
        renderToolbar({ liveFeedStatus: NotificationStatus.Disconnected });

        expect(getByI18nText('admin.newOrder.feed.disconnected')).toBeInTheDocument();
    });
});
