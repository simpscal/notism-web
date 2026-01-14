import { RequestResetPasswordRequest } from '../models/request-reset-password.model';

import { API_ENDPOINTS } from '@/app/constants';
import { apiClient } from '@/core/apis';

export const requestResetPassword = async (data: RequestResetPasswordRequest) => {
    await apiClient.post(API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET, data);
};
