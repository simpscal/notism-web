import { ResetPasswordRequest } from '../models/reset-password.model';

import { apiClient } from '@/core/apis';
import { API_ENDPOINTS } from '@/shared/constants';

export const resetPassword = async (data: ResetPasswordRequest) => {
    await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
};
