import { Outlet } from 'react-router-dom';

function AuthLayout() {
    return (
        <div className='flex min-h-screen w-screen items-center justify-center bg-background p-4 sm:p-6'>
            <div className='w-full max-w-md p-4 sm:p-6 md:p-8 bg-card rounded-lg shadow-md border'>
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
