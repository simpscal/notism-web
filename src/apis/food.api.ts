import { apiClient } from './client';
import { CategoryResponseModel, GetFoodByIdResponseModel, GetFoodsRequestModel, GetFoodsResponseModel } from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const foodApi = {
    getFoods: (params?: GetFoodsRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.category) searchParams.append('category', params.category);
        if (params?.keyword) searchParams.append('keyword', params.keyword);
        if (params?.isAvailable !== undefined) searchParams.append('isAvailable', params.isAvailable.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        const queryString = searchParams.toString();
        return apiClient.get<GetFoodsResponseModel>(
            `${API_ENDPOINTS.FOOD.LIST}${queryString ? `?${queryString}` : ''}`
        );
    },

    getFoodById: (id: string) => {
        return apiClient.get<GetFoodByIdResponseModel>(API_ENDPOINTS.FOOD.DETAIL(id));
    },

    getCategories: (): Promise<CategoryResponseModel[]> =>
        apiClient.get(API_ENDPOINTS.FOOD.CATEGORIES).then(res => res.items),
};
