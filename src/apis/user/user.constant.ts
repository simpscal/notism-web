export const USER_ENDPOINTS = {
    PROFILE: 'users/profile',
} as const;

export const USER_QUERY_KEYS = {
    reload: () => ['user', 'reload'] as const,
};
