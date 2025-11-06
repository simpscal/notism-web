export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: 'auth/login',
        SIGNUP: 'auth/signup',
        LOGOUT: 'auth/logout',
        REFRESH: 'auth/refresh',
        RELOAD: 'auth/reload',
    },
    USER: {
        PROFILE: (userId: string) => `users/${userId}/profile`,
    },
} as const;
