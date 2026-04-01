import { createAsyncThunk } from '@reduxjs/toolkit';

import { foodApi } from '@/apis';
import type { CategoryResponseModel } from '@/apis/models';

export const loadCategories = createAsyncThunk<CategoryResponseModel[]>('food/loadCategories', async () => {
    const categories = await foodApi.getCategories();
    return categories;
});
