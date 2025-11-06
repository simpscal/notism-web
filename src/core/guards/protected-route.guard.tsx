import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAppDispatch } from '../hooks';

import { ROUTES } from '@/app/configs';
import Spinner from '@/components/ui/spinner';
import { authApi } from '@/features/auth/apis/auth.api';
import { tokenManagerUtils } from '@/shared/utils';
import { setUser } from '@/store/user/user.slice';

export function ProtectedRoute() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const dispatch = useAppDispatch();

    const accessToken = tokenManagerUtils.getToken();
    const hasValidToken = accessToken && !tokenManagerUtils.isTokenExpired(accessToken);

    useEffect(() => {
        if (!hasValidToken || isInitialized || isInitializing) {
            return;
        }

        setIsInitializing(true);

        authApi
            .reload()
            .then(userProfile => dispatch(setUser(userProfile)))
            .then(() => {
                setIsInitialized(true);
            });
    }, [hasValidToken, isInitialized, isInitializing, dispatch]);

    if (!hasValidToken) {
        return <Navigate to={`/${ROUTES.logIn}`} replace />;
    }

    if (!isInitialized) {
        return (
            <div className='flex h-screen w-screen items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    return <Outlet />;
}
