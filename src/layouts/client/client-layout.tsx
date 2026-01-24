import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ClientLayoutToolbar } from './components';

import { authApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { unsetAuth } from '@/store/auth/auth.slice';

function ClientLayout() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user);

    const handleLogout = async () => {
        await authApi.logout();
        dispatch(unsetAuth());
        toast.success('Logged out successfully');
        navigate(`/${ROUTES.AUTH.LOGIN}`);
    };

    return (
        <div className='h-screen flex flex-col overflow-hidden'>
            <ClientLayoutToolbar user={user} onLogout={handleLogout} />
            <main className='flex-1 overflow-y-auto'>
                <Outlet />
            </main>
        </div>
    );
}

export default ClientLayout;
