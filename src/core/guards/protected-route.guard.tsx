import { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/app/configs';
import Spinner from '@/components/ui/spinner';
import { AppInitializeContext } from '@/core/contexts';
import { useAppSelector } from '@/core/hooks';
import { tokenManagerUtils } from '@/shared/utils';

export function ProtectedRoute() {
    const { isInitialized, initialize } = useContext(AppInitializeContext);
    const user = useAppSelector(state => state.auth.user);
    const accessToken = tokenManagerUtils.getToken();

    const hasValidToken = accessToken && !tokenManagerUtils.isTokenExpired(accessToken);

    const isAuthenticated = hasValidToken && user !== null;

    useEffect(() => {
        if (isAuthenticated) {
            initialize();
        }
    }, [isAuthenticated, initialize]);

    if (!isAuthenticated) {
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
