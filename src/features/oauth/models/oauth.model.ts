import { LoginVM } from '@/pages/login/models/login.model';

export type OAuthProviderType = 'google' | 'github';

export class OAuthRedirectVM {
    redirectUrl!: string;
}

export class OAuthCallbackRM {
    code!: string;
    state?: string;
}

export class OAuthCallbackVM extends LoginVM {}
