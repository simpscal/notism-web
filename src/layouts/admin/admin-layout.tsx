import { memo, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AdminToolbarDesktop from './components/admin-toolbar-desktop';
import { AdminToolbarMobileBottom, AdminToolbarMobileTop } from './components/admin-toolbar-mobile';

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
        // Full-bleed shell on the neutral canvas: floating rounded chrome (desktop
        // NavBar / mobile strips) inset from the edges, hovering over an
        // independently scrolling, table-oriented content zone.
        <div className='flex h-screen w-full flex-col overflow-hidden bg-muted'>
            <div className='hidden shrink-0 px-4 pt-4 lg:block lg:px-6 lg:pt-6'>
                <AdminToolbarDesktop user={user} onLogout={handleLogout} liveFeedStatus={liveFeedStatus} />
            </div>
            <div className='shrink-0 px-3 pt-3 lg:hidden'>
                <AdminToolbarMobileTop liveFeedStatus={liveFeedStatus} />
            </div>

            <main className='min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6'>
                <Outlet />
            </main>

            <div className='shrink-0 px-3 pb-3 lg:hidden'>
                <AdminToolbarMobileBottom user={user} onLogout={handleLogout} />
            </div>
        </div>
    );
}

export default memo(AdminLayout);
