import { SignupRM, SignupVM } from '../models';

import { apiClient } from '@/core/apis';

export const signupApi = {
    signup: (credentials: SignupRM) => {
        return apiClient.post<SignupVM>('/auth/register', credentials);
    },
};
