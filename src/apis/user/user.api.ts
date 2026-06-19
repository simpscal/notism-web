import { apiClient } from '../client';

import { USER_ENDPOINTS } from './user.constant';
import { toBankAccount, toUserProfile } from './user.mapper';
import { SaveBankAccountRequestModel, UpdateProfileRequestModel } from './user.request';
import { BankAccountResponseModel, UserProfileResponseModel } from './user.response';

export const userApi = {
    getProfile: async () => {
        const response = await apiClient.get<UserProfileResponseModel>(USER_ENDPOINTS.PROFILE);
        return toUserProfile(response);
    },

    updateProfile: async (data: UpdateProfileRequestModel) => {
        const response = await apiClient.put<UserProfileResponseModel | null>(USER_ENDPOINTS.PROFILE, data);
        return response ? toUserProfile(response) : null;
    },

    getBankAccount: async () => {
        const response = await apiClient.get<BankAccountResponseModel | null>(USER_ENDPOINTS.BANK_ACCOUNT);
        return toBankAccount(response);
    },

    saveBankAccount: (data: SaveBankAccountRequestModel) => {
        return apiClient.put<void>(USER_ENDPOINTS.BANK_ACCOUNT, data);
    },
};
