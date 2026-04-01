import { createSlice } from '@reduxjs/toolkit';

import { resetStore } from '../root.actions';

import { loadCategories } from './food.thunks';

export interface CategoryViewModel {
    id: string;
    name: string;
}

export interface IFoodState {
    categories: CategoryViewModel[];
}

const INITIAL_STATE: IFoodState = {
    categories: [],
};

const foodSlice = createSlice({
    name: 'food',
    initialState: INITIAL_STATE,
    reducers: {
        setCategories: (state, action: { payload: CategoryViewModel[] }) => {
            state.categories = action.payload;
        },
        addCategory: (state, action: { payload: CategoryViewModel }) => {
            const exists = state.categories.some(c => c.id === action.payload.id || c.name === action.payload.name);
            if (!exists) {
                state.categories.push(action.payload);
            }
        },
        updateCategory: (state, action: { payload: CategoryViewModel }) => {
            const index = state.categories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        removeCategory: (state, action: { payload: string }) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        },
    },
    extraReducers: builder => {
        builder.addCase(loadCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
        });
        builder.addCase(resetStore, () => INITIAL_STATE);
    },
});

export const { setCategories, addCategory, updateCategory, removeCategory } = foodSlice.actions;

export default foodSlice.reducer;
