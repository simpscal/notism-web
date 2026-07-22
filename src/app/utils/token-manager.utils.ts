import { TOKEN_KEYS } from '@/app/constants';

// SSR has no `window`/`localStorage` — every method below falls back to a no-op
// (writes) or `null` (reads) there instead of throwing.
const hasLocalStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const tokenManagerUtils = {
    getToken: () => (hasLocalStorage() ? localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN) : null),

    setToken: (token: string) => {
        if (hasLocalStorage()) {
            localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
        }
    },

    removeToken: () => {
        if (hasLocalStorage()) {
            localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        }
    },

    clearAll: () => {
        if (!hasLocalStorage()) return;

        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.XSRF_TOKEN);
    },

    getXsrfToken: () => (hasLocalStorage() ? localStorage.getItem(TOKEN_KEYS.XSRF_TOKEN) : null),

    setXsrfToken: (token: string) => {
        if (hasLocalStorage()) {
            localStorage.setItem(TOKEN_KEYS.XSRF_TOKEN, token);
        }
    },

    removeXsrfToken: () => {
        if (hasLocalStorage()) {
            localStorage.removeItem(TOKEN_KEYS.XSRF_TOKEN);
        }
    },

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
