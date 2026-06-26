import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { useEffect, useRef, useState } from 'react';

import { HUBS } from '@/app/constants/hubs.constant';
import { type SharedNotification } from '@/app/models';
import { tokenManagerUtils } from '@/app/utils';

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

        const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
        const origin = baseUrl.replace(/\/api$/, '');
        const url = `${origin}${HUBS.NOTIFICATION}`;

        const connection = new HubConnectionBuilder()
            .withUrl(url, {
                accessTokenFactory: () => tokenManagerUtils.getToken() ?? '',
            })
            .withAutomaticReconnect()
            .build();

        connection.on('ReceiveNotification', (payload: SharedNotification) => onNotificationRef.current(payload));

        connection.onreconnecting(() => setStatus(NotificationStatus.Connecting));
        connection.onreconnected(() => setStatus(NotificationStatus.Live));
        connection.onclose(() => setStatus(NotificationStatus.Disconnected));

        setStatus(NotificationStatus.Connecting);

        connection
            .start()
            .then(() => {
                setStatus(mapConnectionState(connection.state));

                return connection
                    .invoke('SubscribeToNotifications')
                    .catch(err => console.error('[SignalR] SubscribeToNotifications failed:', err));
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
