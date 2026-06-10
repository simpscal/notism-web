import { CustomisationGroupViewModel } from '@/features/food/models';

export interface AdminFoodItemViewModel {
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

export interface AdminFoodsViewModel {
    items: AdminFoodItemViewModel[];
    totalCount: number;
}

export interface AdminFoodDetailImageViewModel {
    fileKey: string;
    displayOrder: number;
    altText?: string;
    imageUrl: string;
}

export interface AdminFoodDetailViewModel {
    id: string;
    name: string;
    description: string;
    price: number;
    discountPrice: number | null;
    images: AdminFoodDetailImageViewModel[];
    category: string;
    categoryId: string;
    isAvailable: boolean;
    stockQuantity: number;
    quantityUnit: string;
    createdAt: string;
    updatedAt: string | null;
    customisations: CustomisationGroupViewModel[];
}
