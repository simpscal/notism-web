import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthRouteGuard, ResetPasswordRouteGuard } from '@/core/guards';
import { AuthLayout } from '@/layouts/auth';
import { ClientLayout } from '@/layouts/client';
import Login from '@/pages/login';
import NotFoundPage from '@/pages/not-found';
import OAuthCallback from '@/pages/oauth-callback';
import { OAuthCallbackRouteGuard } from '@/pages/oauth-callback/guards';
import Profile from '@/pages/profile';
import { RequestResetPasswordPage } from '@/pages/request-reset-password';
import { ResetPasswordPage } from '@/pages/reset-password';
import Signup from '@/pages/signup';

function AppRoutes() {
    return (
        <Routes>
            {/* Auth Routes - Public (Redirects authenticated users) */}
            <Route path='auth' element={<AuthRouteGuard />}>
                <Route element={<AuthLayout />}>
                    <Route index element={<Navigate replace to='login' />} />
                    <Route path='login' element={<Login />} />
                    <Route path='signup' element={<Signup />} />
                    <Route path='request-reset-password' element={<RequestResetPasswordPage />} />
                    <Route
                        path='reset-password'
                        element={
                            <ResetPasswordRouteGuard>
                                <ResetPasswordPage />
                            </ResetPasswordRouteGuard>
                        }
                    />
                    <Route
                        path='oauth/:provider/callback'
                        element={
                            <OAuthCallbackRouteGuard>
                                <OAuthCallback />
                            </OAuthCallbackRouteGuard>
                        }
                    />
                </Route>
            </Route>

            {/* Protected Routes - Requires Authentication */}
            <Route element={<AuthRouteGuard mode='authenticated' />}>
                <Route element={<ClientLayout />}>
                    <Route path='profile' element={<Profile />} />
                </Route>
            </Route>

            {/* 404 - Not Found */}
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;
