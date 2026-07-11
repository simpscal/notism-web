import { memo, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import ClientToolbarDesktop from './components/client-toolbar-desktop';
import ClientToolbarMobile from './components/client-toolbar-mobile';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { HeldRefundReminderBannerContainer, RefundPaidBannerStack } from '@/features/order';
import { resetStore } from '@/store/root.actions';

function ClientLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

    const handleLogout = useCallback(async () => {
        await authApi.logout();
        dispatch(resetStore());
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.AUTH.LOGIN}`);
    }, [dispatch, navigate]);

    return (
        <div className='relative flex h-screen w-full overflow-hidden bg-muted'>
            <div className='relative z-10 flex min-h-0 w-full flex-1 items-stretch'>
                <div className='flex h-full w-full flex-col gap-3 bg-muted p-3 lg:gap-4 lg:p-4'>
                    <ClientToolbarDesktop user={user} onLogout={handleLogout} />
                    <ClientToolbarMobile user={user} onLogout={handleLogout} />

                    <main className='order-first flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-border bg-background lg:order-last'>
                        <div className='min-h-0 flex-1 overflow-y-auto'>
                            <HeldRefundReminderBannerContainer />
                            <RefundPaidBannerStack />
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default memo(ClientLayout);
