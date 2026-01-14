import { LoginRM, LoginVM } from '../models';

import { API_ENDPOINTS } from '@/app/constants';
import { apiClient } from '@/core/apis';

export const loginApi = {
    login: (credentials: LoginRM) => {
        return apiClient.post<LoginVM>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },
};
