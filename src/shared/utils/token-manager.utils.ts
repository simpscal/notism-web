const TOKEN_KEY = 'access-token';

export const tokenManagerUtils = {
    getToken: () => localStorage.getItem(TOKEN_KEY),

    setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),

    removeToken: () => localStorage.removeItem(TOKEN_KEY),

    clearAll: () => {
        localStorage.removeItem(TOKEN_KEY);
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
