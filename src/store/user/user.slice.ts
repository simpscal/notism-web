import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { resetStore } from '../root.actions';

import { UserProfileModel } from '@/apis';

export interface IUserState {
    user: UserProfileModel | null;
}

const INITIAL_STATE: IUserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE,
    reducers: {
        setUser: (state, action: PayloadAction<UserProfileModel>) => {
            state.user = action.payload;
        },

        updateUser: (state, action: PayloadAction<Partial<UserProfileModel>>) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload,
                };
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(resetStore, () => INITIAL_STATE);
    },
});

export const { setUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
