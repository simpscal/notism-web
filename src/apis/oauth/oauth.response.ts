import { UserProfileResponseModel } from '../user';

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
