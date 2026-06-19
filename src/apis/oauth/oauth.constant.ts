export const OAUTH_ENDPOINTS = {
    OAUTH_REDIRECT: (provider: string) => `auth/${provider}/redirect`,
    OAUTH_CALLBACK: (provider: string) => `auth/${provider}/callback`,
} as const;

export const OAUTH_QUERY_KEYS = {};
