export interface CreateOrderRequestModel {
    paymentMethod: string;
    cartItemIds: string[];
}

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
}

export interface DeliveryStatusTimingResponseModel {
    orderPlacedCompletedAt: string | null;
    preparingCompletedAt: string | null;
    onTheWayCompletedAt: string | null;
    deliveredCompletedAt: string | null;
}

export interface OrderResponseModel {
    id: string;
    slugId: string;
    totalAmount: number;
    paymentMethod: string;
    deliveryStatus: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItemResponseModel[];
    deliveryStatusTiming: DeliveryStatusTimingResponseModel;
}

export interface GetOrdersResponseModel {
    orders: OrderResponseModel[];
}
