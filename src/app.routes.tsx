import { Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import {
    AdminCategories,
    AdminCategoryDetail,
    AdminDashboard,
    AdminFoodDetail,
    AdminFoods,
    AdminOrderDetail,
    AdminOrders,
    AdminRefundDetail,
    AdminRefunds,
    AdminUserDetail,
    AdminUsers,
    Cart,
    FoodDetail,
    Foods,
    Landing,
    Login,
    NotFoundPage,
    OAuthCallback,
    OrderDetail,
    Orders,
    Payment,
    RequestResetPassword,
    ResetPassword,
    Settings,
    SettingsAppearance,
    SettingsPayment,
    SettingsProfile,
    Signup,
} from '@/app/routing/lazy-pages';
import { ROUTE_PRELOAD_MAP } from '@/app/routing/route-preload-map';
import Spinner from '@/components/spinner';
import { AdminRouteGuard, AuthRouteGuard, ResetPasswordRouteGuard } from '@/core/guards';
import { useIdlePreload } from '@/core/hooks';
import { AdminLayout } from '@/layouts/admin';
import { AuthLayout } from '@/layouts/auth';
import { ClientLayout } from '@/layouts/client';
import { OAuthCallbackRouteGuard } from '@/pages/oauth-callback/guards';

function AppRoutes() {
    const location = useLocation();
    const preloadTargets = ROUTE_PRELOAD_MAP[location.pathname];
    useIdlePreload(preloadTargets);

    return (
        <Suspense
            fallback={
                <div className='flex h-screen w-screen items-center justify-center'>
                    <Spinner size='lg' />
                </div>
            }
        >
            <Routes>
                <Route path='/' element={<Landing />} />

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
                    <Route path='cart' element={<Cart />} />

                    <Route element={<AuthRouteGuard mode='authenticated' />}>
                        <Route path='payment' element={<Payment />} />
                        <Route path='orders' element={<Orders />} />
                        <Route path='orders/:id' element={<OrderDetail />} />
                        <Route path='settings' element={<Settings />}>
                            <Route index element={<Navigate replace to='profile' />} />
                            <Route path='profile' element={<SettingsProfile />} />
                            <Route path='appearance' element={<SettingsAppearance />} />
                            <Route path='payment' element={<SettingsPayment />} />
                        </Route>
                    </Route>
                </Route>

                <Route element={<AdminRouteGuard />}>
                    <Route element={<AdminLayout />}>
                        <Route path='admin' element={<Navigate replace to='dashboard' />} />
                        <Route path='admin/dashboard' element={<AdminDashboard />} />
                        <Route path='admin/orders' element={<AdminOrders />} />
                        <Route path='admin/orders/:id' element={<AdminOrderDetail />} />
                        <Route path='admin/refunds' element={<AdminRefunds />} />
                        <Route path='admin/refunds/:id' element={<AdminRefundDetail />} />
                        <Route path='admin/categories' element={<AdminCategories />} />
                        <Route path='admin/categories/new' element={<AdminCategoryDetail />} />
                        <Route path='admin/categories/:id' element={<AdminCategoryDetail />} />
                        <Route path='admin/foods' element={<AdminFoods />} />
                        <Route path='admin/foods/new' element={<AdminFoodDetail />} />
                        <Route path='admin/foods/:id' element={<AdminFoodDetail />} />
                        <Route path='admin/users' element={<AdminUsers />} />
                        <Route path='admin/users/:id' element={<AdminUserDetail />} />
                    </Route>
                </Route>

                {/* 404 - Not Found */}
                <Route path='*' element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}

export default AppRoutes;
