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

export interface CartItemModel {
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
    isSelected?: boolean;
    customisations: CartItemCustomisationModel[];
    totalSurcharge: number;
}

export interface CartModel {
    items: CartItemModel[];
}
