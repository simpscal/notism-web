import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { useReloadUser } from '../use-reload-user.hook';

import { AUTH_ENDPOINTS } from '@/apis/auth/auth.constant';
import { tokenManagerUtils } from '@/app/utils';
import { buildUrl } from '@/mocks/utils';
import { store } from '@/store';
import { setToken } from '@/store/auth';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user/user.slice';
import { server } from '@/test/server';
import { renderWithProviders } from '@/test/utils';

const RELOAD_URL = buildUrl(AUTH_ENDPOINTS.RELOAD);
const REFRESH_URL = buildUrl(AUTH_ENDPOINTS.REFRESH);

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

function mockRefreshSuccess(token = 'token-123') {
    return http.post(REFRESH_URL, () => HttpResponse.json({ token }));
}

function mockRefreshFailure() {
    return http.post(REFRESH_URL, () => new HttpResponse(null, { status: 401 }));
}

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

    it('mints a fresh token via refresh, then fetches the full profile, on cold start', async () => {
        server.use(
            mockRefreshSuccess(),
            http.get(RELOAD_URL, () => HttpResponse.json(FULL_PROFILE))
        );

        renderWithProviders(<ReloadHarness />);

        await waitFor(() => {
            expect(store.getState().user.user?.location).toBe(FULL_PROFILE.location);
        });
        expect(tokenManagerUtils.getToken()).toBe('token-123');
    });

    it('always attempts refresh+reload on mount, even when the store already has a partial user', async () => {
        // The post-login full-profile refetch itself is handled directly by the
        // `setAuth` thunk, not by this hook — this only covers what happens if the
        // hook mounts while the store already has a token + partial user in it.
        let reloadCalls = 0;
        server.use(
            mockRefreshSuccess('token-456'),
            http.get(RELOAD_URL, () => {
                reloadCalls += 1;
                return HttpResponse.json(FULL_PROFILE);
            })
        );

        store.dispatch(setToken('token-123'));
        store.dispatch(setUser(LOGIN_USER));
        expect(store.getState().user.user?.location).toBeUndefined();

        renderWithProviders(<ReloadHarness />);

        await waitFor(() => {
            expect(store.getState().user.user?.location).toBe(FULL_PROFILE.location);
        });
        expect(reloadCalls).toBeGreaterThan(0);
    });

    it('signs out cleanly when there is no session, without ever calling reload', async () => {
        let reloadCalls = 0;
        server.use(
            mockRefreshFailure(),
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
