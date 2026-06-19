import { FoodCustomisationGroupResponseModel } from '../food';
import { DeliveryStatusTimingResponseModel, OrderItemResponseModel } from '../order';

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

export interface GetAdminUsersResponseModel {
    items: AdminUserResponseModel[];
    totalCount: number;
}

export interface GetAdminOrdersResponseModel {
    items: AdminOrderResponseModel[];
    totalCount: number;
}

export interface GetAdminOrdersForKanbanResponseModel {
    items: AdminOrderResponseModel[];
    totalCount: number;
}

export interface AdminRefundListItemResponseModel {
    id: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    transferReference: string | null;
    createdAt: string;
    paidAt: string | null;
}

export interface GetAdminRefundsResponseModel {
    items: AdminRefundListItemResponseModel[];
    totalCount: number;
}

export interface AdminRefundDetailResponseModel {
    id: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdAt: string;
    paidAt: string | null;
    transferReference: string | null;
    failureReason: string | null;
    bankCode: string | null;
    accountNumber: string | null;
    accountHolderName: string | null;
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
    customisations: FoodCustomisationGroupResponseModel[];
}

export interface AdminCategoryResponseModel {
    id: string;
    name: string;
}

export interface GetAdminCategoriesResponseModel {
    items: AdminCategoryResponseModel[];
}

export interface CustomisationGroupResponseModel {
    id: string;
    foodId: string;
    label: string;
    isRequired: boolean;
    displayOrder: number;
}

export interface CustomisationOptionResponseModel {
    id: string;
    groupId: string;
    label: string;
    surcharge: number | null;
    displayOrder: number;
}
