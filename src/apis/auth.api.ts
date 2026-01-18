import { apiClient } from './client';
import {
    AuthResponseModel,
    LoginRequestModel,
    RequestResetPasswordRequestModel,
    ResetPasswordRequestModel,
    SignupRequestModel,
    UserProfileResponseModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const authApi = {
    login: (credentials: LoginRequestModel) => {
        return apiClient.post<AuthResponseModel>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },

    signup: (data: SignupRequestModel) => {
        return apiClient.post<AuthResponseModel>(API_ENDPOINTS.AUTH.SIGNUP, data);
    },

    logout: () => {
        return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    reload: () => {
        return apiClient.get<UserProfileResponseModel>(API_ENDPOINTS.AUTH.RELOAD);
    },

    requestResetPassword: (data: RequestResetPasswordRequestModel) => {
        return apiClient.post(API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET, data);
    },

    resetPassword: (data: ResetPasswordRequestModel) => {
        return apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    },
};
