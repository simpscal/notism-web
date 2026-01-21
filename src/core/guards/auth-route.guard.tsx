import { Navigate, Outlet } from 'react-router-dom';

import { useAppSelector } from '../hooks';

import { ROUTES } from '@/app/constants';

interface AuthRouteGuardProps {
    mode?: 'authenticated' | 'anonymous';
}

export function AuthRouteGuard({ mode = 'anonymous' }: AuthRouteGuardProps = {}) {
    const user = useAppSelector(state => state.user.user);

    if (mode === 'anonymous') {
        if (user) {
            return <Navigate to={`/${ROUTES.PROFILE}`} replace />;
        }

        return <Outlet />;
    }

    if (!user) {
        return <Navigate to={`/${ROUTES.AUTH.LOGIN}`} replace />;
    }

    return <Outlet />;
}
