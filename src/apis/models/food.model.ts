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
    customisations: CustomisationGroupModel[];
}

export interface GetFoodsRequestModel {
    skip?: number;
    take?: number;
    category?: string;
    keyword?: string;
    isAvailable?: boolean;
    sortBy?: string;
    sortOrder?: string;
}

export interface CategoryResponseModel {
    id: string;
    name: string;
}
