import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import AdminToolbarDesktop from './components/admin-toolbar-desktop';
import AdminToolbarMobile from './components/admin-toolbar-mobile';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { useNewOrderAlerts } from '@/features/order/hooks/use-new-order-alerts';
import { NotificationStatus } from '@/notification';
import { resetStore } from '@/store/root.actions';
import { type LiveFeedStatus } from '@/uis/live-feed-pill';

const LIVE_FEED_STATUS_MAP: Record<NotificationStatus, LiveFeedStatus> = {
    [NotificationStatus.Connecting]: 'connecting',
    [NotificationStatus.Live]: 'live',
    [NotificationStatus.Disconnected]: 'disconnected',
};

function AdminLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);
    const { t } = useTranslation();

    // Portal-wide live new-order feed (story #274): subscribed once at the admin
    // shell so the connection persists across navigation and alerts surface on
    // every admin route. Torn down only when staff leave the portal entirely.
    const { status } = useNewOrderAlerts();
    const liveFeedStatus = LIVE_FEED_STATUS_MAP[status];

    const liveFeedLabels = useMemo(
        () => ({
            connecting: t('admin.newOrder.feed.connecting'),
            live: t('admin.newOrder.feed.live'),
            disconnected: t('admin.newOrder.feed.disconnected'),
            reconnect: t('admin.newOrder.feed.reconnect'),
        }),
        [t]
    );

    const handleLogout = useCallback(async () => {
        await authApi.logout();
        dispatch(resetStore());
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.AUTH.LOGIN}`);
    }, [dispatch, navigate]);

    return (
        <div className='flex h-screen flex-col bg-background'>
            <AdminToolbarDesktop
                user={user}
                onLogout={handleLogout}
                liveFeedStatus={liveFeedStatus}
                liveFeedLabels={liveFeedLabels}
            />
            <AdminToolbarMobile
                user={user}
                onLogout={handleLogout}
                liveFeedStatus={liveFeedStatus}
                liveFeedLabels={liveFeedLabels}
            />
            <main className='flex-1 overflow-y-auto pb-16 lg:pb-0'>
                <Outlet />
            </main>
        </div>
    );
}

export default memo(AdminLayout);
