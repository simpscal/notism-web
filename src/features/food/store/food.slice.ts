import { createSlice } from '@reduxjs/toolkit';

import { loadCategories } from './food.thunks';

import { CategoryModel } from '@/apis';
import { resetStore } from '@/store/root.actions';

export interface IFoodState {
    categories: CategoryModel[];
}

const INITIAL_STATE: IFoodState = {
    categories: [],
};

const foodSlice = createSlice({
    name: 'food',
    initialState: INITIAL_STATE,
    reducers: {
        setCategories: (state, action: { payload: CategoryModel[] }) => {
            state.categories = action.payload;
        },
        addCategory: (state, action: { payload: CategoryModel }) => {
            const exists = state.categories.some(c => c.id === action.payload.id || c.name === action.payload.name);
            if (!exists) {
                state.categories.push(action.payload);
            }
        },
        updateCategory: (state, action: { payload: CategoryModel }) => {
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
