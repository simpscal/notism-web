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
