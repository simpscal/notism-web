export interface CreateOrderRequestModel {
    paymentMethod: string;
    cartItemIds: string[];
}

export interface GetOrdersRequestModel {
    skip?: number;
    take?: number;
    paymentStatus?: string;
}
