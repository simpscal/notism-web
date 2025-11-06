import { UserProfileVM } from '@/features/user/models';

export class LoginRM {
    email!: string;
    password!: string;
}

export class LoginVM {
    user!: UserProfileVM;
    token!: string;
    expiresAt!: string;
    refreshToken!: string;
    refreshTokenExpiresAt!: string;
}
