import { apiClient } from '../client';

import { toOAuthCallback, toOAuthRedirect } from './oauth.mapper';
import { OAuthCallbackRequestModel, OAuthProviderType } from './oauth.request';
import { OAuthCallbackResponseModel, OAuthRedirectResponseModel } from './oauth.response';

import { API_ENDPOINTS } from '@/app/constants';

export const OAUTH_QUERY_KEYS = {};

export const oauthApi = {
    getOAuthRedirect: async (provider: OAuthProviderType) => {
        const response = await apiClient.get<OAuthRedirectResponseModel>(API_ENDPOINTS.AUTH.OAUTH_REDIRECT(provider));
        return toOAuthRedirect(response);
    },

    handleOAuthCallback: async (provider: OAuthProviderType, data: OAuthCallbackRequestModel) => {
        const response = await apiClient.post<OAuthCallbackResponseModel>(
            API_ENDPOINTS.AUTH.OAUTH_CALLBACK(provider),
            data
        );
        return toOAuthCallback(response);
    },
};
