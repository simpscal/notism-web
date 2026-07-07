import { memo, useCallback, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import ClientToolbarDesktop from './components/client-toolbar-desktop';
import ClientToolbarMobile from './components/client-toolbar-mobile';
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
        <div className='relative flex h-screen w-full overflow-hidden bg-frame p-3 sm:p-4 lg:p-6'>
            <div className='relative z-10 flex min-h-0 w-full flex-1 items-stretch'>
                <div className='flex h-full w-full flex-col gap-3 rounded-[1.75rem] bg-muted p-3 shadow-[0_20px_60px_-26px_rgba(0,0,0,0.45)] lg:gap-4 lg:rounded-[2rem] lg:p-4'>
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
        </div>
    );
}

export default memo(ClientLayout);
