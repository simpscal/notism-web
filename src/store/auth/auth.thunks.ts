import { createAsyncThunk } from '@reduxjs/toolkit';

import { loadCart, syncCartItems } from '../cart/cart.thunks';
import { setUser } from '../user/user.slice';

import { setToken } from './auth.slice';

import { UserProfileViewModel } from '@/features/user/models';

export const setAuth = createAsyncThunk<void, { token: string; user: UserProfileViewModel }>(
    'auth/setAuth',
    async ({ token, user }, { dispatch }) => {
        dispatch(setToken(token));
        dispatch(setUser(user));
        await dispatch(syncCartItems()).unwrap();
        dispatch(loadCart());
    }
);
