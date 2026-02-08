import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ClientLayoutToolbar, NavigationSidebar } from './components';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { SidebarInset, SidebarProvider } from '@/components/sidebar';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { loadCart } from '@/store/cart';
import { resetStore } from '@/store/root.actions';

function ClientLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);
    const authIsInitialized = useAppSelector(state => state.auth.isInitialized);

    useEffect(() => {
        if (authIsInitialized) {
            dispatch(loadCart());
        }
    }, [authIsInitialized]);

    const handleLogout = async () => {
        await authApi.logout();
        dispatch(resetStore());
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.AUTH.LOGIN}`);
    };

    return (
        <SidebarProvider className='h-screen' defaultOpen={false}>
            <NavigationSidebar />
            <SidebarInset className='flex flex-col overflow-hidden'>
                <ClientLayoutToolbar user={user} onLogout={handleLogout} />
                <main className='flex-1 overflow-y-auto'>
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default ClientLayout;
