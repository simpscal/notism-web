import { UserProfileVM } from '@/features/user/models';

export class SignupRM {
    email!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
}

export class SignupVM {
    user!: UserProfileVM;
    token!: string;
    expiresAt!: string;
    refreshToken!: string;
    refreshTokenExpiresAt!: string;
}
