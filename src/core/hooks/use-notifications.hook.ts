import { HubConnectionState } from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';

import { createNotificationHubConnection, type SharedNotification } from '../notification-signalr';

export const NotificationStatus = {
    Connecting: 'connecting',
    Live: 'live',
    Disconnected: 'disconnected',
} as const;

export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];

export interface UsePaymentSignalROptions {
    onNotification: (payload: SharedNotification) => void;
    enabled?: boolean;
}

export interface UsePaymentSignalRResult {
    status: NotificationStatus;
}

function mapConnectionState(state: HubConnectionState): NotificationStatus {
    switch (state) {
        case HubConnectionState.Connected:
            return NotificationStatus.Live;
        case HubConnectionState.Connecting:
        case HubConnectionState.Reconnecting:
            return NotificationStatus.Connecting;
        default:
            return NotificationStatus.Disconnected;
    }
}

export function useNotifications({
    onNotification,
    enabled = true,
}: UsePaymentSignalROptions): UsePaymentSignalRResult {
    const [status, setStatus] = useState<NotificationStatus>(NotificationStatus.Disconnected);

    const onNotificationRef = useRef(onNotification);
    onNotificationRef.current = onNotification;

    useEffect(() => {
        if (!enabled) {
            setStatus(NotificationStatus.Disconnected);
            return;
        }

        const connection = createNotificationHubConnection();

        connection.on('ReceivePaymentNotification', (payload: SharedNotification) =>
            onNotificationRef.current(payload)
        );

        connection.onreconnecting(() => setStatus(NotificationStatus.Connecting));
        connection.onreconnected(() => setStatus(NotificationStatus.Live));
        connection.onclose(() => setStatus(NotificationStatus.Disconnected));

        setStatus(NotificationStatus.Connecting);

        connection
            .start()
            .then(() => {
                setStatus(mapConnectionState(connection.state));

                return connection
                    .invoke('SubscribeToPaymentEvents')
                    .catch(err => console.error('[SignalR] SubscribeToPaymentEvents failed:', err));
            })
            .catch(err => {
                setStatus(NotificationStatus.Disconnected);
                console.error('[SignalR] Connection failed:', err);
            });

        return () => {
            connection.stop().catch(() => {});
        };
    }, [enabled]);

    return { status };
}
