import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AdminToolbarMobileBottom, AdminToolbarMobileTop } from '../admin-toolbar-mobile';

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

function renderBottom({ initialPath = `/${ROUTES.ADMIN.DASHBOARD}` }: { initialPath?: string } = {}) {
    const onLogout = vi.fn();

    renderWithProviders(<AdminToolbarMobileBottom user={USER} onLogout={onLogout} />, {
        initialEntries: [initialPath],
    });

    return { onLogout };
}

function renderTop({ liveFeedStatus = NotificationStatus.Live }: { liveFeedStatus?: NotificationStatus } = {}) {
    renderWithProviders(<AdminToolbarMobileTop liveFeedStatus={liveFeedStatus} />, {
        initialEntries: [`/${ROUTES.ADMIN.DASHBOARD}`],
    });
}

describe('AdminToolbarMobileBottom', () => {
    it('renders a Dashboard shortcut pointing at the admin dashboard route', () => {
        renderBottom();

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).toHaveAttribute('href', `/${ROUTES.ADMIN.DASHBOARD}`);
    });

    it('renders the first four admin nav shortcuts', () => {
        renderBottom();

        expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', `/${ROUTES.ADMIN.DASHBOARD}`);
        expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('href', `/${ROUTES.ADMIN.ORDERS}`);
        expect(screen.getByRole('link', { name: /refunds/i })).toHaveAttribute('href', `/${ROUTES.ADMIN.REFUNDS}`);
        expect(screen.getByRole('link', { name: /foods/i })).toHaveAttribute('href', `/${ROUTES.ADMIN.FOODS}`);
    });

    it('marks the Dashboard shortcut active via aria-current when on the dashboard route', () => {
        renderBottom({ initialPath: `/${ROUTES.ADMIN.DASHBOARD}` });

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).toHaveAttribute('aria-current', 'page');
    });

    it('does not mark the Dashboard shortcut active when on another admin route', () => {
        renderBottom({ initialPath: `/${ROUTES.ADMIN.ORDERS}` });

        const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
        expect(dashboardLink).not.toHaveAttribute('aria-current', 'page');
    });

    it('renders as a floating rounded bar, not a flat edge-pinned strip', () => {
        const { container } = renderWithProviders(<AdminToolbarMobileBottom user={USER} onLogout={vi.fn()} />, {
            initialEntries: [`/${ROUTES.ADMIN.DASHBOARD}`],
        });

        const bar = container.querySelector('div');
        expect(bar?.className).toMatch(/rounded-full/);
        expect(bar?.className).not.toMatch(/(?:^|\s)border-t(?:\s|$)/);
        expect(bar?.className).not.toMatch(/order-last/);
    });
});

describe('AdminToolbarMobileTop', () => {
    it('renders the live new-order feed pill in the top strip', () => {
        renderTop({ liveFeedStatus: NotificationStatus.Live });

        expect(getByI18nText('admin.newOrder.feed.live')).toBeInTheDocument();
    });

    it('reflects the disconnected live-feed status in the pill', () => {
        renderTop({ liveFeedStatus: NotificationStatus.Disconnected });

        expect(getByI18nText('admin.newOrder.feed.disconnected')).toBeInTheDocument();
    });

    it('renders as a floating rounded bar, not a flat edge-pinned strip', () => {
        const { container } = renderWithProviders(<AdminToolbarMobileTop liveFeedStatus={NotificationStatus.Live} />, {
            initialEntries: [`/${ROUTES.ADMIN.DASHBOARD}`],
        });

        const strip = container.querySelector('header');
        expect(strip?.className).toMatch(/rounded-full/);
        expect(strip?.className).not.toMatch(/(?:^|\s)border-b(?:\s|$)/);
    });
});
