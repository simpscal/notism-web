export interface CartItemCustomisationOptionViewModel {
    id: string;
    label: string;
    surcharge: number | null;
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
    customisationGroupId: string | null;
    customisationGroupLabel: string | null;
    customisationOptionId: string | null;
    customisationLabel: string | null;
    surcharge: number | null;
    customisationOptions: CartItemCustomisationOptionViewModel[];
}
