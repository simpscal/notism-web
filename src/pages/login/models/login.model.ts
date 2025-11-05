import { AuthVM } from '@/features/auth/models';

export class LoginRM {
    email!: string;
    password!: string;
}

export class LoginVM {
    user!: AuthVM;
    token!: string;
    expiresAt!: string;
    refreshToken!: string;
    refreshTokenExpiresAt!: string;
}
