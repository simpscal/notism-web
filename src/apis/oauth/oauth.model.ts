import { UserProfileModel } from '../user';

export interface OAuthRedirectModel {
    redirectUrl: string;
}

export interface OAuthCallbackModel {
    user: UserProfileModel;
    token: string;
    expiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}
