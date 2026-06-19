import { apiClient } from '../client';

import { ORDER_ENDPOINTS } from './order.constant';
import { toCreateOrder, toHeldRefund, toOrder, toOrders, toRefundSummary } from './order.mapper';
import { CreateOrderRequestModel, GetOrdersRequestModel } from './order.request';
import {
    CreateOrderResponseModel,
    GetOrdersResponseModel,
    HeldRefundResponseModel,
    OrderResponseModel,
    RefundSummaryResponseModel,
} from './order.response';

export const orderApi = {
    create: async (data: CreateOrderRequestModel) => {
        const response = await apiClient.post<CreateOrderResponseModel>(ORDER_ENDPOINTS.BASE, data);
        return toCreateOrder(response);
    },

    getOrders: async (params?: GetOrdersRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
        const queryString = searchParams.toString();
        const response = await apiClient.get<GetOrdersResponseModel>(
            `${ORDER_ENDPOINTS.LIST}${queryString ? `?${queryString}` : ''}`
        );
        return toOrders(response);
    },

    getOrderById: async (id: string) => {
        const response = await apiClient.get<OrderResponseModel>(ORDER_ENDPOINTS.DETAIL(id));
        return toOrder(response);
    },

    cancel: (id: string) => {
        return apiClient.post<void>(ORDER_ENDPOINTS.CANCEL(id));
    },

    requestRefund: async (id: string) => {
        const response = await apiClient.post<RefundSummaryResponseModel>(ORDER_ENDPOINTS.REFUND(id));
        return toRefundSummary(response);
    },

    getHeldRefunds: async () => {
        const response = await apiClient.get<HeldRefundResponseModel[]>(ORDER_ENDPOINTS.HELD_REFUNDS);
        return response.map(toHeldRefund);
    },
};
