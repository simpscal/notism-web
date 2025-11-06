import { apiClient } from '@/core/apis/client.api';
import { UserProfileVM } from '@/features/user/models';
import { API_ENDPOINTS } from '@/shared/constants';

export const authApi = {
    logout: async () => {
        return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    reload: async () => {
        return apiClient.get<UserProfileVM>(API_ENDPOINTS.AUTH.RELOAD);
    },
};
