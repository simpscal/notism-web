export interface CartItemCustomisationOptionResponseModel {
    id: string;
    label: string;
    surcharge: number | null;
}

export interface CartItemCustomisationResponseModel {
    groupId: string | null;
    groupLabel: string;
    optionId: string | null;
    optionLabel: string;
    surcharge: number | null;
    availableOptions: CartItemCustomisationOptionResponseModel[];
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
    customisations: CartItemCustomisationResponseModel[];
    totalSurcharge: number;
}

export interface GetCartResponseModel {
    items: CartItemResponseModel[];
}

export interface UpdateCartItemQuantityResponseModel {
    id: string;
}
