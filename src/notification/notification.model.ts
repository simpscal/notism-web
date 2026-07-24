import { NotificationType } from './notification.type';

export interface PaymentNotificationPayload {
    type: typeof NotificationType.Success | typeof NotificationType.Failure;
    orderId: string;
    slugId: string;
    message: string;
    timestamp: string;
}

/**
 * Refund status-change payload on the shared `ReceiveNotification` channel.
 * Pushed to the "admins" group on every Paid/Failed transition (carries only
 * `refundId` + `status`), and to the owning customer's group on "paid" (adds
 * `orderId`/`orderRef`/`amount`/`message` so the refund-paid banner can render;
 * `timestamp` carries the sent date). Narrow by `type`, then `status`.
 */
export interface RefundStatusChangedNotificationPayload {
    type: typeof NotificationType.RefundStatusChanged;
    refundId: string;
    status: string;
    timestamp: string;
    orderId?: string;
    orderRef?: string;
    amount?: number;
    message?: string;
}

/**
 * New-order payload on the shared `ReceiveNotification` channel. Pushed
 * to the "admins" group when a customer places an order, so the dashboard
 * live-feed can render it. Narrow by `type`.
 */
export interface NewOrderNotificationPayload {
    type: typeof NotificationType.OrderPlaced;
    orderId: string;
    orderNumber: string;
    placedAt: string;
    total: number;
    itemCount: number;
    timestamp: string;
}

/**
 * Discriminated union of every payload the server pushes on the single shared
 * `ReceiveNotification` channel. Narrow by `type` to classify.
 */
export type SharedNotification =
    | PaymentNotificationPayload
    | RefundStatusChangedNotificationPayload
    | NewOrderNotificationPayload;

/**
 * Banner-facing shape for a paid refund. Produced by mapping a paid
 * `RefundStatusChangedNotificationPayload` (timestamp → sentDate). Consumed by
 * the global refund-paid banner.
 */
export interface PaidRefundNotification {
    refundId: string;
    orderId: string;
    orderRef: string;
    amount: number;
    sentDate: string;
}
