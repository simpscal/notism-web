import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { tokenManagerUtils } from '@/app/utils';

export interface IAuthState {
    accessToken: string | null;
    isInitialized: boolean;
}

const INITIAL_STATE: IAuthState = {
    accessToken: null,
    isInitialized: false,
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

        setInitialized: state => {
            state.isInitialized = true;
        },
    },
});

export const { setToken, clearToken, setInitialized } = authSlice.actions;

export default authSlice.reducer;
