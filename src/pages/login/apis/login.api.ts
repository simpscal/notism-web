import { LoginRM, LoginVM } from '../models';

import { apiClient } from '@/core/apis';
import { API_ENDPOINTS } from '@/shared/constants';

export const loginApi = {
    login: (credentials: LoginRM) => {
        return apiClient.post<LoginVM>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },
};
