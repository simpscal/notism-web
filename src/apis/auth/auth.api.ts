import { apiClient } from '../client';
import { toUserProfile, UserProfileResponseModel } from '../user';

import { toAuth } from './auth.mapper';
import {
    LoginRequestModel,
    RequestResetPasswordRequestModel,
    ResetPasswordRequestModel,
    SignupRequestModel,
} from './auth.request';
import { AuthResponseModel } from './auth.response';

import { API_ENDPOINTS } from '@/app/constants';

export const AUTH_QUERY_KEYS = {};

export const authApi = {
    login: async (credentials: LoginRequestModel) => {
        const response = await apiClient.post<AuthResponseModel>(API_ENDPOINTS.AUTH.LOGIN, credentials);
        return toAuth(response);
    },

    signup: async (data: SignupRequestModel) => {
        const response = await apiClient.post<AuthResponseModel>(API_ENDPOINTS.AUTH.SIGNUP, data);
        return toAuth(response);
    },

    logout: () => {
        return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    reload: async () => {
        const response = await apiClient.get<UserProfileResponseModel>(API_ENDPOINTS.AUTH.RELOAD);
        return toUserProfile(response);
    },

    requestResetPassword: (data: RequestResetPasswordRequestModel) => {
        return apiClient.post(API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET, data);
    },

    resetPassword: (data: ResetPasswordRequestModel) => {
        return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    },
};
