import type { AuthResponseModel } from '../models';

import { toUserProfile } from './user.mapper';

import type { AuthViewModel } from '@/features/auth/models';

export function toAuth(response: AuthResponseModel): AuthViewModel {
    return {
        user: toUserProfile(response.user),
        token: response.token,
        expiresAt: response.expiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    };
}
