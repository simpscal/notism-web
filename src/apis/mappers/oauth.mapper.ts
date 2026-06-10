import type { OAuthCallbackResponseModel, OAuthRedirectResponseModel } from '../models';

import { toUserProfile } from './user.mapper';

import type { OAuthCallbackViewModel, OAuthRedirectViewModel } from '@/features/oauth/models';

export function toOAuthRedirect(response: OAuthRedirectResponseModel): OAuthRedirectViewModel {
    return {
        redirectUrl: response.redirectUrl,
    };
}

export function toOAuthCallback(response: OAuthCallbackResponseModel): OAuthCallbackViewModel {
    return {
        user: toUserProfile(response.user),
        token: response.token,
        expiresAt: response.expiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    };
}
