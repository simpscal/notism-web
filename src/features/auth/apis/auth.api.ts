import { API_ENDPOINTS } from '@/app/constants';
import { apiClient } from '@/core/apis/client.api';
import { UserProfileViewModel } from '@/features/user/models';

export const authApi = {
    logout: async () => {
        return apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    },

    reload: async () => {
        return apiClient.get<UserProfileViewModel>(API_ENDPOINTS.AUTH.RELOAD);
    },
};
