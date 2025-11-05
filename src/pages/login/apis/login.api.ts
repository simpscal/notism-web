import { LoginRM, LoginVM } from '../models';

import { apiClient } from '@/core/apis';

export const loginApi = {
    login: (credentials: LoginRM) => {
        return apiClient.post<LoginVM>('/auth/login', credentials);
    },
};
