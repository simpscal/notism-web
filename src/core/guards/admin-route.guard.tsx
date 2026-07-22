import { memo, useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { UserRoleEnum } from '@/app/enums';
import { useAppSelector } from '@/core/hooks';

function AdminRouteGuard() {
    const user = useAppSelector(state => state.user.user);

    const isAdmin = useMemo(() => {
        return user?.role === UserRoleEnum.Admin;
    }, [user?.role]);

    if (!isAdmin) {
        return <Navigate to={`/${ROUTES.NOT_FOUND}`} replace />;
    }

    return <Outlet />;
}

export default memo(AdminRouteGuard);
