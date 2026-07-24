import { memo, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { UserRoleType } from '@/app/types';
import { useAppSelector } from '@/core/hooks';

function AdminRouteGuard() {
    const user = useAppSelector(state => state.user.user);

    const isAdmin = useMemo(() => {
        return user?.role === UserRoleType.Admin;
    }, [user?.role]);

    if (!isAdmin) {
        return <Navigate to={`/${ROUTES.NOT_FOUND}`} replace />;
    }

    return <Outlet />;
}

export default memo(AdminRouteGuard);
