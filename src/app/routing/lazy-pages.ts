import { lazyWithPreload } from './lazy-with-preload';

// Client pages
export const Landing = lazyWithPreload(() => import('@/pages/landing').then(m => ({ default: m.Landing })));
export const Login = lazyWithPreload(() => import('@/pages/login').then(m => ({ default: m.Login })));
export const Signup = lazyWithPreload(() => import('@/pages/signup').then(m => ({ default: m.Signup })));
export const RequestResetPassword = lazyWithPreload(() =>
    import('@/pages/request-reset-password').then(m => ({ default: m.RequestResetPassword }))
);
export const ResetPassword = lazyWithPreload(() =>
    import('@/pages/reset-password').then(m => ({ default: m.ResetPassword }))
);
export const OAuthCallback = lazyWithPreload(() => import('@/pages/oauth-callback'));
export const Foods = lazyWithPreload(() => import('@/pages/foods').then(m => ({ default: m.Foods })));
export const FoodDetail = lazyWithPreload(() => import('@/pages/food-detail').then(m => ({ default: m.FoodDetail })));
export const Cart = lazyWithPreload(() => import('@/pages/cart').then(m => ({ default: m.Cart })));
export const Payment = lazyWithPreload(() => import('@/pages/payment').then(m => ({ default: m.Payment })));
export const Orders = lazyWithPreload(() => import('@/pages/orders').then(m => ({ default: m.Orders })));
export const OrderDetail = lazyWithPreload(() =>
    import('@/pages/order-detail').then(m => ({ default: m.OrderDetail }))
);
export const Settings = lazyWithPreload(() => import('@/pages/settings').then(m => ({ default: m.Settings })));
export const SettingsProfile = lazyWithPreload(() => import('@/pages/settings/settings-profile'));
export const SettingsAppearance = lazyWithPreload(() => import('@/pages/settings/settings-appearance'));
export const SettingsPayment = lazyWithPreload(() => import('@/pages/settings/settings-payment'));

// Admin pages
export const AdminDashboard = lazyWithPreload(() => import('@/pages/admin/dashboard/dashboard'));
export const AdminOrders = lazyWithPreload(() => import('@/pages/admin/orders/orders'));
export const AdminOrderDetail = lazyWithPreload(() => import('@/pages/admin/order-detail/order-detail'));
export const AdminRefunds = lazyWithPreload(() => import('@/pages/admin/refunds/refunds'));
export const AdminRefundDetail = lazyWithPreload(() => import('@/pages/admin/refund-detail'));
export const AdminCategories = lazyWithPreload(() =>
    import('@/pages/admin/categories').then(m => ({ default: m.AdminCategories }))
);
export const AdminCategoryDetail = lazyWithPreload(() =>
    import('@/pages/admin/category-detail').then(m => ({ default: m.AdminCategoryDetail }))
);
export const AdminFoods = lazyWithPreload(() => import('@/pages/admin/foods/foods'));
export const AdminFoodDetail = lazyWithPreload(() => import('@/pages/admin/food-detail/food-detail'));
export const AdminUsers = lazyWithPreload(() => import('@/pages/admin/users/users'));
export const AdminUserDetail = lazyWithPreload(() => import('@/pages/admin/user-detail'));

// Shared
export const NotFoundPage = lazyWithPreload(() => import('@/pages/not-found'));
