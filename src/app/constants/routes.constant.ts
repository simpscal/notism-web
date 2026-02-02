export const ROUTES = {
    HOME: '/',
    AUTH: {
        LOGIN: 'auth/login',
        SIGNUP: 'auth/signup',
        REQUEST_RESET_PASSWORD: 'auth/request-reset-password',
        RESET_PASSWORD: 'auth/reset-password',
        OAUTH_CALLBACK: (provider: string) => `auth/oauth/${provider}/callback`,
    },
    FOODS: {
        LIST: 'foods',
        DETAIL: (id: string) => `foods/${id}`,
    },
    SETTINGS: {
        BASE: 'settings',
        PROFILE: 'settings/profile',
        APPEARANCE: 'settings/appearance',
    },
    CART: 'cart',
    PAYMENT: 'payment',
    DELIVERY_STATUS: 'delivery-status',
} as const;
