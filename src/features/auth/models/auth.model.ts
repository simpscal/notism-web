export class LoginRM {
    email!: string;
    password!: string;
}

export class LoginVM {
    userId!: string;
    email!: string;
    token!: string;
    expiresAt!: string;
    refreshToken!: string;
    refreshTokenExpiresAt!: string;
}
