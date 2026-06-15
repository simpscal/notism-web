import { useEffect } from 'react';

import {
    createPaymentHubConnection,
    type PaidRefundNotification,
    type PaymentNotificationPayload,
} from '../payment-signalr';

export interface UsePaymentSignalROptions {
    onNotification: (payload: PaymentNotificationPayload) => void;
    onRefundPaid?: (payload: PaidRefundNotification) => void;
    enabled?: boolean;
}

export function usePaymentSignalR({ onNotification, onRefundPaid, enabled = true }: UsePaymentSignalROptions): void {
    useEffect(() => {
        if (!enabled) return;

        const connection = createPaymentHubConnection();

        connection.on('ReceivePaymentNotification', onNotification);

        if (onRefundPaid) {
            connection.on('ReceiveRefundPaidNotification', onRefundPaid);
        }

        connection
            .start()
            .then(() =>
                connection
                    .invoke('SubscribeToPaymentEvents')
                    .catch(err => console.error('[SignalR] SubscribeToPaymentEvents failed:', err))
            )
            .catch(err => console.error('[SignalR] Connection failed:', err));

        return () => {
            connection.stop().catch(() => {});
        };
    }, [onNotification, onRefundPaid, enabled]);
}
