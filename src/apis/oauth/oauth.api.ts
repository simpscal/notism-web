import { apiClient } from '../client';

import { OAUTH_ENDPOINTS } from './oauth.constant';
import { toOAuthCallback, toOAuthRedirect } from './oauth.mapper';
import { OAuthCallbackRequestModel, OAuthProviderType } from './oauth.request';
import { OAuthCallbackResponseModel, OAuthRedirectResponseModel } from './oauth.response';

export const oauthApi = {
    getOAuthRedirect: async (provider: OAuthProviderType) => {
        const response = await apiClient.get<OAuthRedirectResponseModel>(OAUTH_ENDPOINTS.OAUTH_REDIRECT(provider));
        return toOAuthRedirect(response);
    },

    handleOAuthCallback: async (provider: OAuthProviderType, data: OAuthCallbackRequestModel) => {
        const response = await apiClient.post<OAuthCallbackResponseModel>(
            OAUTH_ENDPOINTS.OAUTH_CALLBACK(provider),
            data
        );
        return toOAuthCallback(response);
    },
};
