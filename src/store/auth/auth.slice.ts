import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { tokenManagerUtils } from '@/shared/utils';

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

export default authSlice.reducer;
