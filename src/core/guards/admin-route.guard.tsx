import { memo, useMemo } from 'react';
import { Outlet } from 'react-router-dom';

import { UserRoleEnum } from '@/app/enums';
import { useAppSelector } from '@/core/hooks';
import NotFoundPage from '@/pages/not-found';

function AdminRouteGuard() {
    const user = useAppSelector(state => state.user.user);

    const isAdmin = useMemo(() => {
        return user?.role === UserRoleEnum.Admin;
    }, [user?.role]);

    if (!isAdmin) {
        return <NotFoundPage />;
    }

    return <Outlet />;
}

export default memo(AdminRouteGuard);
