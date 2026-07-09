import { memo, useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import ClientToolbarDesktop from './components/client-toolbar-desktop';
import ClientToolbarMobile from './components/client-toolbar-mobile';
import FrameDecoration from './components/frame-decoration';
import OrderSidebar from './components/order-sidebar';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { HeldRefundReminderBannerContainer, RefundPaidBannerStack } from '@/features/order';
import { resetStore } from '@/store/root.actions';

function ClientLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

    const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);

    const handleLogout = useCallback(async () => {
        await authApi.logout();
        dispatch(resetStore());
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.AUTH.LOGIN}`);
    }, [dispatch, navigate]);

    const handleOpenOrder = useCallback(() => {
        setOrderDrawerOpen(true);
    }, []);

    return (
        // Dark ambient frame (decoration only) → one large-radius light shell that
        // floats over it and holds the pinned toolbar + independently scrolling
        // content zone + persistent order sidebar.
        <div className='relative h-screen w-full overflow-hidden bg-frame p-2 sm:p-3'>
            <FrameDecoration />

            <div className='relative z-10 flex h-full min-h-0 w-full flex-col gap-3 overflow-hidden rounded-[2rem] bg-muted p-3 shadow-[0_4px_20px_rgba(0,0,0,0.05)] lg:gap-4 lg:p-4'>
                <ClientToolbarDesktop user={user} onLogout={handleLogout} />
                <ClientToolbarMobile user={user} onLogout={handleLogout} onOpenOrder={handleOpenOrder} />

                <div className='flex min-h-0 flex-1 gap-3 lg:gap-4'>
                    <main className='flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-border bg-background'>
                        <div className='min-h-0 flex-1 overflow-y-auto'>
                            <HeldRefundReminderBannerContainer />
                            <RefundPaidBannerStack />
                            <Outlet />
                        </div>
                    </main>

                    <OrderSidebar open={orderDrawerOpen} onOpenChange={setOrderDrawerOpen} />
                </div>
            </div>
        </div>
    );
}

export default memo(ClientLayout);
