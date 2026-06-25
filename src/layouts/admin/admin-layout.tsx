import { memo, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AdminToolbarDesktop from './components/admin-toolbar-desktop';
import AdminToolbarMobile from './components/admin-toolbar-mobile';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { useNewOrderAlerts } from '@/features/order/hooks/use-new-order-alerts';
import { resetStore } from '@/store/root.actions';

function AdminLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

    // Portal-wide live new-order feed (story #274): subscribed once at the admin
    // shell so the connection persists across navigation and alerts surface on
    // every admin route. Torn down only when staff leave the portal entirely.
    const { status: liveFeedStatus } = useNewOrderAlerts();

    const handleLogout = useCallback(async () => {
        await authApi.logout();
        dispatch(resetStore());
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.AUTH.LOGIN}`);
    }, [dispatch, navigate]);

    return (
        <div className='flex h-screen flex-col bg-background'>
            <AdminToolbarDesktop user={user} onLogout={handleLogout} liveFeedStatus={liveFeedStatus} />
            <AdminToolbarMobile user={user} onLogout={handleLogout} liveFeedStatus={liveFeedStatus} />
            <main className='flex-1 overflow-y-auto pb-16 lg:pb-0'>
                <Outlet />
            </main>
        </div>
    );
}

export default memo(AdminLayout);
