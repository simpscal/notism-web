import { LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { FoodSortOption } from '../enums';

import { ListItemModel } from '@/app/models';
import { Button } from '@/components/button';

interface FoodsSidebarProps {
    categories: ListItemModel[];
    selectedCategory: string | null;
    sortBy: FoodSortOption;
    onCategoryChange: (category: string | null) => void;
    onSortChange: (sort: FoodSortOption) => void;
}

function FoodsSidebar({ categories, selectedCategory, sortBy, onCategoryChange, onSortChange }: FoodsSidebarProps) {
    const { t } = useTranslation();
    const sortOptions: { value: FoodSortOption; label: string }[] = [
        { value: 'default', label: t('foods.sidebar.default') },
        { value: 'price-asc', label: t('foods.sidebar.priceLowHigh') },
        { value: 'price-desc', label: t('foods.sidebar.priceHighLow') },
        { value: 'name-asc', label: t('foods.sidebar.nameAZ') },
    ];

    return (
        <div className='space-y-6'>
            {/* Categories */}
            <div>
                <div className='mb-3 flex items-center gap-2'>
                    <LayoutGrid className='h-3.5 w-3.5 text-muted-foreground' />
                    <h3 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                        {t('foods.sidebar.categories')}
                    </h3>
                </div>
                <div className='space-y-0.5'>
                    <Button
                        variant={selectedCategory === null ? 'default' : 'ghost'}
                        size='sm'
                        className='w-full justify-start'
                        onClick={() => onCategoryChange(null)}
                    >
                        {t('foods.sidebar.allItems')}
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category.value}
                            variant={selectedCategory === category.label ? 'default' : 'ghost'}
                            size='sm'
                            className='w-full justify-start'
                            onClick={() => onCategoryChange(category.label)}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className='h-px bg-border' />

            {/* Sort */}
            <div>
                <div className='mb-3 flex items-center gap-2'>
                    <SlidersHorizontal className='h-3.5 w-3.5 text-muted-foreground' />
                    <h3 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                        {t('foods.sidebar.sortBy')}
                    </h3>
                </div>
                <div className='space-y-0.5'>
                    {sortOptions.map(option => (
                        <Button
                            key={option.value}
                            variant={sortBy === option.value ? 'default' : 'ghost'}
                            size='sm'
                            className='w-full justify-start'
                            onClick={() => onSortChange(option.value)}
                        >
                            {option.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default memo(FoodsSidebar);
