import { HubConnectionState } from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';

import { createNotificationHubConnection, type SharedNotification } from '../notification-signalr';

export const PaymentSignalRStatus = {
    Connecting: 'connecting',
    Live: 'live',
    Disconnected: 'disconnected',
} as const;

export type PaymentSignalRStatus = (typeof PaymentSignalRStatus)[keyof typeof PaymentSignalRStatus];

export interface UsePaymentSignalROptions {
    onNotification: (payload: SharedNotification) => void;
    enabled?: boolean;
}

export interface UsePaymentSignalRResult {
    status: PaymentSignalRStatus;
}

function mapConnectionState(state: HubConnectionState): PaymentSignalRStatus {
    switch (state) {
        case HubConnectionState.Connected:
            return PaymentSignalRStatus.Live;
        case HubConnectionState.Connecting:
        case HubConnectionState.Reconnecting:
            return PaymentSignalRStatus.Connecting;
        default:
            return PaymentSignalRStatus.Disconnected;
    }
}

export function useNotifications({
    onNotification,
    enabled = true,
}: UsePaymentSignalROptions): UsePaymentSignalRResult {
    const [status, setStatus] = useState<PaymentSignalRStatus>(PaymentSignalRStatus.Disconnected);

    const onNotificationRef = useRef(onNotification);
    onNotificationRef.current = onNotification;

    useEffect(() => {
        if (!enabled) {
            setStatus(PaymentSignalRStatus.Disconnected);
            return;
        }

        const connection = createNotificationHubConnection();

        connection.on('ReceivePaymentNotification', (payload: SharedNotification) =>
            onNotificationRef.current(payload)
        );

        connection.onreconnecting(() => setStatus(PaymentSignalRStatus.Connecting));
        connection.onreconnected(() => setStatus(PaymentSignalRStatus.Live));
        connection.onclose(() => setStatus(PaymentSignalRStatus.Disconnected));

        setStatus(PaymentSignalRStatus.Connecting);

        connection
            .start()
            .then(() => {
                setStatus(mapConnectionState(connection.state));

                return connection
                    .invoke('SubscribeToPaymentEvents')
                    .catch(err => console.error('[SignalR] SubscribeToPaymentEvents failed:', err));
            })
            .catch(err => {
                setStatus(PaymentSignalRStatus.Disconnected);
                console.error('[SignalR] Connection failed:', err);
            });

        return () => {
            connection.stop().catch(() => {});
        };
    }, [enabled]);

    return { status };
}
