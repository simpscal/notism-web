import { createAsyncThunk } from '@reduxjs/toolkit';

import { clearUser, setUser } from '../user/user.slice';

import { clearToken, setToken } from './auth.slice';

import { UserProfileViewModel } from '@/features/user/models';

export const setAuth = createAsyncThunk<void, { token: string; user: UserProfileViewModel }>(
    'auth/setAuth',
    async ({ token, user }, { dispatch }) => {
        dispatch(setToken(token));
        dispatch(setUser(user));
    }
);

export const unsetAuth = createAsyncThunk<void, void>('auth/unsetAuth', async (_, { dispatch }) => {
    dispatch(clearToken());
    dispatch(clearUser());
});
