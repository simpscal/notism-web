import { Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { lazyWithPreload, PreloadableComponent } from '@/app/routing/lazy-with-preload';
import Spinner from '@/components/spinner';
import { AdminRouteGuard, AuthRouteGuard, ResetPasswordRouteGuard } from '@/core/guards';
import { useIdlePreload } from '@/core/hooks';
import { AdminLayout } from '@/layouts/admin';
import { AuthLayout } from '@/layouts/auth';
import { ClientLayout } from '@/layouts/client';
import { OAuthCallbackRouteGuard } from '@/pages/oauth-callback/guards';

// Client pages
const Landing = lazyWithPreload(() => import('@/pages/landing').then(m => ({ default: m.Landing })));
const Login = lazyWithPreload(() => import('@/pages/login').then(m => ({ default: m.Login })));
const Signup = lazyWithPreload(() => import('@/pages/signup').then(m => ({ default: m.Signup })));
const RequestResetPassword = lazyWithPreload(() =>
    import('@/pages/request-reset-password').then(m => ({ default: m.RequestResetPassword }))
);
const ResetPassword = lazyWithPreload(() => import('@/pages/reset-password').then(m => ({ default: m.ResetPassword })));
const OAuthCallback = lazyWithPreload(() => import('@/pages/oauth-callback'));
const Foods = lazyWithPreload(() => import('@/pages/foods').then(m => ({ default: m.Foods })));
const FoodDetail = lazyWithPreload(() => import('@/pages/food-detail').then(m => ({ default: m.FoodDetail })));
const Cart = lazyWithPreload(() => import('@/pages/cart').then(m => ({ default: m.Cart })));
const Payment = lazyWithPreload(() => import('@/pages/payment').then(m => ({ default: m.Payment })));
const Orders = lazyWithPreload(() => import('@/pages/orders').then(m => ({ default: m.Orders })));
const OrderDetail = lazyWithPreload(() => import('@/pages/order-detail').then(m => ({ default: m.OrderDetail })));
const Settings = lazyWithPreload(() => import('@/pages/settings').then(m => ({ default: m.Settings })));
const SettingsProfile = lazyWithPreload(() => import('@/pages/settings/settings-profile'));
const SettingsAppearance = lazyWithPreload(() => import('@/pages/settings/settings-appearance'));
const SettingsPayment = lazyWithPreload(() => import('@/pages/settings/settings-payment'));

// Admin pages
const AdminDashboard = lazyWithPreload(() => import('@/pages/admin/dashboard/dashboard'));
const AdminOrders = lazyWithPreload(() => import('@/pages/admin/orders/orders'));
const AdminOrderDetail = lazyWithPreload(() => import('@/pages/admin/order-detail/order-detail'));
const AdminRefunds = lazyWithPreload(() => import('@/pages/admin/refunds/refunds'));
const AdminRefundDetail = lazyWithPreload(() => import('@/pages/admin/refund-detail'));
const AdminCategories = lazyWithPreload(() =>
    import('@/pages/admin/categories').then(m => ({ default: m.AdminCategories }))
);
const AdminCategoryDetail = lazyWithPreload(() =>
    import('@/pages/admin/category-detail').then(m => ({ default: m.AdminCategoryDetail }))
);
const AdminFoods = lazyWithPreload(() => import('@/pages/admin/foods/foods'));
const AdminFoodDetail = lazyWithPreload(() => import('@/pages/admin/food-detail/food-detail'));
const AdminUsers = lazyWithPreload(() => import('@/pages/admin/users/users'));
const AdminUserDetail = lazyWithPreload(() => import('@/pages/admin/user-detail'));

// Shared
const NotFoundPage = lazyWithPreload(() => import('@/pages/not-found'));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPreloadableComponent = PreloadableComponent<any>;

/** `ROUTES` values are stored without a leading slash (except HOME, which is `/`) — this
 *  normalizes an entry to the exact string a `<NavLink to>`/`location.pathname` uses. */
function toPath(route: string): string {
    return route === ROUTES.HOME ? ROUTES.HOME : `/${route}`;
}

/** Maps each route in a true URL-nested route group (`auth/*`, `settings/*` — the only groups
 * with actual nested `<Route>` children below) to its sibling routes in that same group.
 * Consumed by `useIdlePreload` to warm sibling chunks during browser idle time, since a visitor
 * on one nested route is likely to navigate to a sibling next (e.g. settings tabs, auth form
 * switches). Flat top-level routes are not true nested children of one another and get no entry.
 *
 * `auth/oauth/:provider/callback` is a 5th nested child under `auth`, but its dynamic path
 * segment means it can't be a `location.pathname`-keyed trigger the same way. It's also reached
 * only via redirect from an external OAuth provider, never navigated to directly by the user, so
 * it's excluded as both a key and a preload target here. */
const ROUTE_PRELOAD_MAP: Record<string, AnyPreloadableComponent[]> = {
    [toPath(ROUTES.AUTH.LOGIN)]: [Signup, RequestResetPassword, ResetPassword],
    [toPath(ROUTES.AUTH.SIGNUP)]: [Login, RequestResetPassword, ResetPassword],
    [toPath(ROUTES.AUTH.REQUEST_RESET_PASSWORD)]: [Login, Signup, ResetPassword],
    [toPath(ROUTES.AUTH.RESET_PASSWORD)]: [Login, Signup, RequestResetPassword],

    [toPath(ROUTES.SETTINGS.PROFILE)]: [SettingsAppearance, SettingsPayment],
    [toPath(ROUTES.SETTINGS.APPEARANCE)]: [SettingsProfile, SettingsPayment],
    [toPath(ROUTES.SETTINGS.PAYMENT)]: [SettingsProfile, SettingsAppearance],
};

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
