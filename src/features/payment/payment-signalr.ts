import { HubConnection } from '@microsoft/signalr';

import { HUBS } from '@/app/constants/hubs.constant';
import { createHubConnection } from '@/core/signalr';

export const PaymentNotificationType = {
    Success: 'payment-success',
    Failure: 'payment-failure',
    RefundPaid: 'refund-paid',
} as const;

export type PaymentNotificationType = (typeof PaymentNotificationType)[keyof typeof PaymentNotificationType];

export interface PaymentNotificationPayload {
    type: typeof PaymentNotificationType.Success | typeof PaymentNotificationType.Failure;
    orderId: string;
    slugId: string;
    message: string;
    timestamp: string;
}

/**
 * Raw refund-paid payload as sent by the server on the shared
 * `ReceivePaymentNotification` channel. The `timestamp` field carries the sent
 * date; consumers map it to `PaidRefundNotification.sentDate`.
 */
export interface RefundPaidNotificationPayload {
    type: typeof PaymentNotificationType.RefundPaid;
    refundId: string;
    orderId: string;
    orderRef: string;
    amount: number;
    message: string;
    timestamp: string;
}

/**
 * Discriminated union of every payload the server pushes on the single shared
 * `ReceivePaymentNotification` channel. Narrow by `type` to classify.
 */
export type PaymentSharedNotification = PaymentNotificationPayload | RefundPaidNotificationPayload;

/**
 * Banner-facing shape for a paid refund. Produced by mapping a
 * `RefundPaidNotificationPayload` (timestamp → sentDate). Consumed by the
 * global refund-paid banner.
 */
export interface PaidRefundNotification {
    refundId: string;
    orderId: string;
    orderRef: string;
    amount: number;
    sentDate: string;
}

export function createPaymentHubConnection(): HubConnection {
    return createHubConnection(HUBS.PAYMENT);
}
