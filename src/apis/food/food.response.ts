export interface FoodItemResponseModel {
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

export interface GetFoodsResponseModel {
    totalCount: number;
    items: FoodItemResponseModel[];
}

export interface FoodCustomisationOptionResponseModel {
    value: string; // option id
    label: string;
    surcharge?: number; // omitted when null/0
}

export interface FoodCustomisationGroupResponseModel {
    id: string;
    label: string;
    required: boolean;
    options: FoodCustomisationOptionResponseModel[];
}

export interface GetFoodByIdResponseModel {
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
    customisations: FoodCustomisationGroupResponseModel[];
}

export interface CategoryResponseModel {
    id: string;
    name: string;
}
