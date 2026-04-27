import type { HubConnection } from '@microsoft/signalr';
import { useEffect, useRef } from 'react';

import {
    createPaymentHubConnection,
    subscribeToPaymentEvents,
    type PaymentNotificationPayload,
} from '../payment-signalr';

export interface UsePaymentSignalROptions {
    onNotification: (payload: PaymentNotificationPayload) => void;
}

export function usePaymentSignalR({ onNotification }: UsePaymentSignalROptions): void {
    const connectionRef = useRef<HubConnection | null>(null);

    if (connectionRef.current === null) {
        connectionRef.current = createPaymentHubConnection();
    }

    useEffect(() => {
        const connection = connectionRef.current!;

        connection.start().catch(() => {
            // Connection errors are non-critical; payment notifications simply won't appear
        });

        connection.invoke('SubscribeToPaymentEvents').catch(() => {});

        subscribeToPaymentEvents(connection, onNotification);

        return () => {
            connection.stop().catch(() => {});
        };
    }, [onNotification]);
}
