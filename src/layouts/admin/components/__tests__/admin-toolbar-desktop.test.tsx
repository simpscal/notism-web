import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdminToolbarDesktop from '../admin-toolbar-desktop';

import { ROUTES } from '@/app/constants';
import { UserProfileViewModel } from '@/features/user/models';
import { renderWithProviders } from '@/test/utils';

const USER: UserProfileViewModel = {
    id: '1',
    firstName: 'Tran',
    lastName: 'Minh',
    email: 'minh@example.com',
    avatarUrl: null,
    role: 'admin',
};

function renderToolbar({ initialPath = `/${ROUTES.ADMIN.DASHBOARD}` }: { initialPath?: string } = {}) {
    const onLogout = vi.fn();

    renderWithProviders(<AdminToolbarDesktop user={USER} onLogout={onLogout} />, {
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
});
