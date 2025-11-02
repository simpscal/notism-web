import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-background'>
      <div className='w-full max-w-md p-6 bg-card rounded-lg shadow-md border'>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
