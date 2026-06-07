import { memo } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import ClientToolbarDesktop from './components/client-toolbar-desktop';
import ClientToolbarMobile from './components/client-toolbar-mobile';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { resetStore } from '@/store/root.actions';

function ClientLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

    const handleLogout = async () => {
        await authApi.logout();
        dispatch(resetStore());
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.AUTH.LOGIN}`);
    };

    return (
        <div className='flex h-screen flex-col bg-background'>
            <>
                <ClientToolbarDesktop user={user} onLogout={handleLogout} />
                <ClientToolbarMobile user={user} onLogout={handleLogout} />
            </>
            <main className='flex-1 overflow-y-auto pb-16 lg:pb-0'>
                <Outlet />
            </main>
        </div>
    );
}

export default memo(ClientLayout);
