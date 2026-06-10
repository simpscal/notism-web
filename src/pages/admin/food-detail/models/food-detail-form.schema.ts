import { z } from 'zod';

import { AdminFoodDetailViewModel } from '@/features/admin';

export const QUANTITY_UNIT_OPTIONS = [
    { value: 'g', label: 'g (gram)' },
    { value: 'ml', label: 'ml (milliliters)' },
] as const;

const quantityUnitSchema = z.enum(['g', 'ml'], { required_error: 'Quantity unit is required' });
const categorySchema = z.string().min(1, { message: 'Category is required' });

export const foodFormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    price: z.coerce.number().min(0, { message: 'Price must be 0 or greater' }),
    discountPrice: z.union([z.coerce.number().min(0), z.null()]).optional(),
    category: categorySchema,
    isAvailable: z.boolean(),
    stockQuantity: z.coerce.number().int().min(0, { message: 'Stock must be 0 or greater' }),
    quantityUnit: quantityUnitSchema,
});

export type FoodFormValues = z.infer<typeof foodFormSchema>;

function normalizeQuantityUnit(unit: string): 'g' | 'ml' {
    const lower = unit?.toLowerCase();
    if (lower === 'ml') return 'ml';
    return 'g';
}

export function getDefaultFormValues(food: AdminFoodDetailViewModel | null): FoodFormValues {
    if (!food) {
        return {
            name: '',
            description: '',
            price: 0,
            discountPrice: null,
            category: '',
            isAvailable: true,
            stockQuantity: 0,
            quantityUnit: 'g',
        };
    }
    return {
        name: food.name,
        description: food.description,
        price: food.price,
        discountPrice: food.discountPrice ?? null,
        category: food.categoryId ?? food.category,
        isAvailable: food.isAvailable,
        stockQuantity: food.stockQuantity,
        quantityUnit: normalizeQuantityUnit(food.quantityUnit),
    };
}
