import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AdminToolbarMobile from '../admin-toolbar-mobile';

import { UserProfileModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { renderWithProviders } from '@/test/utils';

const USER: UserProfileModel = {
    id: '1',
    firstName: 'Tran',
    lastName: 'Minh',
    email: 'minh@example.com',
    avatarUrl: null,
    role: 'admin',
};

function renderToolbar({ initialPath = `/${ROUTES.ADMIN.DASHBOARD}` }: { initialPath?: string } = {}) {
    const onLogout = vi.fn();

    renderWithProviders(<AdminToolbarMobile user={USER} onLogout={onLogout} />, {
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

    it('renders Dashboard as the first nav shortcut', () => {
        renderToolbar();

        const links = screen.getAllByRole('link');
        expect(links[0]).toHaveAttribute('href', `/${ROUTES.ADMIN.DASHBOARD}`);
    });

    it('marks the Dashboard shortcut active when on the dashboard route', () => {
        renderToolbar({ initialPath: `/${ROUTES.ADMIN.DASHBOARD}` });

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).toHaveAttribute('aria-current', 'page');
        expect(dashboardLink.className).toMatch(/text-primary/);
    });

    it('does not mark the Dashboard shortcut active when on another admin route', () => {
        renderToolbar({ initialPath: `/${ROUTES.ADMIN.ORDERS}` });

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).not.toHaveAttribute('aria-current', 'page');
    });
});
