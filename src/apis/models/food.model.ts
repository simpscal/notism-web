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
}

export interface GetFoodsRequestModel {
    skip?: number;
    take?: number;
    category?: string;
    keyword?: string;
    isAvailable?: boolean;
}
