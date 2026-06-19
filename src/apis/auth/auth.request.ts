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
