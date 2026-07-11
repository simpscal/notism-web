import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { ListItemModel } from '@/app/models';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

interface FoodsCategoryFilterProps {
    categories: ListItemModel[];
    selectedCategory: string | null;
    onCategoryChange: (category: string | null) => void;
}

function FoodsCategoryFilter({ categories, selectedCategory, onCategoryChange }: FoodsCategoryFilterProps) {
    const { t } = useTranslation();

    const handleValueChange = useCallback(
        (value: string) => {
            onCategoryChange(value === 'all' || value === '' ? null : value);
        },
        [onCategoryChange]
    );

    return (
        <div className='min-w-0 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            <ToggleGroup
                type='single'
                variant='segmented'
                value={selectedCategory ?? 'all'}
                onValueChange={handleValueChange}
                aria-label={t('foods.sidebar.categories')}
                className='w-max flex-nowrap'
            >
                <ToggleGroupItem
                    value='all'
                    aria-label={t('common.all')}
                    className='h-9 flex-none px-4 text-sm font-medium'
                >
                    {t('common.all')}
                </ToggleGroupItem>
                {categories.map(category => (
                    <ToggleGroupItem
                        key={category.value}
                        value={category.label}
                        aria-label={category.label}
                        className='h-9 flex-none px-4 text-sm font-medium'
                    >
                        {category.label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
}

export default memo(FoodsCategoryFilter);
