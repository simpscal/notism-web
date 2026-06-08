import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { Settings } from '..';

import { UserRoleEnum } from '@/app/enums';
import i18n from '@/app/i18n/i18n';
import { UserProfileViewModel } from '@/features/user/models';
import { store } from '@/store';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user';

function mockMatchMedia(isMobile: boolean) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: isMobile,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
}

function buildUser(role: UserRoleEnum): UserProfileViewModel {
    return {
        id: '1',
        firstName: 'Mai',
        lastName: 'Nguyen',
        email: 'mai@example.com',
        avatarUrl: null,
        role,
    };
}

function renderSettings({
    role = UserRoleEnum.User,
    initialPath = '/settings/profile',
    isMobile = false,
}: {
    role?: UserRoleEnum;
    initialPath?: string;
    isMobile?: boolean;
} = {}) {
    mockMatchMedia(isMobile);
    store.dispatch(setUser(buildUser(role)));

    const Wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
            </I18nextProvider>
        </Provider>
    );

    return render(
        <Wrapper>
            <Routes>
                <Route path='settings' element={<Settings />}>
                    <Route path='profile' element={<div>Profile section content</div>} />
                    <Route path='appearance' element={<div>Appearance section content</div>} />
                    <Route path='payment' element={<div>Payment section content</div>} />
                </Route>
            </Routes>
        </Wrapper>
    );
}

describe('Settings shell', () => {
    beforeAll(() => {
        mockMatchMedia(false);
    });

    beforeEach(() => {
        mockMatchMedia(false);
    });

    afterEach(() => {
        store.dispatch(resetStore());
        vi.clearAllMocks();
    });

    it('renders the routed Outlet content for the active section', () => {
        renderSettings({ initialPath: '/settings/profile' });

        expect(screen.getByText('Profile section content')).toBeInTheDocument();
    });

    it('swaps Outlet content when deep-linking to a different section', () => {
        renderSettings({ initialPath: '/settings/appearance' });

        expect(screen.getByText('Appearance section content')).toBeInTheDocument();
        expect(screen.queryByText('Profile section content')).not.toBeInTheDocument();
    });

    it('renders section nav from the inventory Sidebar, not the old button-tab strip', () => {
        renderSettings({ initialPath: '/settings/profile' });

        // Inventory Sidebar markers present
        expect(document.querySelector('[data-slot="sidebar-menu-button"]')).toBeInTheDocument();

        // Nav links present for visible sections
        expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /appearance/i })).toBeInTheDocument();
    });

    it('marks the active section with isActive and aria-current="page" from the route', () => {
        renderSettings({ initialPath: '/settings/appearance' });

        const activeLink = screen.getByRole('link', { name: /appearance/i });
        expect(activeLink).toHaveAttribute('aria-current', 'page');

        const profileLink = screen.getByRole('link', { name: /profile/i });
        expect(profileLink).not.toHaveAttribute('aria-current', 'page');

        // isActive maps to data-active on the SidebarMenuButton (asChild => link is the button)
        expect(activeLink).toHaveAttribute('data-active', 'true');
        expect(profileLink).toHaveAttribute('data-active', 'false');
    });

    it('omits the admin-only Payment nav item for non-admin users', () => {
        renderSettings({ role: UserRoleEnum.User, initialPath: '/settings/profile' });

        expect(screen.queryByRole('link', { name: /payment/i })).not.toBeInTheDocument();
    });

    it('shows the Payment nav item for admin users', () => {
        renderSettings({ role: UserRoleEnum.Admin, initialPath: '/settings/profile' });

        expect(screen.getByRole('link', { name: /payment/i })).toBeInTheDocument();
    });

    it('navigates to a section when its nav link is clicked', async () => {
        renderSettings({ role: UserRoleEnum.Admin, initialPath: '/settings/profile' });

        await userEvent.click(screen.getByRole('link', { name: /appearance/i }));

        expect(screen.getByText('Appearance section content')).toBeInTheDocument();
    });

    it('exposes a SidebarTrigger for the built-in mobile Sheet with no separate Select', () => {
        renderSettings({ initialPath: '/settings/profile', isMobile: true });

        expect(screen.getByRole('button', { name: /open settings sections/i })).toBeInTheDocument();
        expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    });

    it('wraps the settings area in a single elevated Card', () => {
        const { container } = renderSettings({ initialPath: '/settings/profile' });

        const cards = container.querySelectorAll('[data-slot="card"]');
        expect(cards.length).toBe(1);
    });

    it('does not render the old buttonVariants tab strip', () => {
        renderSettings({ initialPath: '/settings/profile' });

        // The nav links must be anchors inside the sidebar, not button-variant pills.
        const profileLink = screen.getByRole('link', { name: /profile/i });
        expect(profileLink).toHaveAttribute('data-slot', 'sidebar-menu-button');
    });
});
