import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import AdminToolbarDesktop from '../admin-toolbar-desktop';

import { ROUTES } from '@/app/constants';
import i18n from '@/app/i18n/i18n';
import { ThemeProvider } from '@/core/contexts/theme.context';
import { UserProfileViewModel } from '@/features/user/models';
import { store } from '@/store';

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

    const Wrapper = ({ children }: { children: ReactNode }) => (
        <Provider store={store}>
            <I18nextProvider i18n={i18n}>
                <ThemeProvider>
                    <MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
                </ThemeProvider>
            </I18nextProvider>
        </Provider>
    );

    render(
        <Wrapper>
            <AdminToolbarDesktop user={USER} onLogout={onLogout} />
        </Wrapper>
    );

    return { onLogout };
}

describe('AdminToolbarDesktop', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            configurable: true,
            value: vi.fn().mockImplementation((query: string) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });

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
