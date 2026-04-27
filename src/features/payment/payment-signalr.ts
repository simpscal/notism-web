import { HubConnection } from '@microsoft/signalr';

import { createHubConnection } from '@/core/signalr';

export interface PaymentNotificationPayload {
    type: string;
    orderId: string;
    message: string;
    timestamp: string;
}

export function createPaymentHubConnection(): HubConnection {
    return createHubConnection('/hubs/payment');
}

export function subscribeToPaymentEvents(
    connection: HubConnection,
    onSuccess: (payload: PaymentNotificationPayload) => void
): void {
    connection.on('ReceivePaymentNotification', (payload: PaymentNotificationPayload) => {
        if (payload.type === 'payment-success') {
            onSuccess(payload);
        }
    });
}
