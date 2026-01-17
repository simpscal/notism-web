import { apiClient } from './client';
import {
    OAuthCallbackRequestModel,
    OAuthCallbackResponseModel,
    OAuthProviderType,
    OAuthRedirectResponseModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const oauthApi = {
    getOAuthRedirect: (provider: OAuthProviderType) => {
        return apiClient.get<OAuthRedirectResponseModel>(API_ENDPOINTS.AUTH.OAUTH_REDIRECT(provider));
    },

    handleOAuthCallback: (provider: OAuthProviderType, data: OAuthCallbackRequestModel) => {
        return apiClient.post<OAuthCallbackResponseModel>(API_ENDPOINTS.AUTH.OAUTH_CALLBACK(provider), data);
    },
};
