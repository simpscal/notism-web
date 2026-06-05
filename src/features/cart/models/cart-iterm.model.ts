export interface CartItemCustomisationOptionViewModel {
    id: string;
    label: string;
    surcharge: number | null;
}

export interface CartItemCustomisationViewModel {
    groupId: string | null;
    groupLabel: string;
    optionId: string | null;
    optionLabel: string;
    surcharge: number | null;
    availableOptions: CartItemCustomisationOptionViewModel[];
}

export interface CartItemViewModel {
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
    customisations: CartItemCustomisationViewModel[];
    totalSurcharge: number;
}
