import { createAsyncThunk } from '@reduxjs/toolkit';

import { foodApi } from '@/apis';
import type { CategoryViewModel } from '@/features/food';

export const loadCategories = createAsyncThunk<CategoryViewModel[]>('food/loadCategories', async () => {
    const categories = await foodApi.getCategories();
    return categories;
});
