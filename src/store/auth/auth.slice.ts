import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { resetStore } from '../root.actions';

import { TOKEN_KEYS } from '@/app/constants/token-keys.constant';
import { tokenManagerUtils } from '@/app/utils';

function getOauthReturnUrlFromStorage() {
    try {
        return localStorage.getItem(TOKEN_KEYS.OAUTH_RETURN_URL);
    } catch {
        return null;
    }
}

export interface IAuthState {
    isInitialized: boolean;
    oauthReturnUrl: string | null;
}

const INITIAL_STATE: IAuthState = {
    isInitialized: false,
    oauthReturnUrl: getOauthReturnUrlFromStorage(),
};

const authSlice = createSlice({
    name: 'auth',
    initialState: INITIAL_STATE,
    reducers: {
        setToken: (_state, action: PayloadAction<string>) => {
            tokenManagerUtils.setToken(action.payload);
        },

        setInitialized: state => {
            state.isInitialized = true;
        },

        setOauthReturnUrl: (state, action: PayloadAction<string | null>) => {
            state.oauthReturnUrl = action.payload;

            if (action.payload != null) {
                localStorage.setItem(TOKEN_KEYS.OAUTH_RETURN_URL, action.payload);
            } else {
                localStorage.removeItem(TOKEN_KEYS.OAUTH_RETURN_URL);
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(resetStore, state => {
            tokenManagerUtils.clearAll();
            localStorage.removeItem(TOKEN_KEYS.OAUTH_RETURN_URL);
            return { ...INITIAL_STATE, oauthReturnUrl: null, isInitialized: state.isInitialized };
        });
    },
});

export const { setToken, setInitialized, setOauthReturnUrl } = authSlice.actions;

export default authSlice.reducer;
