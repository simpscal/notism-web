import { apiClient } from '../client';
import { toUserProfile, UserProfileResponseModel } from '../user';

import { AUTH_ENDPOINTS } from './auth.constant';
import { toAuth } from './auth.mapper';
import {
    LoginRequestModel,
    RequestResetPasswordRequestModel,
    ResetPasswordRequestModel,
    SignupRequestModel,
} from './auth.request';
import { AuthResponseModel } from './auth.response';

export const authApi = {
    login: async (credentials: LoginRequestModel) => {
        const response = await apiClient.post<AuthResponseModel>(AUTH_ENDPOINTS.LOGIN, credentials);
        return toAuth(response);
    },

    signup: async (data: SignupRequestModel) => {
        const response = await apiClient.post<AuthResponseModel>(AUTH_ENDPOINTS.SIGNUP, data);
        return toAuth(response);
    },

    logout: () => {
        return apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    },

    refresh: () => {
        return apiClient.refreshToken();
    },

    reload: async () => {
        const response = await apiClient.get<UserProfileResponseModel>(AUTH_ENDPOINTS.RELOAD);
        return toUserProfile(response);
    },

    requestResetPassword: (data: RequestResetPasswordRequestModel) => {
        return apiClient.post(AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET, data);
    },

    resetPassword: (data: ResetPasswordRequestModel) => {
        return apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, data);
    },
};
