import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './use-redux.hook';

import { authApi } from '@/apis';
import { tokenManagerUtils } from '@/app/utils';
import { setInitialized } from '@/store/auth';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user/user.slice';

const QUERY_KEY = ['user', 'reload'] as const;

export function useReloadUser() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);
    const isAuthInitialized = useAppSelector(state => state.auth.isInitialized);

    const accessToken = tokenManagerUtils.getToken();
    const hasValidToken = Boolean(accessToken);

    const query = useQuery({
        queryKey: QUERY_KEY,
        queryFn: () => authApi.reload(),
        enabled: hasValidToken && !user,
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
        isInitialized: isAuthInitialized,
    };
}
