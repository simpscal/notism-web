import { UserProfileViewModel } from '@/features/user/models';

export interface OAuthRedirectViewModel {
    redirectUrl: string;
}

export interface OAuthCallbackViewModel {
    user: UserProfileViewModel;
    token: string;
    expiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}
