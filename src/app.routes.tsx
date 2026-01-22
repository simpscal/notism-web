import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthRouteGuard, ResetPasswordRouteGuard } from '@/core/guards';
import { AuthLayout } from '@/layouts/auth';
import { ClientLayout } from '@/layouts/client';
import { FoodDetail } from '@/pages/food-detail';
import { Foods } from '@/pages/foods';
import { Login } from '@/pages/login';
import NotFoundPage from '@/pages/not-found';
import OAuthCallback from '@/pages/oauth-callback';
import { OAuthCallbackRouteGuard } from '@/pages/oauth-callback/guards';
import Profile from '@/pages/profile';
import { RequestResetPassword } from '@/pages/request-reset-password';
import { ResetPassword } from '@/pages/reset-password';
import { Signup } from '@/pages/signup';

function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<Navigate replace to='/foods' />} />

            <Route path='auth' element={<AuthRouteGuard />}>
                <Route element={<AuthLayout />}>
                    <Route index element={<Navigate replace to='login' />} />
                    <Route path='login' element={<Login />} />
                    <Route path='signup' element={<Signup />} />
                    <Route path='request-reset-password' element={<RequestResetPassword />} />
                    <Route
                        path='reset-password'
                        element={
                            <ResetPasswordRouteGuard>
                                <ResetPassword />
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

            <Route element={<ClientLayout />}>
                <Route path='foods' element={<Foods />} />
                <Route path='foods/:id' element={<FoodDetail />} />

                <Route element={<AuthRouteGuard mode='authenticated' />}>
                    <Route path='profile' element={<Profile />} />
                </Route>
            </Route>

            {/* 404 - Not Found */}
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRoutes;
