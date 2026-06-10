import { UserProfileViewModel } from '@/features/user/models';

export interface AuthViewModel {
    user: UserProfileViewModel;
    token: string;
    expiresAt: string;
    refreshToken: string;
    refreshTokenExpiresAt: string;
}
