import { CustomisationGroupViewModel } from './customisation.model';

export interface FoodItemViewModel {
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

export interface FoodsViewModel {
    totalCount: number;
    items: FoodItemViewModel[];
}

export interface FoodDetailViewModel {
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
    customisations: CustomisationGroupViewModel[];
}

export interface CategoryViewModel {
    id: string;
    name: string;
}
