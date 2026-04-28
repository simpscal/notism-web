import { useEffect } from 'react';

import { createPaymentHubConnection, type PaymentNotificationPayload } from '../payment-signalr';

export interface UsePaymentSignalROptions {
    onNotification: (payload: PaymentNotificationPayload) => void;
}

export function usePaymentSignalR({ onNotification }: UsePaymentSignalROptions): void {
    useEffect(() => {
        const connection = createPaymentHubConnection();

        connection.on('ReceivePaymentNotification', onNotification);

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
    }, [onNotification]);
}
