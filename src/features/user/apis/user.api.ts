import { apiClient } from '@/core/apis/client.api';
import { UpdateProfileRM, UserProfileVM } from '@/features/user/models';
import { API_ENDPOINTS } from '@/shared/constants';

export const userApi = {
    getProfile: async () => {
        return apiClient.get<UserProfileVM>(API_ENDPOINTS.USER.PROFILE);
    },

    updateProfile: async (data: UpdateProfileRM) => {
        return apiClient.put<UserProfileVM>(API_ENDPOINTS.USER.PROFILE, data);
    },
};
