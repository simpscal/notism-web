import { PresignedUrlUploadEnum } from '../enums';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: 'auth/login',
        SIGNUP: 'auth/register',
        LOGOUT: 'auth/logout',
        REFRESH: 'auth/refresh',
        RELOAD: 'auth/reload',
        REQUEST_PASSWORD_RESET: 'auth/request-password-reset',
        RESET_PASSWORD: 'auth/reset-password',
        OAUTH_REDIRECT: (provider: string) => `auth/${provider}/redirect`,
        OAUTH_CALLBACK: (provider: string) => `auth/${provider}/callback`,
    },
    USER: {
        PROFILE: 'users/profile',
    },
    STORAGE: {
        PRESIGNED_URL_UPLOAD: (presignedUrlType: PresignedUrlUploadEnum) => `storage/presigned-url/${presignedUrlType}`,
    },
    FOOD: {
        LIST: 'foods',
        DETAIL: (id: string) => `foods/${id}`,
        CATEGORIES: 'foods/categories',
    },
    CART: {
        BASE: 'cart',
        ITEMS: 'cart/items',
        ITEMS_BULK: 'cart/items/bulk',
        ITEM: (itemId: string) => `cart/items/${itemId}`,
        ITEM_CUSTOMISATIONS: (itemId: string) => `cart/items/${itemId}/customisations`,
    },
    ORDER: {
        BASE: 'orders',
        LIST: 'orders',
        DETAIL: (id: string) => `orders/${id}`,
        CANCEL: (id: string) => `orders/${id}/cancel`,
        REFUND: (id: string) => `orders/${id}/refund`,
        HELD_REFUNDS: 'orders/held-refunds',
    },
    PAYMENT: {
        BANK_ACCOUNT: 'payments/bank-account',
        BANKING_CHECKOUT: 'payments/banking/checkout',
    },
    ADMIN: {
        DASHBOARD_ORDER_STATUS_SUMMARY: 'admin/dashboard/order-status-summary',
        DASHBOARD_TODAY_SALES: 'admin/dashboard/today-sales',
        DASHBOARD_REVENUE_SERIES: 'admin/dashboard/revenue-series',
        ORDERS: 'admin/orders',
        ORDERS_TABLE: 'admin/orders/table',
        ORDERS_KANBAN: 'admin/orders/kanban',
        ORDER_DETAIL: (slugId: string) => `admin/orders/${slugId}`,
        ORDER_DELIVERY_STATUS: (id: string) => `admin/orders/${id}/delivery-status`,
        ORDER_PAYMENT_STATUS: (id: string) => `admin/orders/${id}/payment-status`,
        REFUNDS: 'admin/refunds',
        REFUND_DETAIL: (id: string) => `admin/refunds/${id}`,
        REFUND_APPROVE: (id: string) => `admin/refunds/${id}/approve`,
        REFUND_MARK_FAILED: (id: string) => `admin/refunds/${id}/mark-failed`,
        REFUND_RETRY: (id: string) => `admin/refunds/${id}/retry`,
        USERS: 'admin/users',
        USER_DETAIL: (id: string) => `admin/users/${id}`,
        USER_DELETE: (id: string) => `admin/users/${id}`,
        USER_RESET_PASSWORD: (id: string) => `admin/users/${id}/reset-password`,
        FOODS: 'admin/foods',
        FOOD_DETAIL: (id: string) => `admin/foods/${id}`,
        FOOD_DELETE: (id: string) => `admin/foods/${id}`,
        FOOD_UPDATE: (id: string) => `admin/foods/${id}`,
        CATEGORIES: 'admin/categories',
        CATEGORY_DETAIL: (id: string) => `admin/categories/${id}`,
        FOOD_CUSTOMISATION_GROUPS: (foodId: string) => `admin/foods/${foodId}/customisation-groups`,
        FOOD_CUSTOMISATION_GROUP: (foodId: string, groupId: string) =>
            `admin/foods/${foodId}/customisation-groups/${groupId}`,
        FOOD_CUSTOMISATION_OPTIONS: (foodId: string, groupId: string) =>
            `admin/foods/${foodId}/customisation-groups/${groupId}/options`,
        FOOD_CUSTOMISATION_OPTION: (foodId: string, groupId: string, optionId: string) =>
            `admin/foods/${foodId}/customisation-groups/${groupId}/options/${optionId}`,
    },
} as const;
