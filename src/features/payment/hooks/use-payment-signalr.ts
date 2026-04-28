import type { HubConnection } from '@microsoft/signalr';
import { useEffect, useRef } from 'react';

import { createPaymentHubConnection, type PaymentNotificationPayload } from '../payment-signalr';

export interface UsePaymentSignalROptions {
    onNotification: (payload: PaymentNotificationPayload) => void;
}

export function usePaymentSignalR({ onNotification }: UsePaymentSignalROptions): void {
    const connectionRef = useRef<HubConnection | null>(null);
    const onNotificationRef = useRef(onNotification);
    onNotificationRef.current = onNotification;

    if (connectionRef.current === null) {
        connectionRef.current = createPaymentHubConnection();
    }

    useEffect(() => {
        const connection = connectionRef.current!;

        const subscribe = () => connection.invoke('SubscribeToPaymentEvents').catch(() => {});

        connection.onreconnected(subscribe);
        connection.on('ReceivePaymentNotification', payload => onNotificationRef.current(payload));

        connection
            .start()
            .then(subscribe)
            .catch(() => {});

        return () => {
            connection.stop().catch(() => {});
        };
    }, []);
}
