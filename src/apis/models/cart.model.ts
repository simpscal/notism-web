export interface CartItemCustomisationOptionModel {
    id: string;
    label: string;
    surcharge: number | null;
}

export interface CartItemCustomisationModel {
    groupId: string | null;
    groupLabel: string;
    optionId: string | null;
    optionLabel: string;
    surcharge: number | null;
    availableOptions: CartItemCustomisationOptionModel[];
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
    customisations: CartItemCustomisationModel[];
    totalSurcharge: number;
}

export interface GetCartResponseModel {
    items: CartItemResponseModel[];
}

export interface AddCartItemRequestModel {
    foodId: string;
    quantity: number;
    customisations?: { groupId: string; optionId: string }[];
}

export interface ReplaceCartItemCustomisationsRequestModel {
    customisations: { groupId: string; optionId: string }[];
}

export interface UpdateCartItemQuantityRequestModel {
    quantity: number;
}

export interface BulkAddCartItemsRequestModel {
    items: AddCartItemRequestModel[];
}
