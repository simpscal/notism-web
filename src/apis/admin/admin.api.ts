import { apiClient } from '../client';

import {
    toAdminCategories,
    toAdminCategory,
    toAdminCustomisationGroup,
    toAdminCustomisationOption,
    toAdminFoodDetail,
    toAdminFoods,
    toAdminOrder,
    toAdminOrderDetail,
    toAdminOrders,
    toAdminOrdersForKanban,
    toAdminRefundDetail,
    toAdminRefunds,
    toAdminUserDetail,
    toAdminUsers,
    toDashboardOrderStatusSummary,
    toDashboardRevenueSeries,
    toDashboardTodaySales,
} from './admin.mapper';
import {
    CreateAdminFoodRequestModel,
    CreateCategoryRequestModel,
    CreateCustomisationGroupRequestModel,
    CreateCustomisationOptionRequestModel,
    GetAdminFoodsRequestModel,
    GetAdminOrdersForKanbanRequestModel,
    GetAdminOrdersRequestModel,
    GetAdminRefundsRequestModel,
    GetAdminUsersRequestModel,
    GetDashboardRevenueSeriesRequestModel,
    GetDashboardTodaySalesRequestModel,
    MarkRefundFailedRequestModel,
    UpdateAdminFoodRequestModel,
    UpdateAdminUserRoleRequestModel,
    UpdateCategoryRequestModel,
    UpdateCustomisationGroupRequestModel,
    UpdateCustomisationOptionRequestModel,
    UpdateOrderDeliveryStatusRequestModel,
    UpdateOrderPaymentStatusRequestModel,
} from './admin.request';
import {
    AdminCategoryResponseModel,
    AdminOrderDetailResponseModel,
    AdminOrderResponseModel,
    AdminRefundDetailResponseModel,
    AdminUserDetailResponseModel,
    CustomisationGroupResponseModel,
    CustomisationOptionResponseModel,
    GetAdminCategoriesResponseModel,
    GetAdminFoodDetailResponseModel,
    GetAdminFoodsResponseModel,
    GetAdminOrdersForKanbanResponseModel,
    GetAdminOrdersResponseModel,
    GetAdminRefundsResponseModel,
    GetAdminUsersResponseModel,
    GetDashboardOrderStatusSummaryResponseModel,
    GetDashboardRevenueSeriesResponseModel,
    GetDashboardTodaySalesResponseModel,
} from './admin.response';

import { API_ENDPOINTS } from '@/app/constants';

export const ADMIN_QUERY_KEYS = {
    ordersTable: <TFilters>(filters: TFilters) => ['admin', 'orders', 'table', filters] as const,
    orderDetail: (id: string) => ['admin', 'orders', 'detail', id] as const,
    ordersKanbanAll: () => ['admin', 'orders', 'kanban'] as const,
    ordersKanbanColumn: (status: string) => ['admin', 'orders', 'kanban', status] as const,
    ordersKanban: <TFilters>(status: string, filters: TFilters) =>
        ['admin', 'orders', 'kanban', status, filters] as const,
    usersList: <TFilters>(filters: TFilters) => ['admin', 'users', filters] as const,
    userDetail: (id: string) => ['admin', 'users', 'detail', id] as const,
    foodsList: <TFilters>(filters: TFilters) => ['admin', 'foods', filters] as const,
    foodDetail: (id: string) => ['admin', 'foods', 'detail', id] as const,
    categoriesList: () => ['admin', 'categories'] as const,
    categoryDetail: (id: string) => ['admin', 'categories', 'detail', id] as const,
    refundsList: () => ['admin', 'refunds', 'list'] as const,
    refundDetail: (id: string) => ['admin', 'refunds', 'detail', id] as const,
    dashboardOrderStatusSummary: () => ['admin', 'dashboard', 'order-status-summary'] as const,
    dashboardTodaySales: (startUtc: string, endUtc: string) =>
        ['admin', 'dashboard', 'today-sales', startUtc, endUtc] as const,
    dashboardRevenueSeries: <TBoundaries, TLabels>(granularity: string, boundaries: TBoundaries, labels: TLabels) =>
        ['admin', 'dashboard', 'revenue-series', granularity, boundaries, labels] as const,
};

export const adminApi = {
    getOrdersForTable: async (params?: GetAdminOrdersRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        if (params?.keyword) searchParams.append('keyword', params.keyword);
        if (params?.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
        const queryString = searchParams.toString();
        const response = await apiClient.get<GetAdminOrdersResponseModel>(
            `${API_ENDPOINTS.ADMIN.ORDERS_TABLE}${queryString ? `?${queryString}` : ''}`
        );
        return toAdminOrders(response);
    },

    getOrdersForKanban: async (params: GetAdminOrdersForKanbanRequestModel) => {
        const searchParams = new URLSearchParams();
        searchParams.append('status', params.status);
        if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params.take !== undefined) searchParams.append('take', params.take.toString());
        if (params.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
        const response = await apiClient.get<GetAdminOrdersForKanbanResponseModel>(
            `${API_ENDPOINTS.ADMIN.ORDERS_KANBAN}?${searchParams.toString()}`
        );
        return toAdminOrdersForKanban(response);
    },

    getDashboardOrderStatusSummary: async () => {
        const response = await apiClient.get<GetDashboardOrderStatusSummaryResponseModel>(
            API_ENDPOINTS.ADMIN.DASHBOARD_ORDER_STATUS_SUMMARY
        );
        return toDashboardOrderStatusSummary(response);
    },

    getDashboardTodaySales: async (params: GetDashboardTodaySalesRequestModel) => {
        const searchParams = new URLSearchParams();
        searchParams.append('startUtc', params.startUtc);
        searchParams.append('endUtc', params.endUtc);
        const response = await apiClient.get<GetDashboardTodaySalesResponseModel>(
            `${API_ENDPOINTS.ADMIN.DASHBOARD_TODAY_SALES}?${searchParams.toString()}`
        );
        return toDashboardTodaySales(response);
    },

    getDashboardRevenueSeries: async (params: GetDashboardRevenueSeriesRequestModel) => {
        const searchParams = new URLSearchParams();
        params.boundaries.forEach(boundary => searchParams.append('boundaries', boundary));
        params.labels.forEach(label => searchParams.append('labels', label));
        searchParams.append('granularity', params.granularity);
        const response = await apiClient.get<GetDashboardRevenueSeriesResponseModel>(
            `${API_ENDPOINTS.ADMIN.DASHBOARD_REVENUE_SERIES}?${searchParams.toString()}`
        );
        return toDashboardRevenueSeries(response);
    },

    getOrderById: async (slugId: string) => {
        const response = await apiClient.get<AdminOrderDetailResponseModel>(API_ENDPOINTS.ADMIN.ORDER_DETAIL(slugId));
        return toAdminOrderDetail(response);
    },

    updateOrderDeliveryStatus: async (orderId: string, data: UpdateOrderDeliveryStatusRequestModel) => {
        const response = await apiClient.patch<AdminOrderResponseModel>(
            API_ENDPOINTS.ADMIN.ORDER_DELIVERY_STATUS(orderId),
            data
        );
        return toAdminOrder(response);
    },

    updateOrderPaymentStatus: async (orderId: string, data: UpdateOrderPaymentStatusRequestModel) => {
        const response = await apiClient.patch<AdminOrderResponseModel>(
            API_ENDPOINTS.ADMIN.ORDER_PAYMENT_STATUS(orderId),
            data
        );
        return toAdminOrder(response);
    },

    getRefunds: async (params?: GetAdminRefundsRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append('status', params.status);
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        const queryString = searchParams.toString();
        const response = await apiClient.get<GetAdminRefundsResponseModel>(
            `${API_ENDPOINTS.ADMIN.REFUNDS}${queryString ? `?${queryString}` : ''}`
        );
        return toAdminRefunds(response);
    },

    getRefundById: async (id: string) => {
        const response = await apiClient.get<AdminRefundDetailResponseModel>(API_ENDPOINTS.ADMIN.REFUND_DETAIL(id));
        return toAdminRefundDetail(response);
    },

    approveRefund: async (id: string) => {
        const response = await apiClient.post<AdminRefundDetailResponseModel>(API_ENDPOINTS.ADMIN.REFUND_APPROVE(id));
        return toAdminRefundDetail(response);
    },

    markRefundFailed: async (id: string, data: MarkRefundFailedRequestModel) => {
        const response = await apiClient.post<AdminRefundDetailResponseModel>(
            API_ENDPOINTS.ADMIN.REFUND_MARK_FAILED(id),
            data
        );
        return toAdminRefundDetail(response);
    },

    retryRefund: async (id: string) => {
        const response = await apiClient.post<AdminRefundDetailResponseModel>(API_ENDPOINTS.ADMIN.REFUND_RETRY(id));
        return toAdminRefundDetail(response);
    },

    getUsers: async (params?: GetAdminUsersRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        if (params?.keyword) searchParams.append('keyword', params.keyword);
        const queryString = searchParams.toString();
        const response = await apiClient.get<GetAdminUsersResponseModel>(
            `${API_ENDPOINTS.ADMIN.USERS}${queryString ? `?${queryString}` : ''}`
        );
        return toAdminUsers(response);
    },

    getUserById: async (id: string) => {
        const response = await apiClient.get<AdminUserDetailResponseModel>(API_ENDPOINTS.ADMIN.USER_DETAIL(id));
        return toAdminUserDetail(response);
    },

    updateUser: async (id: string, data: UpdateAdminUserRoleRequestModel) => {
        const response = await apiClient.patch<AdminUserDetailResponseModel>(API_ENDPOINTS.ADMIN.USER_DETAIL(id), data);
        return toAdminUserDetail(response);
    },

    deleteUser: (userId: string): Promise<void> => apiClient.delete(API_ENDPOINTS.ADMIN.USER_DELETE(userId)),

    getFoods: async (params?: GetAdminFoodsRequestModel) => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.keyword) searchParams.append('keyword', params.keyword);
        if (params?.category) searchParams.append('category', params.category);
        if (params?.isAvailable !== undefined) searchParams.append('isAvailable', params.isAvailable.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        const queryString = searchParams.toString();
        const response = await apiClient.get<GetAdminFoodsResponseModel>(
            `${API_ENDPOINTS.ADMIN.FOODS}${queryString ? `?${queryString}` : ''}`
        );
        return toAdminFoods(response);
    },

    getFoodById: async (id: string) => {
        const response = await apiClient.get<GetAdminFoodDetailResponseModel>(API_ENDPOINTS.ADMIN.FOOD_DETAIL(id));
        return toAdminFoodDetail(response);
    },

    createFood: async (data: CreateAdminFoodRequestModel) => {
        const response = await apiClient.post<GetAdminFoodDetailResponseModel>(API_ENDPOINTS.ADMIN.FOODS, data);
        return toAdminFoodDetail(response);
    },

    deleteFood: (id: string): Promise<void> => apiClient.delete(API_ENDPOINTS.ADMIN.FOOD_DELETE(id)),

    updateFood: async (id: string, data: UpdateAdminFoodRequestModel) => {
        const response = await apiClient.patch<GetAdminFoodDetailResponseModel>(
            API_ENDPOINTS.ADMIN.FOOD_UPDATE(id),
            data
        );
        return toAdminFoodDetail(response);
    },

    getCategories: async () => {
        const response = await apiClient.get<GetAdminCategoriesResponseModel>(API_ENDPOINTS.ADMIN.CATEGORIES);
        return toAdminCategories(response);
    },

    getCategoryById: async (id: string) => {
        const response = await apiClient.get<AdminCategoryResponseModel>(API_ENDPOINTS.ADMIN.CATEGORY_DETAIL(id));
        return toAdminCategory(response);
    },

    createCategory: async (data: CreateCategoryRequestModel) => {
        const response = await apiClient.post<AdminCategoryResponseModel>(API_ENDPOINTS.ADMIN.CATEGORIES, data);
        return toAdminCategory(response);
    },

    updateCategory: async (id: string, data: UpdateCategoryRequestModel) => {
        const response = await apiClient.patch<AdminCategoryResponseModel>(
            API_ENDPOINTS.ADMIN.CATEGORY_DETAIL(id),
            data
        );
        return toAdminCategory(response);
    },

    deleteCategory: (id: string): Promise<void> => apiClient.delete(API_ENDPOINTS.ADMIN.CATEGORY_DETAIL(id)),

    addCustomisationGroup: async (foodId: string, data: CreateCustomisationGroupRequestModel) => {
        const response = await apiClient.post<CustomisationGroupResponseModel>(
            API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_GROUPS(foodId),
            data
        );
        return toAdminCustomisationGroup(response);
    },

    updateCustomisationGroup: async (foodId: string, groupId: string, data: UpdateCustomisationGroupRequestModel) => {
        const response = await apiClient.patch<CustomisationGroupResponseModel>(
            API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_GROUP(foodId, groupId),
            data
        );
        return toAdminCustomisationGroup(response);
    },

    deleteCustomisationGroup: (foodId: string, groupId: string): Promise<void> =>
        apiClient.delete(API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_GROUP(foodId, groupId)),

    addCustomisationOption: async (foodId: string, groupId: string, data: CreateCustomisationOptionRequestModel) => {
        const response = await apiClient.post<CustomisationOptionResponseModel>(
            API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_OPTIONS(foodId, groupId),
            data
        );
        return toAdminCustomisationOption(response);
    },

    updateCustomisationOption: async (
        foodId: string,
        groupId: string,
        optionId: string,
        data: UpdateCustomisationOptionRequestModel
    ) => {
        const response = await apiClient.patch<CustomisationOptionResponseModel>(
            API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_OPTION(foodId, groupId, optionId),
            data
        );
        return toAdminCustomisationOption(response);
    },

    deleteCustomisationOption: (foodId: string, groupId: string, optionId: string): Promise<void> =>
        apiClient.delete(API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_OPTION(foodId, groupId, optionId)),
};
