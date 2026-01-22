import { apiClient } from './client';
import { GetFoodByIdResponseModel, GetFoodsRequestModel, GetFoodsResponseModel } from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const foodApi = {
    getFoods: (data?: GetFoodsRequestModel) => {
        return apiClient.post<GetFoodsResponseModel>(API_ENDPOINTS.FOOD.LIST, data);
    },

    getFoodById: (id: string) => {
        return apiClient.get<GetFoodByIdResponseModel>(API_ENDPOINTS.FOOD.DETAIL(id));
    },
};
