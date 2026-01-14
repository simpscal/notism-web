import { API_ENDPOINTS } from '@/app/constants';
import { apiClient } from '@/core/apis/client.api';
import { UpdateProfileRM, UserProfileViewModel } from '@/features/user/models';

export const userApi = {
    getProfile: async () => {
        return apiClient.get<UserProfileViewModel>(API_ENDPOINTS.USER.PROFILE);
    },

    updateProfile: async (data: UpdateProfileRM) => {
        return apiClient.put<UserProfileViewModel>(API_ENDPOINTS.USER.PROFILE, data);
    },
};
