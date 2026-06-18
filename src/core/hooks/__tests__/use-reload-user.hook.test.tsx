import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { useReloadUser } from '../use-reload-user.hook';

import { tokenManagerUtils } from '@/app/utils';
import { store } from '@/store';
import { setToken } from '@/store/auth';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user/user.slice';
import { renderWithProviders } from '@/test/utils';

const RELOAD_URL = 'http://localhost:5000/api/auth/reload';

const FULL_PROFILE = {
    id: '1',
    firstName: 'Mai',
    lastName: 'Nguyen',
    email: 'mai@example.com',
    avatarUrl: null,
    role: 'User',
    phoneNumber: '0900000000',
    location: '123 Le Loi, District 1',
    authType: 'Password',
};

// The login response carries no location by design; this mirrors what setAuth stores.
const LOGIN_USER = {
    id: '1',
    firstName: 'Mai',
    lastName: 'Nguyen',
    email: 'mai@example.com',
    avatarUrl: null,
    role: 'User',
};

const server = setupServer();

describe('useReloadUser', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    afterAll(() => server.close());

    beforeEach(() => {
        store.dispatch(resetStore());
        tokenManagerUtils.clearAll();
    });

    afterEach(() => {
        server.resetHandlers();
        store.dispatch(resetStore());
        tokenManagerUtils.clearAll();
    });

    it('fetches the full profile (with location) on cold start when a token exists but no user is loaded', async () => {
        server.use(http.get(RELOAD_URL, () => HttpResponse.json(FULL_PROFILE)));
        tokenManagerUtils.setToken('token-123');

        renderWithProviders(<ReloadHarness />);

        await waitFor(() => {
            expect(store.getState().user.user?.location).toBe(FULL_PROFILE.location);
        });
    });

    it('fetches the full profile after first login even though a user (without location) is already in the store', async () => {
        let reloadCalls = 0;
        server.use(
            http.get(RELOAD_URL, () => {
                reloadCalls += 1;
                return HttpResponse.json(FULL_PROFILE);
            })
        );

        // Simulate the post-login state: token set + login user stored, but no location.
        store.dispatch(setToken('token-123'));
        store.dispatch(setUser(LOGIN_USER));
        expect(store.getState().user.user?.location).toBeUndefined();

        renderWithProviders(<ReloadHarness />);

        await waitFor(() => {
            expect(store.getState().user.user?.location).toBe(FULL_PROFILE.location);
        });
        expect(reloadCalls).toBeGreaterThan(0);
    });

    it('does not fetch when there is no token', async () => {
        let reloadCalls = 0;
        server.use(
            http.get(RELOAD_URL, () => {
                reloadCalls += 1;
                return HttpResponse.json(FULL_PROFILE);
            })
        );

        renderWithProviders(<ReloadHarness />);

        await waitFor(() => {
            expect(store.getState().auth.isInitialized).toBe(true);
        });
        expect(reloadCalls).toBe(0);
        expect(store.getState().user.user).toBeNull();
    });
});

function ReloadHarness() {
    useReloadUser();
    return null;
}
