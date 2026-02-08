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
    },
    CART: {
        BASE: 'cart',
        ITEMS: 'cart/items',
        ITEM: (itemId: string) => `cart/items/${itemId}`,
    },
    ORDER: {
        BASE: 'orders',
        LIST: 'orders',
        DETAIL: (id: string) => `orders/${id}`,
    },
} as const;
