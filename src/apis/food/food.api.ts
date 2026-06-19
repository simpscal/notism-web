import { apiClient } from '../client';

import { FOOD_ENDPOINTS } from './food.constant';
import { toCategory, toFood, toFoods } from './food.mapper';
import { GetFoodsRequestModel } from './food.request';
import { CategoryResponseModel, GetFoodByIdResponseModel, GetFoodsResponseModel } from './food.response';

export const foodApi = {
    getFoods: async (params?: GetFoodsRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.category) searchParams.append('category', params.category);
        if (params?.keyword) searchParams.append('keyword', params.keyword);
        if (params?.isAvailable !== undefined) searchParams.append('isAvailable', params.isAvailable.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        const queryString = searchParams.toString();
        const response = await apiClient.get<GetFoodsResponseModel>(
            `${FOOD_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`
        );
        return toFoods(response);
    },

    getFoodById: async (id: string) => {
        const response = await apiClient.get<GetFoodByIdResponseModel>(FOOD_ENDPOINTS.DETAIL(id));
        return toFood(response);
    },

    getCategories: () =>
        apiClient
            .get<{ items: CategoryResponseModel[] }>(FOOD_ENDPOINTS.CATEGORIES)
            .then(res => res.items.map(toCategory)),
};
