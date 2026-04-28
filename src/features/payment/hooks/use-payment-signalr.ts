import { useEffect, useRef } from 'react';

import { createPaymentHubConnection, type PaymentNotificationPayload } from '../payment-signalr';

export interface UsePaymentSignalROptions {
    onNotification: (payload: PaymentNotificationPayload) => void;
}

export function usePaymentSignalR({ onNotification }: UsePaymentSignalROptions): void {
    const onNotificationRef = useRef(onNotification);
    onNotificationRef.current = onNotification;

    useEffect(() => {
        const connection = createPaymentHubConnection();

        const subscribe = () =>
            connection
                .invoke('SubscribeToPaymentEvents')
                .then(() => console.log('[SignalR] Subscribed to payment events'))
                .catch(err => console.error('[SignalR] SubscribeToPaymentEvents failed:', err));

        connection.onreconnected(subscribe);
        connection.on('ReceivePaymentNotification', payload => onNotificationRef.current(payload));

        connection
            .start()
            .then(() => console.log('[SignalR] Connection established'))
            .then(subscribe)
            .catch(err => console.error('[SignalR] Connection failed:', err));

        return () => {
            connection.stop().catch(() => {});
        };
    }, []);
}
