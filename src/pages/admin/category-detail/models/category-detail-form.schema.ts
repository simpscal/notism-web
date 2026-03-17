import { z } from 'zod';

import type { AdminCategoryResponseModel } from '@/apis/models';

export const categoryDetailFormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
});

export type CategoryDetailFormValues = z.infer<typeof categoryDetailFormSchema>;

export function getDefaultCategoryDetailFormValues(
    category: AdminCategoryResponseModel | null
): CategoryDetailFormValues {
    if (!category) {
        return { name: '' };
    }
    return { name: category.name };
}

export function categoryDetailFormValuesToRequest(values: CategoryDetailFormValues): { name: string } {
    return { name: values.name };
}
