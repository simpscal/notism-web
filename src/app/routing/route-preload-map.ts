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
    OrderDetail,
    Orders,
    Payment,
    SettingsProfile,
} from './lazy-pages';
import { PreloadableComponent } from './lazy-with-preload';

import { ROUTES } from '@/app/constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyPreloadableComponent = PreloadableComponent<any>;

/** `ROUTES` values are stored without a leading slash (except HOME, which is `/`) — this
 *  normalizes an entry to the exact string a `<NavLink to>`/`location.pathname` uses. */
function toPath(route: string): string {
    return route === ROUTES.HOME ? ROUTES.HOME : `/${route}`;
}

/** Maps each nav-reachable route to its own lazy page component, so nav-link hover/focus
 * handlers can preload the exact route a user is about to click. */
export const ROUTE_COMPONENT_MAP: Record<string, AnyPreloadableComponent> = {
    [toPath(ROUTES.HOME)]: Landing,
    [toPath(ROUTES.AUTH.LOGIN)]: Login,
    [toPath(ROUTES.FOODS.LIST)]: Foods,
    [toPath(ROUTES.CART)]: Cart,
    [toPath(ROUTES.PAYMENT)]: Payment,
    [toPath(ROUTES.ORDERS.LIST)]: Orders,
    [toPath(ROUTES.SETTINGS.BASE)]: SettingsProfile,
    [toPath(ROUTES.ADMIN.DASHBOARD)]: AdminDashboard,
    [toPath(ROUTES.ADMIN.ORDERS)]: AdminOrders,
    [toPath(ROUTES.ADMIN.REFUNDS)]: AdminRefunds,
    [toPath(ROUTES.ADMIN.FOODS)]: AdminFoods,
    [toPath(ROUTES.ADMIN.CATEGORIES)]: AdminCategories,
    [toPath(ROUTES.ADMIN.USERS)]: AdminUsers,
};

/** Static adjacency map — for each route, the neighbours a visitor is statistically most
 * likely to navigate to next. Consumed by `useIdlePreload` to warm those chunks during
 * browser idle time so the next likely screen is already loaded before the user clicks. */
export const ROUTE_PRELOAD_MAP: Record<string, AnyPreloadableComponent[]> = {
    [toPath(ROUTES.HOME)]: [Login, Foods],
    [toPath(ROUTES.AUTH.LOGIN)]: [Foods],
    [toPath(ROUTES.FOODS.LIST)]: [FoodDetail, Cart],
    [toPath(ROUTES.CART)]: [Payment],
    [toPath(ROUTES.PAYMENT)]: [Orders],
    [toPath(ROUTES.ORDERS.LIST)]: [OrderDetail],
    [toPath(ROUTES.SETTINGS.BASE)]: [SettingsProfile],
    [toPath(ROUTES.ADMIN.DASHBOARD)]: [AdminOrders, AdminRefunds],
    [toPath(ROUTES.ADMIN.ORDERS)]: [AdminOrderDetail],
    [toPath(ROUTES.ADMIN.REFUNDS)]: [AdminRefundDetail],
    [toPath(ROUTES.ADMIN.FOODS)]: [AdminFoodDetail],
    [toPath(ROUTES.ADMIN.CATEGORIES)]: [AdminCategoryDetail],
    [toPath(ROUTES.ADMIN.USERS)]: [AdminUserDetail],
};
