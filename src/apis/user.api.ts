import { apiClient } from './client';
import { UpdateProfileRequestModel, UserProfileResponseModel } from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const userApi = {
    getProfile: () => {
        return apiClient.get<UserProfileResponseModel>(API_ENDPOINTS.USER.PROFILE);
    },

    updateProfile: (data: UpdateProfileRequestModel) => {
        return apiClient.put<UserProfileResponseModel>(API_ENDPOINTS.USER.PROFILE, data);
    },
};
