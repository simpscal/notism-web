export const NotificationType = {
    Success: 'payment-success',
    Failure: 'payment-failure',
    RefundStatusChanged: 'refund-status-changed',
    OrderPlaced: 'order-placed',
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
