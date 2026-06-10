import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { Login } from '..';

import { ROUTES } from '@/app/constants';
import { UserRoleEnum } from '@/app/enums';
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

// setAuth dispatches cart sync network calls; stub it to an inert resolved thunk
// so the test isolates the post-login redirect decision.
vi.mock('@/store/auth', async () => {
    const actual = await vi.importActual<typeof import('@/store/auth')>('@/store/auth');
    return {
        ...actual,
        setAuth: vi.fn(() => () => ({ unwrap: () => Promise.resolve() })),
    };
});

const LOGIN_URL = 'http://localhost:5000/api/auth/login';

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

const server = setupServer();

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
