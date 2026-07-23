import { createAsyncThunk } from '@reduxjs/toolkit';

import { setUser } from '../user/user.slice';

import { setToken } from './auth.slice';

import { UserProfileModel } from '@/apis';

export const setAuth = createAsyncThunk<void, { token: string; user: UserProfileModel }>(
    'auth/setAuth',
    async ({ token, user }, { dispatch }) => {
        dispatch(setToken(token));
        dispatch(setUser(user));
    }
);
