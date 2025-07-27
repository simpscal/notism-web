import { Outlet } from 'react-router-dom';

function DefaultLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-gray-800 text-white p-4'>
        <h1 className='text-xl'>My Application</h1>
      </header>

      <main className='flex-grow p-4'>
        <Outlet />
      </main>

      <footer className='bg-gray-800 text-white p-4 text-center'>
        © 2023 My Application
      </footer>
    </div>
  );
}

export default DefaultLayout;
