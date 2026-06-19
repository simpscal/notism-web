import { apiClient } from '../client';

import { USER_ENDPOINTS } from './user.constant';
import { toUserProfile } from './user.mapper';
import { UpdateProfileRequestModel } from './user.request';
import { UserProfileResponseModel } from './user.response';

export const userApi = {
    getProfile: async () => {
        const response = await apiClient.get<UserProfileResponseModel>(USER_ENDPOINTS.PROFILE);
        return toUserProfile(response);
    },

    updateProfile: async (data: UpdateProfileRequestModel) => {
        const response = await apiClient.put<UserProfileResponseModel | null>(USER_ENDPOINTS.PROFILE, data);
        return response ? toUserProfile(response) : null;
    },
};
