import { toUserProfile } from '../user';

import type { OAuthCallbackModel, OAuthRedirectModel } from './oauth.model';
import type { OAuthCallbackResponseModel, OAuthRedirectResponseModel } from './oauth.response';

export function toOAuthRedirect(response: OAuthRedirectResponseModel): OAuthRedirectModel {
    return {
        redirectUrl: response.redirectUrl,
    };
}

export function toOAuthCallback(response: OAuthCallbackResponseModel): OAuthCallbackModel {
    return {
        user: toUserProfile(response.user),
        token: response.token,
        expiresAt: response.expiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    };
}
