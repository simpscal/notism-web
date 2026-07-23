import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdminToolbarDesktop from '../admin-toolbar-desktop';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import i18n from '@/app/i18n/i18n';
import { getByI18nText, renderWithProviders } from '@/test/utils';
import { type LiveFeedStatus } from '@/uis/live-feed-pill';

const USER: UserProfileModel = {
    id: '1',
    firstName: 'Tran',
    lastName: 'Minh',
    email: 'minh@example.com',
    avatarUrl: null,
    role: 'admin',
};

const LIVE_FEED_LABELS = {
    connecting: i18n.t('admin.newOrder.feed.connecting'),
    live: i18n.t('admin.newOrder.feed.live'),
    disconnected: i18n.t('admin.newOrder.feed.disconnected'),
    reconnect: i18n.t('admin.newOrder.feed.reconnect'),
};

function renderToolbar({
    initialPath = `/${ROUTES.ADMIN.DASHBOARD}`,
    liveFeedStatus = 'live',
}: { initialPath?: string; liveFeedStatus?: LiveFeedStatus } = {}) {
    const onLogout = vi.fn();

    renderWithProviders(
        <AdminToolbarDesktop
            user={USER}
            onLogout={onLogout}
            liveFeedStatus={liveFeedStatus}
            liveFeedLabels={LIVE_FEED_LABELS}
        />,
        { initialEntries: [initialPath] }
    );

    return { onLogout };
}

describe('AdminToolbarDesktop', () => {
    it('renders Dashboard as the first nav link', () => {
        renderToolbar();

        const nav = screen.getByRole('navigation');
        const links = nav.querySelectorAll('a');

        expect(links[0]).toHaveTextContent(/dashboard/i);
    });

    it('points the Dashboard link at the admin dashboard route', () => {
        renderToolbar();

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).toHaveAttribute('href', `/${ROUTES.ADMIN.DASHBOARD}`);
    });

    it('marks the Dashboard link active when on the dashboard route', () => {
        renderToolbar({ initialPath: `/${ROUTES.ADMIN.DASHBOARD}` });

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).toHaveAttribute('aria-current', 'page');
        expect(dashboardLink.className).toMatch(/text-primary/);
    });

    it('does not mark the Dashboard link active when on another admin route', () => {
        renderToolbar({ initialPath: `/${ROUTES.ADMIN.ORDERS}` });

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).not.toHaveAttribute('aria-current', 'page');
    });

    it('renders the live new-order feed pill in the toolbar', () => {
        renderToolbar({ liveFeedStatus: 'live' });

        expect(getByI18nText('admin.newOrder.feed.live')).toBeInTheDocument();
    });

    it('reflects the connecting live-feed status in the pill', () => {
        renderToolbar({ liveFeedStatus: 'connecting' });

        expect(getByI18nText('admin.newOrder.feed.connecting')).toBeInTheDocument();
    });
});
