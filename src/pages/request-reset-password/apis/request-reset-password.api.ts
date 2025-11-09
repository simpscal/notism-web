import { RequestResetPasswordRequest } from '../models/request-reset-password.model';

import { apiClient } from '@/core/apis';
import { API_ENDPOINTS } from '@/shared/constants';

export const requestResetPassword = async (data: RequestResetPasswordRequest) => {
    await apiClient.post(API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET, data);
};
