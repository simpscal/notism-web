import { Outlet } from 'react-router-dom';

import { DefaultLayoutToolbar } from './components';

import { useAppSelector } from '@/core/hooks';

function DefaultLayout() {
    const user = useAppSelector(state => state.auth.user);

    const handleLogout = () => {};

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
