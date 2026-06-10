import { OrderDeliveryStatusTimingViewModel } from './order-delivery-status-timing.model';

export interface OrderItemViewModel {
    id: string;
    foodId: string;
    foodName: string;
    unitPrice: number;
    discountPrice: number;
    quantity: number;
    totalPrice: number;
    imageUrl: string;
    surcharge: number | null;
    customisationLabel: string | null;
}

export interface OrderPaymentQrViewModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
    amount: number;
    orderReference: string;
}

export interface OrderViewModel {
    id: string;
    slugId: string;
    totalAmount: number;
    paymentMethod: string;
    deliveryStatus: string;
    paymentStatus: string;
    paidAt: string | null;
    paymentQr: OrderPaymentQrViewModel | null;
    createdAt: string;
    updatedAt: string;
    deliveryNotes: string | null;
    items: OrderItemViewModel[];
    deliveryStatusTiming: OrderDeliveryStatusTimingViewModel;
}

export interface OrdersViewModel {
    totalCount: number;
    items: OrderViewModel[];
}

export interface CreateOrderViewModel {
    orderId: string;
    slugId: string;
    totalAmount: number;
    paymentMethod: string;
    deliveryStatus: string;
    createdAt: string;
}
