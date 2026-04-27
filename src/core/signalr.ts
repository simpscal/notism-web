import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';

import { tokenManagerUtils } from '@/app/utils/token-manager.utils';

export function createHubConnection(hubPath: string): HubConnection {
    const baseUrl = import.meta.env.VITE_API_BASE_URL as string;
    const origin = baseUrl.replace(/\/api$/, '');
    const url = `${origin}${hubPath}`;

    return new HubConnectionBuilder()
        .withUrl(url, {
            accessTokenFactory: () => tokenManagerUtils.getToken() ?? '',
        })
        .withAutomaticReconnect()
        .build();
}
