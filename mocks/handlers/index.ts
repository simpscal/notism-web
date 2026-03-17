import { adminCategoriesHandlers } from './admin-categories.handlers';
import { adminFoodsHandlers } from './admin-foods.handlers';
import { adminOrdersHandlers } from './admin-orders.handlers';
import { adminUsersHandlers } from './admin-users.handlers';
import { foodHandlers } from './food.handlers';

export const handlers = [
    ...foodHandlers,
    ...adminCategoriesHandlers,
    ...adminFoodsHandlers,
    ...adminOrdersHandlers,
    ...adminUsersHandlers,
];
