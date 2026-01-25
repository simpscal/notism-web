export interface CartItemResponseModel {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string;
    category: string;
    quantity: number;
    stockQuantity: number;
    quantityUnit: string;
}

export interface GetCartResponseModel {
    items: CartItemResponseModel[];
}

export interface AddCartItemRequestModel {
    foodId: string;
    quantity: number;
}

export interface UpdateCartItemQuantityRequestModel {
    quantity: number;
}
