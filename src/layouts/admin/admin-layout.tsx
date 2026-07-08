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
        // Ambient dark frame → large-radius light shell → pinned NavBar toolbar
        // above an independently scrolling, table-oriented content zone.
        <div className='relative h-screen w-full overflow-hidden bg-frame p-2 sm:p-3'>
            <div className='relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] bg-muted shadow-[0_4px_20px_rgba(0,0,0,0.05)]'>
                <AdminToolbarDesktop user={user} onLogout={handleLogout} liveFeedStatus={liveFeedStatus} />
                <AdminToolbarMobile user={user} onLogout={handleLogout} liveFeedStatus={liveFeedStatus} />
                <main className='min-h-0 flex-1 overflow-y-auto'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default memo(AdminLayout);
