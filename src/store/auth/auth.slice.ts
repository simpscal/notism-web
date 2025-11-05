import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserVM } from '@/features/auth/models';
import { tokenManagerUtils } from '@/shared/utils';

export interface IAuthState {
    user: UserVM | null;
}

const INITIAL_STATE: IAuthState = {
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        authSuccess: (
            state,
            action: PayloadAction<{
                user: UserVM;
                accessToken: string;
            }>
        ) => {
            state.user = action.payload.user;
            tokenManagerUtils.setToken(action.payload.accessToken);
        },

        setUser: (state, action: PayloadAction<UserVM>) => {
            state.user = action.payload;
        },

        updateUser: (state, action: PayloadAction<Partial<UserVM>>) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload,
                };
            }
        },

        clearUser: state => {
            state.user = null;
        },
    },
});

export const { authSuccess, setUser, updateUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
