import { CustomisationGroupModel } from './food.model';
import { DeliveryStatusTimingResponseModel, OrderItemResponseModel } from './order.model';

import { SortOrderEnum } from '@/app/enums';

export interface AdminOrderDetailResponseModel {
    id: string;
    slugId: string;
    totalAmount: number;
    paymentMethod: string;
    deliveryStatus: string;
    paymentStatus: string;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
    deliveryNotes: string | null;
    items: OrderItemResponseModel[];
    deliveryStatusTiming: DeliveryStatusTimingResponseModel;
}

export interface AdminOrderResponseModel {
    id: string;
    slugId: string;
    userId: string;
    userEmail: string;
    userName: string;
    totalAmount: number;
    deliveryStatus: string;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    totalItems: number;
    deliveryNotes: string | null;
}

export interface UpdateOrderDeliveryStatusRequestModel {
    deliveryStatus: string;
}

export interface AdminUserResponseModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string | null;
    location: string | null;
    createdAt: string;
}

export interface AdminUserDetailResponseModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string | null;
    location: string | null;
    createdAt: string;
}

export interface UpdateAdminUserRoleRequestModel {
    role: string;
}

export interface GetAdminUsersRequestModel {
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: SortOrderEnum;
    keyword?: string;
}

export interface GetAdminUsersResponseModel {
    items: AdminUserResponseModel[];
    totalCount: number;
}

export interface GetAdminOrdersRequestModel {
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: SortOrderEnum;
    keyword?: string;
    paymentStatus?: string;
}

export interface GetAdminOrdersResponseModel {
    items: AdminOrderResponseModel[];
    totalCount: number;
}

export interface GetAdminOrdersForKanbanRequestModel {
    status: string;
    skip?: number;
    take?: number;
    paymentStatus?: string;
}

export interface GetAdminOrdersForKanbanResponseModel {
    items: AdminOrderResponseModel[];
    totalCount: number;
}

export interface GetDashboardOrderStatusSummaryResponseModel {
    new: number;
    inProgress: number;
    completed: number;
}

export interface GetDashboardTodaySalesResponseModel {
    revenue: number;
    orderCount: number;
}

export interface AdminFoodItemResponseModel {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string;
    category: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
}

export interface GetAdminFoodsRequestModel {
    skip?: number;
    take?: number;
    keyword?: string;
    category?: string;
    isAvailable?: boolean;
    sortBy?: string;
    sortOrder?: SortOrderEnum;
}

export interface GetAdminFoodsResponseModel {
    items: AdminFoodItemResponseModel[];
    totalCount: number;
}

export interface GetAdminFoodDetailImageModel {
    fileKey: string;
    displayOrder: number;
    altText?: string;
    imageUrl: string;
}

export interface GetAdminFoodDetailResponseModel {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    images: GetAdminFoodDetailImageModel[];
    category: string;
    categoryId: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
    createdAt: string;
    updatedAt: string | null;
    customisations: CustomisationGroupModel[];
}

export interface AdminFoodImageRequestModel {
    fileKey: string;
    displayOrder: number;
    altText?: string;
}

export interface CreateAdminFoodRequestModel {
    name: string;
    description: string;
    price: number;
    discountPrice?: number | null;
    category: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
    images?: AdminFoodImageRequestModel[];
}

export interface UpdateAdminFoodRequestModel {
    name?: string;
    description?: string;
    price?: number;
    discountPrice?: number | null;
    category?: string;
    isAvailable?: boolean;
    stockQuantity?: number;
    quantityUnit?: string;
    images?: AdminFoodImageRequestModel[];
}

export interface AdminCategoryResponseModel {
    id: string;
    name: string;
}

export interface GetAdminCategoriesResponseModel {
    items: AdminCategoryResponseModel[];
}

export interface CreateCategoryRequestModel {
    name: string;
}

export interface UpdateCategoryRequestModel {
    name: string;
}

export interface CreateCustomisationGroupRequestModel {
    label: string;
    isRequired: boolean;
    displayOrder: number;
}

export interface UpdateCustomisationGroupRequestModel {
    label?: string;
    isRequired?: boolean;
    displayOrder?: number;
}

export interface CustomisationGroupResponseModel {
    id: string;
    foodId: string;
    label: string;
    isRequired: boolean;
    displayOrder: number;
}

export interface CreateCustomisationOptionRequestModel {
    label: string;
    surcharge?: number | null;
    displayOrder: number;
}

export interface UpdateCustomisationOptionRequestModel {
    label?: string;
    surcharge?: number | null;
    displayOrder?: number;
}

export interface CustomisationOptionResponseModel {
    id: string;
    groupId: string;
    label: string;
    surcharge: number | null;
    displayOrder: number;
}
