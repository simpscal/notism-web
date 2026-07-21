import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './use-redux.hook';

import { authApi, USER_QUERY_KEYS } from '@/apis';
import { tokenManagerUtils } from '@/app/utils';
import { setInitialized } from '@/store/auth';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user/user.slice';

export function useReloadUser() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);
    const isAuthInitialized = useAppSelector(state => state.auth.isInitialized);
    const accessToken = useAppSelector(state => state.auth.accessToken);

    // Fall back to persisted token for cold starts where Redux has not yet hydrated it.
    const hasValidToken = Boolean(accessToken ?? tokenManagerUtils.getToken());

    // Gate on token presence only. Gating on `!user` skipped the reload after
    // login/register/OAuth — those responses omit location — so the authoritative
    // full profile never loaded until a manual refresh cleared the store.
    const query = useQuery({
        queryKey: USER_QUERY_KEYS.reload(),
        queryFn: () => authApi.reload(),
        enabled: hasValidToken,
        retry: false,
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setUser(query.data));
        }
    }, [query.data, dispatch]);

    useEffect(() => {
        if (query.isError) {
            dispatch(resetStore());
        }
    }, [query.isError, dispatch]);

    useEffect(() => {
        if (!isAuthInitialized) {
            if (!hasValidToken) {
                dispatch(setInitialized());
            } else if (user) {
                dispatch(setInitialized());
            } else if (query.isSuccess || query.isError) {
                dispatch(setInitialized());
            }
        }
    }, [dispatch, isAuthInitialized, hasValidToken, user, query.isSuccess, query.isError]);

    return {
        user,
        isLoading: query.isLoading,
        // SSR never runs the effects above (React doesn't run effects during
        // server rendering), so `isAuthInitialized` would stay `false` forever and
        // block landing content behind `App`'s loading gate. There is no session to
        // check server-side anyway (guarded `tokenManagerUtils` always reports no
        // token there), so resolve immediately instead.
        isInitialized: typeof window === 'undefined' ? true : isAuthInitialized,
    };
}
