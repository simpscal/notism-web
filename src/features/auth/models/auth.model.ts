import { UserVM } from './user.model';

export class LoginRM {
    email!: string;
    password!: string;
}

export class LoginVM {
    user!: UserVM;
    token!: string;
    expiresAt!: string;
    refreshToken!: string;
    refreshTokenExpiresAt!: string;
}
