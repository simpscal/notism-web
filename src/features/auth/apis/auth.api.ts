import { apiClient } from '@/core/apis/client.api';

export const authApi = {
    logout: async () => {
        return apiClient.post('auth/logout');
    },
};
