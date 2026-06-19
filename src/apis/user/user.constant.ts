export const USER_ENDPOINTS = {
    PROFILE: 'users/profile',
    BANK_ACCOUNT: 'users/bank-account',
} as const;

export const USER_QUERY_KEYS = {
    reload: () => ['user', 'reload'] as const,
    bankAccount: () => ['bank-account'] as const,
};
