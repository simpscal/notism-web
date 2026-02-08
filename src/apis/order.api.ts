import { apiClient } from './client';
import {
    CreateOrderRequestModel,
    CreateOrderResponseModel,
    GetOrdersResponseModel,
    OrderResponseModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const orderApi = {
    create: (data: CreateOrderRequestModel) => {
        return apiClient.post<CreateOrderResponseModel>(API_ENDPOINTS.ORDER.BASE, data);
    },

    getOrders: () => {
        return apiClient.get<GetOrdersResponseModel>(API_ENDPOINTS.ORDER.LIST);
    },

    getOrderById: (id: string) => {
        return apiClient.get<OrderResponseModel>(API_ENDPOINTS.ORDER.DETAIL(id));
    },
};
