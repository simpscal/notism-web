import { SignupRM, SignupVM } from '../models';

import { apiClient } from '@/core/apis';
import { API_ENDPOINTS } from '@/shared/constants';

export const signupApi = {
    signup: (credentials: SignupRM) => {
        return apiClient.post<SignupVM>(API_ENDPOINTS.AUTH.SIGNUP, credentials);
    },
};
