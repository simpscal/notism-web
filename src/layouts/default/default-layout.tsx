import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { DefaultLayoutToolbar } from './components';

import { ROUTES } from '@/app/configs';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { authApi } from '@/features/auth/apis';
import { clearUser } from '@/store/auth/auth.slice';

function DefaultLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.auth);

    const handleLogout = async () => {
        await authApi.logout();
        dispatch(clearUser());
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
