import { HubConnection } from '@microsoft/signalr';

import { HUBS } from '@/app/constants/hubs.constant';
import { createHubConnection } from '@/core/signalr';

export const PaymentNotificationType = {
    Success: 'payment-success',
    Failure: 'payment-failure',
} as const;

export type PaymentNotificationType = (typeof PaymentNotificationType)[keyof typeof PaymentNotificationType];

export interface PaymentNotificationPayload {
    type: PaymentNotificationType;
    orderId: string;
    slugId: string;
    message: string;
    timestamp: string;
}

/**
 * Fired on the PaymentHub only when a refund transitions to Paid. Consumed by
 * the global refund-paid banner.
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
