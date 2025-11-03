import { LoginRM, LoginVM } from '../models';

import { apiClient } from '@/core/apis';

export const authApi = {
    login: async (credentials: LoginRM) => {
        const response = await apiClient.post<LoginVM>('/auth/login', credentials);
        return response.data;
    },
};
