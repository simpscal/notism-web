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
