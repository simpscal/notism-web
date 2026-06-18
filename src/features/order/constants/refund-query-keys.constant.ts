export const REFUND_QUERY_KEYS = {
    adminList: () => ['admin', 'refunds', 'list'] as const,
    adminDetail: (id: string) => ['admin', 'refunds', 'detail', id] as const,
    customerOrderDetail: (id: string) => ['orders', 'detail', id] as const,
    heldRefunds: () => ['orders', 'held-refunds'] as const,
};
