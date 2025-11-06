import { UserProfileVM } from '@/features/user/models';
import { AppDispatch } from '@/store';
import { setToken, clearToken } from '@/store/auth/auth.slice';
import { setUser, clearUser } from '@/store/user/user.slice';

/**
 * Authentication Service
 * Handles authentication workflows and business logic
 */

export const authService = {
    /**
     * Handle successful authentication (login/signup)
     * Orchestrates storing token and user profile
     */
    authenticate(dispatch: AppDispatch, token: string, user: UserProfileVM) {
        dispatch(setToken(token));
        dispatch(setUser(user));
    },

    /**
     * Handle user logout
     * Orchestrates clearing all authentication and user data
     */
    logout(dispatch: AppDispatch) {
        dispatch(clearToken());
        dispatch(clearUser());
    },
} as const;
