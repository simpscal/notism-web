import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { resetStore } from '../root.actions';

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

        setInitialized: state => {
            state.isInitialized = true;
        },
    },
    extraReducers: builder => {
        builder.addCase(resetStore, state => {
            tokenManagerUtils.clearAll();
            return { ...INITIAL_STATE, isInitialized: state.isInitialized };
        });
    },
});

export const { setToken, setInitialized } = authSlice.actions;

export default authSlice.reducer;
