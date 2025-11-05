import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthVM } from '@/features/auth/models';
import { tokenManagerUtils } from '@/shared/utils';

export interface IAuthState {
    auth: AuthVM | null;
}

const INITIAL_STATE: IAuthState = {
    auth: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        authSuccess: (
            state,
            action: PayloadAction<{
                user: AuthVM;
                accessToken: string;
            }>
        ) => {
            state.auth = action.payload.user;
            tokenManagerUtils.setToken(action.payload.accessToken);
        },

        setAuth: (state, action: PayloadAction<AuthVM>) => {
            state.auth = action.payload;
        },

        updateAuth: (state, action: PayloadAction<Partial<AuthVM>>) => {
            if (state.auth) {
                state.auth = {
                    ...state.auth,
                    ...action.payload,
                };
            }
        },

        clearAuth: state => {
            state.auth = null;
            tokenManagerUtils.clearAll();
        },
    },
});

export const { authSuccess, setAuth: setUser, updateAuth: updateUser, clearAuth: clearUser } = authSlice.actions;

export default authSlice.reducer;
