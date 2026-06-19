export const ORDER_ENDPOINTS = {
    BASE: 'orders',
    LIST: 'orders',
    DETAIL: (id: string) => `orders/${id}`,
    CANCEL: (id: string) => `orders/${id}/cancel`,
    REFUND: (id: string) => `orders/${id}/refund`,
    HELD_REFUNDS: 'orders/held-refunds',
} as const;

export const ORDER_QUERY_KEYS = {
    list: () => ['orders', 'infinite'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
    heldRefunds: () => ['orders', 'held-refunds'] as const,
};
