import { TOKEN_KEYS } from '@/app/constants';

export const tokenManagerUtils = {
    getToken: () => localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN),

    setToken: (token: string) => localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token),

    removeToken: () => localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN),

    clearAll: () => {
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.XSRF_TOKEN);
    },

    getXsrfToken: () => localStorage.getItem(TOKEN_KEYS.XSRF_TOKEN),

    setXsrfToken: (token: string) => localStorage.setItem(TOKEN_KEYS.XSRF_TOKEN, token),

    removeXsrfToken: () => localStorage.removeItem(TOKEN_KEYS.XSRF_TOKEN),

    isTokenExpired: (token: string) => {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    },

    getUserFromToken: (token: string) => {
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: payload.sub || payload.id,
                email: payload.email,
                name: payload.name,
                role: payload.role,
            };
        } catch {
            return null;
        }
    },
};
