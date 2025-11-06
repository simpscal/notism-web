import { apiClient } from '@/core/apis/client.api';
import { UserProfileVM } from '@/features/user/models';
import { API_ENDPOINTS } from '@/shared/constants';

export const userApi = {
    getProfile: async (userId: string) => {
        return apiClient.get<UserProfileVM>(API_ENDPOINTS.USER.PROFILE(userId));
    },
};
