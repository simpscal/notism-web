import { CustomisationGroupModel } from '../food';
import { OrderDeliveryStatusTimingModel, OrderItemModel } from '../order';

export interface AdminCategoryModel {
    id: string;
    name: string;
}

export interface AdminCategoriesModel {
    items: AdminCategoryModel[];
}

export interface AdminCustomisationGroupModel {
    id: string;
    foodId: string;
    label: string;
    isRequired: boolean;
    displayOrder: number;
}

export interface AdminCustomisationOptionModel {
    id: string;
    groupId: string;
    label: string;
    surcharge: number | null;
    displayOrder: number;
}

export interface AdminFoodItemModel {
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

export interface AdminFoodsModel {
    items: AdminFoodItemModel[];
    totalCount: number;
}

export interface AdminFoodDetailImageModel {
    fileKey: string;
    displayOrder: number;
    altText?: string;
    imageUrl: string;
}

export interface AdminFoodDetailModel {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    images: AdminFoodDetailImageModel[];
    category: string;
    categoryId: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
    createdAt: string;
    updatedAt: string | null;
    customisations: CustomisationGroupModel[];
}

export interface AdminOrderModel {
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

export interface AdminOrdersModel {
    items: AdminOrderModel[];
    totalCount: number;
}

export interface DashboardOrderStatusSummaryModel {
    new: number;
    inProgress: number;
    completed: number;
}

export interface DashboardTodaySalesModel {
    revenue: number;
    orderCount: number;
}

export type DashboardRevenueGranularityModel = 'year' | 'month' | 'day';

export interface DashboardRevenuePointModel {
    /** Period label as returned by the server, e.g. "2024", "Jun", "01". */
    period: string;
    /** Total revenue in VND for the period; 0 for empty periods. */
    revenue: number;
}

export interface DashboardRevenueSeriesModel {
    granularity: DashboardRevenueGranularityModel;
    points: DashboardRevenuePointModel[];
}

export interface AdminOrderDetailModel {
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
    items: OrderItemModel[];
    deliveryStatusTiming: OrderDeliveryStatusTimingModel;
}

export interface AdminUserModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string | null;
    location: string | null;
    createdAt: string;
}

export interface AdminUsersModel {
    items: AdminUserModel[];
    totalCount: number;
}

export interface AdminUserDetailModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string | null;
    location: string | null;
    createdAt: string;
}
