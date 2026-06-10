import { Navigate, Route, Routes } from 'react-router-dom';

import { AdminRouteGuard, AuthRouteGuard, ResetPasswordRouteGuard } from '@/core/guards';
import { AdminLayout } from '@/layouts/admin';
import { AuthLayout } from '@/layouts/auth';
import { ClientLayout } from '@/layouts/client';
import { AdminCategories } from '@/pages/admin/categories';
import { AdminCategoryDetail } from '@/pages/admin/category-detail';
import AdminDashboard from '@/pages/admin/dashboard/dashboard';
import AdminFoodDetail from '@/pages/admin/food-detail/food-detail';
import AdminFoods from '@/pages/admin/foods/foods';
import AdminOrderDetail from '@/pages/admin/order-detail/order-detail';
import AdminOrders from '@/pages/admin/orders/orders';
import AdminUserDetail from '@/pages/admin/user-detail';
import AdminUsers from '@/pages/admin/users/users';
import { Cart } from '@/pages/cart';
import { FoodDetail } from '@/pages/food-detail';
import { Foods } from '@/pages/foods';
import { Landing } from '@/pages/landing';
import { Login } from '@/pages/login';
import NotFoundPage from '@/pages/not-found';
import OAuthCallback from '@/pages/oauth-callback';
import { OAuthCallbackRouteGuard } from '@/pages/oauth-callback/guards';
import { OrderDetail } from '@/pages/order-detail';
import { Orders } from '@/pages/orders';
import { Payment } from '@/pages/payment';
import { RequestResetPassword } from '@/pages/request-reset-password';
import { ResetPassword } from '@/pages/reset-password';
import { Settings } from '@/pages/settings';
import SettingsAppearance from '@/pages/settings/settings-appearance';
import SettingsPayment from '@/pages/settings/settings-payment';
import SettingsProfile from '@/pages/settings/settings-profile';
import { Signup } from '@/pages/signup';

function AppRoutes() {
    return (
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
                        <Route element={<AdminRouteGuard />}>
                            <Route path='payment' element={<SettingsPayment />} />
                        </Route>
                    </Route>
                </Route>
            </Route>

            <Route element={<AdminRouteGuard />}>
                <Route element={<AdminLayout />}>
                    <Route path='admin/dashboard' element={<AdminDashboard />} />
                    <Route path='admin/orders' element={<AdminOrders />} />
                    <Route path='admin/orders/:id' element={<AdminOrderDetail />} />
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
    );
}

export default AppRoutes;
