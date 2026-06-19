import { UserProfileResponseModel } from '../user';

export interface AuthResponseModel {
    user: UserProfileResponseModel;
    token: string;
    expiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}
