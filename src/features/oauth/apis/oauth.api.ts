import { OAuthCallbackRM, OAuthCallbackVM, OAuthProviderType, OAuthRedirectVM } from '../models';

import { apiClient } from '@/core/apis';
import { API_ENDPOINTS } from '@/shared/constants';

export const oauthApi = {
    getOAuthRedirect: (provider: OAuthProviderType) => {
        return apiClient.get<OAuthRedirectVM>(API_ENDPOINTS.AUTH.OAUTH_REDIRECT(provider));
    },

    handleOAuthCallback: (provider: OAuthProviderType, data: OAuthCallbackRM) => {
        return apiClient.post<OAuthCallbackVM>(API_ENDPOINTS.AUTH.OAUTH_CALLBACK(provider), data);
    },
};
