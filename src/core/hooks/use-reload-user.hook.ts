import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from './use-redux.hook';

import { authApi } from '@/apis';
import { tokenManagerUtils } from '@/app/utils';
import { unsetAuth } from '@/store/auth/auth.slice';
import { setUser } from '@/store/user/user.slice';

const QUERY_KEY = ['user', 'reload'] as const;

export function useReloadUser() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

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
            dispatch(unsetAuth());
        }
    }, [query.isError, dispatch]);

    return {
        user,
        isLoading: query.isLoading,
        isInitialized: !hasValidToken || !!user,
    };
}
