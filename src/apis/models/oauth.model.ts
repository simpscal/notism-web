import { UserProfileResponseModel } from './user.model';

export type OAuthProviderType = 'google' | 'github';

export interface OAuthRedirectResponseModel {
    redirectUrl: string;
}

export interface OAuthCallbackResponseModel {
    user: UserProfileResponseModel;
    token: string;
    expiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}

export interface OAuthCallbackRequestModel {
    code: string;
    state?: string;
}
