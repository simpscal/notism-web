import { apiClient } from './client';
import { toUserProfile } from './mappers';
import { UpdateProfileRequestModel, UserProfileResponseModel } from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const userApi = {
    getProfile: async () => {
        const response = await apiClient.get<UserProfileResponseModel>(API_ENDPOINTS.USER.PROFILE);
        return toUserProfile(response);
    },

    updateProfile: async (data: UpdateProfileRequestModel) => {
        const response = await apiClient.put<UserProfileResponseModel | null>(API_ENDPOINTS.USER.PROFILE, data);
        return response ? toUserProfile(response) : null;
    },
};
