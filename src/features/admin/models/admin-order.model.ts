import { OrderDeliveryStatusTimingViewModel, OrderItemViewModel } from '@/features/order/models';

export interface AdminOrderViewModel {
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

export interface AdminOrdersViewModel {
    items: AdminOrderViewModel[];
    totalCount: number;
}

export interface DashboardOrderStatusSummaryViewModel {
    new: number;
    inProgress: number;
    completed: number;
}

export interface DashboardTodaySalesViewModel {
    revenue: number;
    orderCount: number;
}

export type DashboardRevenueGranularityViewModel = 'year' | 'month' | 'day';

export interface DashboardRevenuePointViewModel {
    /** Period label as returned by the server, e.g. "2024", "Jun", "01". */
    period: string;
    /** Total revenue in VND for the period; 0 for empty periods. */
    revenue: number;
}

export interface DashboardRevenueSeriesViewModel {
    granularity: DashboardRevenueGranularityViewModel;
    points: DashboardRevenuePointViewModel[];
}

export interface AdminOrderDetailViewModel {
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
    items: OrderItemViewModel[];
    deliveryStatusTiming: OrderDeliveryStatusTimingViewModel;
}
