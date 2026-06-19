export type OAuthProviderType = 'google' | 'github';

export interface OAuthCallbackRequestModel {
    code: string;
    state?: string;
}
