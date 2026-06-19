export const PAYMENT_ENDPOINTS = {
    BANK_ACCOUNT: 'payments/bank-account',
    BANKING_CHECKOUT: 'payments/banking/checkout',
} as const;

export const PAYMENT_QUERY_KEYS = {
    bankAccount: () => ['bank-account'] as const,
};
