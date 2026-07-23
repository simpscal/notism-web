import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { Login } from '..';

import { AUTH_ENDPOINTS } from '@/apis/auth/auth.constant';
import { ROUTES } from '@/app/constants';
import { UserRoleEnum } from '@/app/enums';
import { buildUrl } from '@/mocks/utils';
import { server } from '@/test/server';
import { renderWithProviders } from '@/test/utils';

const navigateMock = vi.fn();
let searchParamsValue = '';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return {
        ...actual,
        useNavigate: () => navigateMock,
        useSearchParams: () => [new URLSearchParams(searchParamsValue), vi.fn()],
    };
});

// syncCartAfterAuth issues cart sync network calls; stub it to an inert resolved thunk
// so the test isolates the post-login redirect decision.
vi.mock('@/features/cart', async () => {
    const actual = await vi.importActual<typeof import('@/features/cart')>('@/features/cart');
    return {
        ...actual,
        syncCartAfterAuth: vi.fn(() => () => ({ unwrap: () => Promise.resolve() })),
    };
});

const LOGIN_URL = buildUrl(AUTH_ENDPOINTS.LOGIN);

const buildAuthResponse = (role: UserRoleEnum) => ({
    token: 'token-123',
    user: {
        id: '1',
        firstName: 'Mai',
        lastName: 'Nguyen',
        email: 'mai@example.com',
        avatarUrl: null,
        role,
    },
});

async function submitLogin() {
    await userEvent.type(screen.getByLabelText(/email/i), 'mai@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'Password1!');
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
}

describe('Login redirect after sign-in', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    afterAll(() => server.close());

    beforeEach(() => {
        searchParamsValue = '';
        navigateMock.mockClear();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    it('redirects an admin user to the admin dashboard', async () => {
        server.use(http.post(LOGIN_URL, () => HttpResponse.json(buildAuthResponse(UserRoleEnum.Admin))));

        renderWithProviders(<Login />);
        await submitLogin();

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith(`/${ROUTES.ADMIN.DASHBOARD}`);
        });
    });

    it('redirects a non-admin user to settings profile', async () => {
        server.use(http.post(LOGIN_URL, () => HttpResponse.json(buildAuthResponse(UserRoleEnum.User))));

        renderWithProviders(<Login />);
        await submitLogin();

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith(`/${ROUTES.SETTINGS.PROFILE}`);
        });
    });

    it('honors an existing returnUrl over the role-based destination', async () => {
        searchParamsValue = 'returnUrl=%2Fcart';
        server.use(http.post(LOGIN_URL, () => HttpResponse.json(buildAuthResponse(UserRoleEnum.Admin))));

        renderWithProviders(<Login />);
        await submitLogin();

        await waitFor(() => {
            expect(navigateMock).toHaveBeenCalledWith('/cart', { replace: true });
        });
    });
});
