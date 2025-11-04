import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '@/layouts/auth';
import { DefaultLayout } from '@/layouts/default';
import AboutPage from '@/pages/about';
import Login from '@/pages/login';
import NotFoundPage from '@/pages/not-found';
import Signup from '@/pages/signup';

function AppRoutes() {
    return (
        <Routes>
            <Route index element={<DefaultLayout />}></Route>

            <Route path='auth' element={<AuthLayout />}>
                <Route index element={<Navigate replace to='login' />} />
                <Route path='login' element={<Login />} />
                <Route path='signup' element={<Signup />} />
            </Route>

            <Route path='about' element={<AboutPage />} />
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;
