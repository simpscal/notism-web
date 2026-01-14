import { OAuthCallbackRM, OAuthCallbackVM, OAuthProviderType, OAuthRedirectVM } from '../models';

import { API_ENDPOINTS } from '@/app/constants';
import { apiClient } from '@/core/apis';

export const oauthApi = {
    getOAuthRedirect: (provider: OAuthProviderType) => {
        return apiClient.get<OAuthRedirectVM>(API_ENDPOINTS.AUTH.OAUTH_REDIRECT(provider));
    },

    handleOAuthCallback: (provider: OAuthProviderType, data: OAuthCallbackRM) => {
        return apiClient.post<OAuthCallbackVM>(API_ENDPOINTS.AUTH.OAUTH_CALLBACK(provider), data);
    },
};
