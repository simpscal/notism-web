import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { UserProfileVM } from '@/features/user/models';

export interface IUserState {
    user: UserProfileVM | null;
}

const INITIAL_STATE: IUserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {
        setUser: (state, action: PayloadAction<UserProfileVM>) => {
            state.user = action.payload;
        },

        updateUser: (state, action: PayloadAction<Partial<UserProfileVM>>) => {
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

export const { setUser, updateUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
