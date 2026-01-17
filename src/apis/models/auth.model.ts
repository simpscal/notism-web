import { UserProfileResponseModel } from './user.model';

export interface AuthResponseModel {
    user: UserProfileResponseModel;
    token: string;
    expiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}

export interface LoginRequestModel {
    email: string;
    password: string;
}

export interface SignupRequestModel {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface RequestResetPasswordRequestModel {
    email: string;
}

export interface ResetPasswordRequestModel {
    token: string;
    newPassword: string;
    confirmPassword: string;
}
