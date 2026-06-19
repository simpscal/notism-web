import { UserProfileModel } from '../user';

export interface AuthModel {
    user: UserProfileModel;
    token: string;
    expiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}
