import type { HubConnection } from '@microsoft/signalr';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { createPaymentHubConnection, subscribeToPaymentEvents } from './payment-signalr';

export function usePaymentSignalR(): void {
    const connectionRef = useRef<HubConnection | null>(null);

    if (connectionRef.current === null) {
        connectionRef.current = createPaymentHubConnection();
    }

    useEffect(() => {
        const connection = connectionRef.current!;

        connection
            .start()
            .then(() => {
                return connection.invoke('SubscribeToPaymentEvents');
            })
            .catch(() => {
                // Connection errors are non-critical; toast will simply not appear
            });

        subscribeToPaymentEvents(connection, payload => {
            toast.success(payload.message);
        });

        return () => {
            connection.stop().catch(() => {});
        };
    }, []);
}
