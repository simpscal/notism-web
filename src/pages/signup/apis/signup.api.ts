import { SignupRM, SignupVM } from '../models';

import { API_ENDPOINTS } from '@/app/constants';
import { apiClient } from '@/core/apis';

export const signupApi = {
    signup: (credentials: SignupRM) => {
        return apiClient.post<SignupVM>(API_ENDPOINTS.AUTH.SIGNUP, credentials);
    },
};
