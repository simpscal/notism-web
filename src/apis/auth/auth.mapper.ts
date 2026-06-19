import { toUserProfile } from '../user';

import type { AuthModel } from './auth.model';
import type { AuthResponseModel } from './auth.response';

export function toAuth(response: AuthResponseModel): AuthModel {
    return {
        user: toUserProfile(response.user),
        token: response.token,
        expiresAt: response.expiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
    };
}
