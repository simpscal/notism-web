export interface CustomisationOptionModel {
    value: string; // option id
    label: string;
    surcharge?: number; // omitted when null/0
}

export interface CustomisationGroupModel {
    id: string;
    label: string;
    required: boolean;
    options: CustomisationOptionModel[];
}

export interface FoodItemModel {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string;
    category: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
}

export interface FoodsModel {
    totalCount: number;
    items: FoodItemModel[];
}

export interface FoodDetailModel {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    imageUrls: string[];
    category: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
    createdAt: string;
    updatedAt: string | null;
    customisations: CustomisationGroupModel[];
}

export interface CategoryModel {
    id: string;
    name: string;
}
