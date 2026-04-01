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
    },
    ORDER: {
        BASE: 'orders',
        LIST: 'orders',
        DETAIL: (id: string) => `orders/${id}`,
        CANCEL: (id: string) => `orders/${id}/cancel`,
    },
    ADMIN: {
        ORDERS: 'admin/orders',
        ORDERS_TABLE: 'admin/orders/table',
        ORDERS_KANBAN: 'admin/orders/kanban',
        ORDER_DETAIL: (slugId: string) => `admin/orders/${slugId}`,
        ORDER_DELIVERY_STATUS: (id: string) => `admin/orders/${id}/delivery-status`,
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
    },
} as const;
