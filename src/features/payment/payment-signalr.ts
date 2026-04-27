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
    message: string;
    timestamp: string;
}

export function createPaymentHubConnection(): HubConnection {
    return createHubConnection(HUBS.PAYMENT);
}
