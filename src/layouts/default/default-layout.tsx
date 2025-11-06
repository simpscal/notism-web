import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { DefaultLayoutToolbar } from './components';

import { ROUTES } from '@/app/configs';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { authApi } from '@/features/auth/apis';
import { authService } from '@/features/auth/services';

function DefaultLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

    const handleLogout = async () => {
        await authApi.logout();
        authService.logout(dispatch);
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.logIn}`);
    };

    return (
        <div className='min-h-screen flex flex-col'>
            <DefaultLayoutToolbar user={user} onLogout={handleLogout} />
            <main className='flex-1'>
                <Outlet />
            </main>
        </div>
    );
}

export default DefaultLayout;
