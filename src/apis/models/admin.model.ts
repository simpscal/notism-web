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

export interface UpdateOrderPaymentStatusRequestModel {
    paymentStatus: string;
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

export interface AdminRefundListItemResponseModel {
    id: string;
    slugId: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface GetAdminRefundsRequestModel {
    status?: string;
    skip?: number;
    take?: number;
}

export interface GetAdminRefundsResponseModel {
    items: AdminRefundListItemResponseModel[];
    totalCount: number;
}

export interface AdminRefundDetailResponseModel {
    id: string;
    slugId: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdAt: string;
    paidAt: string | null;
    transferReference: string | null;
    failureReason: string | null;
}

export interface MarkRefundFailedRequestModel {
    reason: string;
}

export interface GetDashboardOrderStatusSummaryResponseModel {
    new: number;
    inProgress: number;
    completed: number;
}

/**
 * The client owns all timezone logic: it computes today's local window and
 * converts it to a half-open UTC range `[startUtc, endUtc)`.
 */
export interface GetDashboardTodaySalesRequestModel {
    startUtc: string;
    endUtc: string;
}

export interface GetDashboardTodaySalesResponseModel {
    revenue: number;
    orderCount: number;
}

export type DashboardRevenueGranularity = 'year' | 'month' | 'day';

/**
 * The client computes the local period boundaries for the active granularity,
 * converts them to an ascending UTC boundary set (`n + 1` instants), derives a
 * stable label per bucket (`n` labels), and sends both plus the granularity
 * hint. The backend derives no window itself.
 */
export interface GetDashboardRevenueSeriesRequestModel {
    boundaries: string[];
    labels: string[];
    granularity: DashboardRevenueGranularity;
}

export interface DashboardRevenueSeriesPointResponseModel {
    period: string;
    revenue: number;
}

export interface GetDashboardRevenueSeriesResponseModel {
    granularity: string;
    points: DashboardRevenueSeriesPointResponseModel[];
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
