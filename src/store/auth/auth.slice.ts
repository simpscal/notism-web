import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { tokenManagerUtils } from '@/app/utils';
import { UserProfileViewModel } from '@/features/user/models';
import { AppDispatch } from '@/store';
import { setUser, clearUser } from '@/store/user/user.slice';

export interface IAuthState {
    accessToken: string | null;
}

const INITIAL_STATE: IAuthState = {
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
            tokenManagerUtils.setToken(action.payload);
        },

        clearToken: state => {
            state.accessToken = null;
            tokenManagerUtils.clearAll();
        },
    },
});

export const { setToken, clearToken } = authSlice.actions;

export const setAuth = (token: string, user: UserProfileViewModel) => {
    return (dispatch: AppDispatch) => {
        dispatch(setToken(token));
        dispatch(setUser(user));
    };
};

export const unsetAuth = () => {
    return (dispatch: AppDispatch) => {
        dispatch(clearToken());
        dispatch(clearUser());
    };
};

export default authSlice.reducer;
