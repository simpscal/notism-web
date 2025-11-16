export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: 'auth/login',
        SIGNUP: 'auth/register',
        LOGOUT: 'auth/logout',
        REFRESH: 'auth/refresh',
        RELOAD: 'auth/reload',
        REQUEST_PASSWORD_RESET: 'auth/request-password-reset',
        RESET_PASSWORD: 'auth/reset-password',
    },
    USER: {
        PROFILE: (userId: string) => `users/${userId}/profile`,
    },
    STORAGE: {
        PRESIGNED_URL_UPLOAD: 'storage/presigned-url/upload',
    },
} as const;
