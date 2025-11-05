import { apiClient } from '@/core/apis/client.api';
import { API_ENDPOINTS } from '@/shared/constants';

export const authApi = {
    logout: async () => {
        return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },
};
