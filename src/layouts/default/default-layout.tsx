import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { DefaultLayoutToolbar, SettingsDialog } from './components';

import { ROUTES } from '@/app/configs';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { authApi } from '@/features/auth/apis';
import { authService } from '@/features/auth/services';

function DefaultLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleLogout = async () => {
        await authApi.logout();
        authService.logout(dispatch);
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.logIn}`);
    };

    const handleSettingsClick = () => {
        setIsSettingsOpen(true);
    };

    return (
        <div className='h-screen flex flex-col'>
            <DefaultLayoutToolbar user={user} onLogout={handleLogout} onSettingsClick={handleSettingsClick} />
            <main className='flex-grow'>
                <Outlet />
            </main>
            <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        </div>
    );
}

export default DefaultLayout;
