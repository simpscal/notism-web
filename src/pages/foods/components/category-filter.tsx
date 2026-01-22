import { memo } from 'react';

import { ListItemModel } from '@/app/models';
import { Button } from '@/components/button';
import { ScrollArea, ScrollBar } from '@/components/scroll-area';

interface CategoryFilterProps {
    categories: ListItemModel[];
    selectedCategory: string | null;
    disabled?: boolean;
    onCategoryChange: (category: string | null) => void;
}

function CategoryFilter({ categories, selectedCategory, onCategoryChange, disabled }: CategoryFilterProps) {
    return (
        <ScrollArea className='w-full whitespace-nowrap'>
            <div className='flex gap-2 pb-2'>
                <Button
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    size='sm'
                    disabled={disabled}
                    onClick={() => onCategoryChange(null)}
                >
                    All
                </Button>

                {categories.map(category => (
                    <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? 'default' : 'outline'}
                        size='sm'
                        disabled={disabled}
                        onClick={() => onCategoryChange(category.value)}
                    >
                        {category.label}
                    </Button>
                ))}
            </div>
            <ScrollBar orientation='horizontal' className='invisible' />
        </ScrollArea>
    );
}

export default memo(CategoryFilter);
