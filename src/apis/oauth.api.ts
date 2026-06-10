import { apiClient } from './client';
import { toOAuthCallback, toOAuthRedirect } from './mappers';
import {
    OAuthCallbackRequestModel,
    OAuthCallbackResponseModel,
    OAuthProviderType,
    OAuthRedirectResponseModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

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
