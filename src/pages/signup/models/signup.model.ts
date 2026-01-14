import { UserProfileViewModel } from '@/features/user/models';

export class SignupRM {
    email!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
}

export class SignupVM {
    user!: UserProfileViewModel;
    token!: string;
    expiresAt!: string;
    refreshToken!: string;
    refreshTokenExpiresAt!: string;
}
