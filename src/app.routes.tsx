import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/core/guards';
import { AuthLayout } from '@/layouts/auth';
import { DefaultLayout } from '@/layouts/default';
import AboutPage from '@/pages/about';
import Login from '@/pages/login';
import NotFoundPage from '@/pages/not-found';
import Signup from '@/pages/signup';

function AppRoutes() {
    return (
        <Routes>
            {/* Root - Redirect to protected routes */}
            <Route index element={<Navigate replace to='/about' />} />

            {/* Auth Routes - Public */}
            <Route path='auth' element={<AuthLayout />}>
                <Route index element={<Navigate replace to='login' />} />
                <Route path='login' element={<Login />} />
                <Route path='signup' element={<Signup />} />
            </Route>

            {/* Protected Routes - Requires Authentication */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DefaultLayout />}>
                    <Route index element={<Navigate replace to='about' />} />
                    <Route path='about' element={<AboutPage />} />
                </Route>
            </Route>

            {/* 404 - Not Found */}
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;
