import { UserProfileViewModel } from '@/features/user/models';

export class LoginRM {
    email!: string;
    password!: string;
}

export class LoginVM {
    user!: UserProfileViewModel;
    token!: string;
    expiresAt!: string;
    refreshToken!: string;
    refreshTokenExpiresAt!: string;
}
