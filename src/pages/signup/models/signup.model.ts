import { AuthVM } from '@/features/auth/models';

export class SignupRM {
    email!: string;
    password!: string;
    firstName!: string;
    lastName!: string;
}

export class SignupVM {
    user!: AuthVM;
    token!: string;
    expiresAt!: string;
    refreshToken!: string;
    refreshTokenExpiresAt!: string;
}
