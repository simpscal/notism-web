import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdminToolbarDesktop from '../admin-toolbar-desktop';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { NotificationStatus } from '@/core/hooks';
import { renderWithProviders } from '@/test/utils';

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

    renderWithProviders(<AdminToolbarDesktop user={USER} onLogout={onLogout} liveFeedStatus={liveFeedStatus} />, {
        initialEntries: [initialPath],
    });

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
        renderToolbar({ liveFeedStatus: NotificationStatus.Live });

        expect(screen.getByText('Live orders on')).toBeInTheDocument();
    });

    it('reflects the connecting live-feed status in the pill', () => {
        renderToolbar({ liveFeedStatus: NotificationStatus.Connecting });

        expect(screen.getByText('Connecting to live orders…')).toBeInTheDocument();
    });
});
