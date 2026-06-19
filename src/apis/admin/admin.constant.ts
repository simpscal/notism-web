export const ADMIN_ENDPOINTS = {
    DASHBOARD_ORDER_STATUS_SUMMARY: 'admin/dashboard/order-status-summary',
    DASHBOARD_TODAY_SALES: 'admin/dashboard/today-sales',
    DASHBOARD_REVENUE_SERIES: 'admin/dashboard/revenue-series',
    ORDERS: 'admin/orders',
    ORDERS_TABLE: 'admin/orders/table',
    ORDERS_KANBAN: 'admin/orders/kanban',
    ORDER_DETAIL: (slugId: string) => `admin/orders/${slugId}`,
    ORDER_DELIVERY_STATUS: (id: string) => `admin/orders/${id}/delivery-status`,
    ORDER_PAYMENT_STATUS: (id: string) => `admin/orders/${id}/payment-status`,
    REFUNDS: 'admin/refunds',
    REFUND_DETAIL: (id: string) => `admin/refunds/${id}`,
    REFUND_APPROVE: (id: string) => `admin/refunds/${id}/approve`,
    REFUND_MARK_FAILED: (id: string) => `admin/refunds/${id}/mark-failed`,
    REFUND_RETRY: (id: string) => `admin/refunds/${id}/retry`,
    USERS: 'admin/users',
    USER_DETAIL: (id: string) => `admin/users/${id}`,
    USER_DELETE: (id: string) => `admin/users/${id}`,
    USER_RESET_PASSWORD: (id: string) => `admin/users/${id}/reset-password`,
    FOODS: 'admin/foods',
    FOOD_DETAIL: (id: string) => `admin/foods/${id}`,
    FOOD_DELETE: (id: string) => `admin/foods/${id}`,
    FOOD_UPDATE: (id: string) => `admin/foods/${id}`,
    CATEGORIES: 'admin/categories',
    CATEGORY_DETAIL: (id: string) => `admin/categories/${id}`,
    FOOD_CUSTOMISATION_GROUPS: (foodId: string) => `admin/foods/${foodId}/customisation-groups`,
    FOOD_CUSTOMISATION_GROUP: (foodId: string, groupId: string) =>
        `admin/foods/${foodId}/customisation-groups/${groupId}`,
    FOOD_CUSTOMISATION_OPTIONS: (foodId: string, groupId: string) =>
        `admin/foods/${foodId}/customisation-groups/${groupId}/options`,
    FOOD_CUSTOMISATION_OPTION: (foodId: string, groupId: string, optionId: string) =>
        `admin/foods/${foodId}/customisation-groups/${groupId}/options/${optionId}`,
} as const;

export const ADMIN_QUERY_KEYS = {
    ordersTable: <TFilters>(filters: TFilters) => ['admin', 'orders', 'table', filters] as const,
    orderDetail: (id: string) => ['admin', 'orders', 'detail', id] as const,
    kanbanAll: () => ['admin', 'orders', 'kanban'] as const,
    kanbanColumn: (status: string) => ['admin', 'orders', 'kanban', status] as const,
    kanban: <TFilters>(status: string, filters: TFilters) => ['admin', 'orders', 'kanban', status, filters] as const,
    users: <TFilters>(filters: TFilters) => ['admin', 'users', filters] as const,
    userDetail: (id: string) => ['admin', 'users', 'detail', id] as const,
    foods: <TFilters>(filters: TFilters) => ['admin', 'foods', filters] as const,
    foodDetail: (id: string) => ['admin', 'foods', 'detail', id] as const,
    categories: () => ['admin', 'categories'] as const,
    categoryDetail: (id: string) => ['admin', 'categories', 'detail', id] as const,
    refunds: () => ['admin', 'refunds', 'list'] as const,
    refundDetail: (id: string) => ['admin', 'refunds', 'detail', id] as const,
    dashboardOrderStatusSummary: () => ['admin', 'dashboard', 'order-status-summary'] as const,
    dashboardTodaySales: (startUtc: string, endUtc: string) =>
        ['admin', 'dashboard', 'today-sales', startUtc, endUtc] as const,
    dashboardRevenueSeries: <TBoundaries, TLabels>(granularity: string, boundaries: TBoundaries, labels: TLabels) =>
        ['admin', 'dashboard', 'revenue-series', granularity, boundaries, labels] as const,
};
