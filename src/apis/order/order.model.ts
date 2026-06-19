export interface OrderItemModel {
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

export interface OrderPaymentQrModel {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
    amount: number;
    orderReference: string;
}

export interface OrderDeliveryStatusTimingModel {
    orderPlacedCompletedAt: string | null;
    preparingCompletedAt: string | null;
    onTheWayCompletedAt: string | null;
    deliveredCompletedAt: string | null;
}

export interface RefundSummaryModel {
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

export interface RefundListItemModel {
    id: string;
    orderId: string;
    orderSlugId: string;
    amount: number;
    status: string;
    transferReference: string | null;
    createdAt: string;
    paidAt: string | null;
}

export interface RefundsModel {
    totalCount: number;
    items: RefundListItemModel[];
}

export interface HeldRefundModel {
    refundId: string;
    orderRef: string;
    amount: number;
}

export interface RefundDetailModel {
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

export interface OrderModel {
    id: string;
    slugId: string;
    totalAmount: number;
    paymentMethod: string;
    deliveryStatus: string;
    paymentStatus: string;
    paidAt: string | null;
    paymentQr: OrderPaymentQrModel | null;
    createdAt: string;
    updatedAt: string;
    deliveryNotes: string | null;
    items: OrderItemModel[];
    deliveryStatusTiming: OrderDeliveryStatusTimingModel;
    refund: RefundSummaryModel | null;
}

export interface OrdersModel {
    totalCount: number;
    items: OrderModel[];
}

export interface CreateOrderModel {
    orderId: string;
    slugId: string;
    totalAmount: number;
    paymentMethod: string;
    deliveryStatus: string;
    createdAt: string;
}
