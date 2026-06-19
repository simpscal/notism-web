import { createAsyncThunk } from '@reduxjs/toolkit';

import { CategoryModel, foodApi } from '@/apis';

export const loadCategories = createAsyncThunk<CategoryModel[]>('food/loadCategories', async () => {
    const categories = await foodApi.getCategories();
    return categories;
});
