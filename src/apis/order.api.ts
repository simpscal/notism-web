import { apiClient } from './client';
import {
    CreateOrderRequestModel,
    CreateOrderResponseModel,
    GetOrdersRequestModel,
    GetOrdersResponseModel,
    OrderResponseModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const orderApi = {
    create: (data: CreateOrderRequestModel) => {
        return apiClient.post<CreateOrderResponseModel>(API_ENDPOINTS.ORDER.BASE, data);
    },

    getOrders: (params?: GetOrdersRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
        const queryString = searchParams.toString();
        return apiClient.get<GetOrdersResponseModel>(
            `${API_ENDPOINTS.ORDER.LIST}${queryString ? `?${queryString}` : ''}`
        );
    },

    getOrderById: (id: string) => {
        return apiClient.get<OrderResponseModel>(API_ENDPOINTS.ORDER.DETAIL(id));
    },

    cancel: (id: string) => {
        return apiClient.post<void>(API_ENDPOINTS.ORDER.CANCEL(id));
    },
};
