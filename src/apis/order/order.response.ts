import type { BankAccountResponseModel } from '../user';

export interface CreateOrderResponseModel {
    orderId: string;
    slugId: string;
    totalAmount: number;
    paymentMethod: string;
    deliveryStatus: string;
    createdAt: string;
}

export interface OrderItemResponseModel {
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

export interface DeliveryStatusTimingResponseModel {
    orderPlacedCompletedAt: string | null;
    preparingCompletedAt: string | null;
    onTheWayCompletedAt: string | null;
    deliveredCompletedAt: string | null;
}

export interface OrderPaymentQrResponseModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
    amount: number;
    orderReference: string;
}

export interface RefundSummaryResponseModel {
    id: string;
    slugId: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdAt: string;
    paidAt: string | null;
    transferReference: string | null;
}

export interface OrderResponseModel {
    id: string;
    slugId: string;
    totalAmount: number;
    paymentMethod: string;
    deliveryStatus: string;
    paymentStatus: string;
    paidAt: string | null;
    paymentQr: OrderPaymentQrResponseModel | null;
    createdAt: string;
    updatedAt: string;
    deliveryNotes: string | null;
    items: OrderItemResponseModel[];
    deliveryStatusTiming: DeliveryStatusTimingResponseModel;
    refund: RefundSummaryResponseModel | null;
}

export interface HeldRefundResponseModel {
    refundId: string;
    orderReference: string;
    amount: number;
}

export interface GetOrdersResponseModel {
    totalCount: number;
    items: OrderResponseModel[];
}

export interface BankingCheckoutResponseModel {
    checkoutId: string;
    bankAccount: BankAccountResponseModel | null;
}
