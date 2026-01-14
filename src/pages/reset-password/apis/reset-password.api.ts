import { ResetPasswordRequest } from '../models/reset-password.model';

import { API_ENDPOINTS } from '@/app/constants';
import { apiClient } from '@/core/apis';

export const resetPassword = async (data: ResetPasswordRequest) => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
};
