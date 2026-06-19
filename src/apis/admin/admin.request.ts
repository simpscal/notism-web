import { SortOrderEnum } from '@/app/enums';

export interface UpdateOrderDeliveryStatusRequestModel {
    deliveryStatus: string;
}

export interface UpdateOrderPaymentStatusRequestModel {
    paymentStatus: string;
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

export interface GetAdminOrdersRequestModel {
    skip?: number;
    take?: number;
    sortBy?: string;
    sortOrder?: SortOrderEnum;
    keyword?: string;
    paymentStatus?: string;
}

export interface GetAdminOrdersForKanbanRequestModel {
    status: string;
    skip?: number;
    take?: number;
    paymentStatus?: string;
}

export interface GetAdminRefundsRequestModel {
    status?: string;
    skip?: number;
    take?: number;
}

export interface MarkRefundFailedRequestModel {
    reason: string;
}

/**
 * The client owns all timezone logic: it computes today's local window and
 * converts it to a half-open UTC range `[startUtc, endUtc)`.
 */
export interface GetDashboardTodaySalesRequestModel {
    startUtc: string;
    endUtc: string;
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

export interface GetAdminFoodsRequestModel {
    skip?: number;
    take?: number;
    keyword?: string;
    category?: string;
    isAvailable?: boolean;
    sortBy?: string;
    sortOrder?: SortOrderEnum;
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
