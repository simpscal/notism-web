import { useContext, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/app/configs';
import Spinner from '@/components/ui/spinner';
import { AppInitializeContext } from '@/core/contexts';
import { tokenManagerUtils } from '@/shared/utils';

export function ProtectedRoute() {
    const { isInitialized, initialize } = useContext(AppInitializeContext);

    const accessToken = tokenManagerUtils.getToken();
    const hasValidToken = accessToken && !tokenManagerUtils.isTokenExpired(accessToken);

    useEffect(() => {
        if (hasValidToken) {
            initialize();
        }
    }, [hasValidToken, initialize]);

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
