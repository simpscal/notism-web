import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
      <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
