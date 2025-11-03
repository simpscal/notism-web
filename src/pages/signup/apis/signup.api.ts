import { SignupRM, SignupVM } from '../models';

import { apiClient } from '@/core/apis';

export const signupApi = {
    signup: async (credentials: SignupRM) => {
        const response = await apiClient.post<SignupVM>('/auth/register', credentials);
        return response.data;
    },
};
