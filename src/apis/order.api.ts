import { apiClient } from './client';
import { toCreateOrder, toOrders, toOrder } from './mappers';
import {
    CreateOrderRequestModel,
    CreateOrderResponseModel,
    GetOrdersRequestModel,
    GetOrdersResponseModel,
    OrderResponseModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const orderApi = {
    create: async (data: CreateOrderRequestModel) => {
        const response = await apiClient.post<CreateOrderResponseModel>(API_ENDPOINTS.ORDER.BASE, data);
        return toCreateOrder(response);
    },

    getOrders: async (params?: GetOrdersRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
        const queryString = searchParams.toString();
        const response = await apiClient.get<GetOrdersResponseModel>(
            `${API_ENDPOINTS.ORDER.LIST}${queryString ? `?${queryString}` : ''}`
        );
        return toOrders(response);
    },

    getOrderById: async (id: string) => {
        const response = await apiClient.get<OrderResponseModel>(API_ENDPOINTS.ORDER.DETAIL(id));
        return toOrder(response);
    },

    cancel: (id: string) => {
        return apiClient.post<void>(API_ENDPOINTS.ORDER.CANCEL(id));
    },
};
