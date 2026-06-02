export interface CartItemCustomisationOptionModel {
    id: string;
    label: string;
    surcharge: number | null;
}

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
    customisationGroupId: string | null;
    customisationGroupLabel: string | null;
    customisationOptionId: string | null;
    customisationLabel: string | null;
    surcharge: number | null;
    customisationOptions: CartItemCustomisationOptionModel[];
}

export interface GetCartResponseModel {
    items: CartItemResponseModel[];
}

export interface AddCartItemRequestModel {
    foodId: string;
    quantity: number;
    customisationOptionId?: string;
}

export interface UpdateCartItemCustomisationRequestModel {
    customisationOptionId: string;
}

export interface UpdateCartItemQuantityRequestModel {
    quantity: number;
}

export interface BulkAddCartItemsRequestModel {
    items: AddCartItemRequestModel[];
}
