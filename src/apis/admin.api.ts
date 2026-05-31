import { apiClient } from './client';
import {
    AdminOrderResponseModel,
    GetAdminUsersRequestModel,
    GetAdminUsersResponseModel,
    GetAdminOrdersRequestModel,
    GetAdminOrdersResponseModel,
    GetAdminOrdersForKanbanRequestModel,
    GetAdminOrdersForKanbanResponseModel,
    UpdateOrderDeliveryStatusRequestModel,
    GetAdminFoodsRequestModel,
    GetAdminFoodsResponseModel,
    GetAdminFoodDetailResponseModel,
    CreateAdminFoodRequestModel,
    UpdateAdminFoodRequestModel,
    AdminOrderDetailResponseModel,
    AdminUserDetailResponseModel,
    UpdateAdminUserRoleRequestModel,
    GetAdminCategoriesResponseModel,
    AdminCategoryResponseModel,
    CreateCategoryRequestModel,
    UpdateCategoryRequestModel,
    CreateCustomisationGroupRequestModel,
    UpdateCustomisationGroupRequestModel,
    CustomisationGroupResponseModel,
    CreateCustomisationOptionRequestModel,
    UpdateCustomisationOptionRequestModel,
    CustomisationOptionResponseModel,
} from './models';

import { API_ENDPOINTS } from '@/app/constants';

export const adminApi = {
    getOrdersForTable: (params?: GetAdminOrdersRequestModel): Promise<GetAdminOrdersResponseModel> => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        if (params?.keyword) searchParams.append('keyword', params.keyword);
        if (params?.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
        const queryString = searchParams.toString();
        return apiClient.get(`${API_ENDPOINTS.ADMIN.ORDERS_TABLE}${queryString ? `?${queryString}` : ''}`);
    },

    getOrdersForKanban: (
        params: GetAdminOrdersForKanbanRequestModel
    ): Promise<GetAdminOrdersForKanbanResponseModel> => {
        const searchParams = new URLSearchParams();
        searchParams.append('status', params.status);
        if (params.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params.take !== undefined) searchParams.append('take', params.take.toString());
        if (params.paymentStatus) searchParams.append('paymentStatus', params.paymentStatus);
        return apiClient.get(`${API_ENDPOINTS.ADMIN.ORDERS_KANBAN}?${searchParams.toString()}`);
    },

    getOrderById: (slugId: string): Promise<AdminOrderDetailResponseModel> =>
        apiClient.get(API_ENDPOINTS.ADMIN.ORDER_DETAIL(slugId)),

    updateOrderDeliveryStatus: (
        orderId: string,
        data: UpdateOrderDeliveryStatusRequestModel
    ): Promise<AdminOrderResponseModel> => apiClient.patch(API_ENDPOINTS.ADMIN.ORDER_DELIVERY_STATUS(orderId), data),

    getUsers: (params?: GetAdminUsersRequestModel): Promise<GetAdminUsersResponseModel> => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        if (params?.keyword) searchParams.append('keyword', params.keyword);
        const queryString = searchParams.toString();
        return apiClient.get(`${API_ENDPOINTS.ADMIN.USERS}${queryString ? `?${queryString}` : ''}`);
    },

    getUserById: (id: string): Promise<AdminUserDetailResponseModel> =>
        apiClient.get(API_ENDPOINTS.ADMIN.USER_DETAIL(id)),

    updateUser: (id: string, data: UpdateAdminUserRoleRequestModel): Promise<AdminUserDetailResponseModel> =>
        apiClient.patch(API_ENDPOINTS.ADMIN.USER_DETAIL(id), data),

    deleteUser: (userId: string): Promise<void> => apiClient.delete(API_ENDPOINTS.ADMIN.USER_DELETE(userId)),

    getFoods: (params?: GetAdminFoodsRequestModel): Promise<GetAdminFoodsResponseModel> => {
        const searchParams = new URLSearchParams();
        if (params?.skip !== undefined) searchParams.append('skip', params.skip.toString());
        if (params?.take !== undefined) searchParams.append('take', params.take.toString());
        if (params?.keyword) searchParams.append('keyword', params.keyword);
        if (params?.category) searchParams.append('category', params.category);
        if (params?.isAvailable !== undefined) searchParams.append('isAvailable', params.isAvailable.toString());
        if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
        const queryString = searchParams.toString();
        return apiClient.get(`${API_ENDPOINTS.ADMIN.FOODS}${queryString ? `?${queryString}` : ''}`);
    },

    getFoodById: (id: string): Promise<GetAdminFoodDetailResponseModel> =>
        apiClient.get(API_ENDPOINTS.ADMIN.FOOD_DETAIL(id)),

    createFood: (data: CreateAdminFoodRequestModel): Promise<GetAdminFoodDetailResponseModel> =>
        apiClient.post(API_ENDPOINTS.ADMIN.FOODS, data),

    deleteFood: (id: string): Promise<void> => apiClient.delete(API_ENDPOINTS.ADMIN.FOOD_DELETE(id)),

    updateFood: (id: string, data: UpdateAdminFoodRequestModel): Promise<GetAdminFoodDetailResponseModel> =>
        apiClient.patch(API_ENDPOINTS.ADMIN.FOOD_UPDATE(id), data),

    getCategories: (): Promise<GetAdminCategoriesResponseModel> => apiClient.get(API_ENDPOINTS.ADMIN.CATEGORIES),

    getCategoryById: (id: string): Promise<AdminCategoryResponseModel> =>
        apiClient.get(API_ENDPOINTS.ADMIN.CATEGORY_DETAIL(id)),

    createCategory: (data: CreateCategoryRequestModel): Promise<AdminCategoryResponseModel> =>
        apiClient.post(API_ENDPOINTS.ADMIN.CATEGORIES, data),

    updateCategory: (id: string, data: UpdateCategoryRequestModel): Promise<AdminCategoryResponseModel> =>
        apiClient.patch(API_ENDPOINTS.ADMIN.CATEGORY_DETAIL(id), data),

    deleteCategory: (id: string): Promise<void> => apiClient.delete(API_ENDPOINTS.ADMIN.CATEGORY_DETAIL(id)),

    addCustomisationGroup: (
        foodId: string,
        data: CreateCustomisationGroupRequestModel
    ): Promise<CustomisationGroupResponseModel> =>
        apiClient.post(API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_GROUPS(foodId), data),

    updateCustomisationGroup: (
        foodId: string,
        groupId: string,
        data: UpdateCustomisationGroupRequestModel
    ): Promise<CustomisationGroupResponseModel> =>
        apiClient.patch(API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_GROUP(foodId, groupId), data),

    deleteCustomisationGroup: (foodId: string, groupId: string): Promise<void> =>
        apiClient.delete(API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_GROUP(foodId, groupId)),

    addCustomisationOption: (
        foodId: string,
        groupId: string,
        data: CreateCustomisationOptionRequestModel
    ): Promise<CustomisationOptionResponseModel> =>
        apiClient.post(API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_OPTIONS(foodId, groupId), data),

    updateCustomisationOption: (
        foodId: string,
        groupId: string,
        optionId: string,
        data: UpdateCustomisationOptionRequestModel
    ): Promise<CustomisationOptionResponseModel> =>
        apiClient.patch(API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_OPTION(foodId, groupId, optionId), data),

    deleteCustomisationOption: (foodId: string, groupId: string, optionId: string): Promise<void> =>
        apiClient.delete(API_ENDPOINTS.ADMIN.FOOD_CUSTOMISATION_OPTION(foodId, groupId, optionId)),
};
