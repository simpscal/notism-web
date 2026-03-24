import { LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { memo } from 'react';

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

const sortOptions: { value: FoodSortOption; label: string }[] = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
];

function FoodsSidebar({ categories, selectedCategory, sortBy, onCategoryChange, onSortChange }: FoodsSidebarProps) {
    return (
        <div className='space-y-6'>
            {/* Categories */}
            <div>
                <div className='mb-3 flex items-center gap-2'>
                    <LayoutGrid className='h-3.5 w-3.5 text-muted-foreground' />
                    <h3 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                        Categories
                    </h3>
                </div>
                <div className='space-y-0.5'>
                    <Button
                        variant={selectedCategory === null ? 'default' : 'ghost'}
                        size='sm'
                        className='w-full justify-start'
                        onClick={() => onCategoryChange(null)}
                    >
                        All Items
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
                    <h3 className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Sort By</h3>
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
