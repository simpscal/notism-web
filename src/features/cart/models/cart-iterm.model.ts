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
    isSelected: boolean;
}
