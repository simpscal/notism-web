import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './use-redux.hook';

import { authApi, USER_QUERY_KEYS } from '@/apis';
import { setInitialized } from '@/store/auth';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user/user.slice';

export function useReloadUser() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);
    const isAuthInitialized = useAppSelector(state => state.auth.isInitialized);

    const query = useQuery({
        queryKey: USER_QUERY_KEYS.reload(),
        queryFn: async () => {
            await authApi.refresh();
            return authApi.reload();
        },
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
            if (user) {
                dispatch(setInitialized());
            } else if (query.isSuccess || query.isError) {
                dispatch(setInitialized());
            }
        }
    }, [dispatch, isAuthInitialized, user, query.isSuccess, query.isError]);

    return {
        user,
        isLoading: query.isLoading,
        isInitialized: isAuthInitialized,
    };
}
