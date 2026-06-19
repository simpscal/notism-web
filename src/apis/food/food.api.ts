import { apiClient } from '../client';

import { toCategory, toFood, toFoods } from './food.mapper';
import { GetFoodsRequestModel } from './food.request';
import { CategoryResponseModel, GetFoodByIdResponseModel, GetFoodsResponseModel } from './food.response';

import { API_ENDPOINTS } from '@/app/constants';

export const FOOD_QUERY_KEYS = {
    detail: (id: string) => ['foods', 'detail', id] as const,
    infinite: <TFilters>(filters: TFilters) => ['foods', 'infinite', filters] as const,
};

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
            `${API_ENDPOINTS.FOOD.LIST}${queryString ? `?${queryString}` : ''}`
        );
        return toFoods(response);
    },

    getFoodById: async (id: string) => {
        const response = await apiClient.get<GetFoodByIdResponseModel>(API_ENDPOINTS.FOOD.DETAIL(id));
        return toFood(response);
    },

    getCategories: () =>
        apiClient
            .get<{ items: CategoryResponseModel[] }>(API_ENDPOINTS.FOOD.CATEGORIES)
            .then(res => res.items.map(toCategory)),
};
