import { SlidersHorizontal, X } from 'lucide-react';
import { memo } from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';

interface FoodsToolbarProps {
    totalCount: number;
    selectedCategory: string | null;
    keyword: string;
    onClearFilters: () => void;
    onMobileFiltersOpen: () => void;
}

function FoodsToolbar({
    totalCount,
    selectedCategory,
    keyword,
    onClearFilters,
    onMobileFiltersOpen,
}: FoodsToolbarProps) {
    const hasActiveFilters = selectedCategory !== null || keyword !== '';

    return (
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6'>
            <div className='flex flex-wrap items-center gap-2'>
                <span className='text-sm text-muted-foreground'>
                    <span className='font-semibold text-foreground'>{totalCount}</span>{' '}
                    {totalCount === 1 ? 'dish' : 'dishes'} found
                </span>

                {keyword && (
                    <Badge variant='secondary' className='gap-1 text-xs'>
                        &ldquo;{keyword}&rdquo;
                        <Button
                            variant='ghost'
                            size='icon-xs'
                            onClick={onClearFilters}
                            className='-mr-1 h-3.5 w-3.5 hover:text-destructive'
                            aria-label='Clear search'
                        >
                            <X className='h-3 w-3' />
                        </Button>
                    </Badge>
                )}

                {selectedCategory && (
                    <Badge variant='secondary' className='gap-1 text-xs'>
                        {selectedCategory}
                        <Button
                            variant='ghost'
                            size='icon-xs'
                            onClick={onClearFilters}
                            className='-mr-1 h-3.5 w-3.5 hover:text-destructive'
                            aria-label='Clear category'
                        >
                            <X className='h-3 w-3' />
                        </Button>
                    </Badge>
                )}

                {hasActiveFilters && (
                    <Button
                        variant='ghost'
                        size='xs'
                        onClick={onClearFilters}
                        className='text-muted-foreground hover:text-foreground'
                    >
                        Clear all
                    </Button>
                )}
            </div>

            {/* Mobile filter button */}
            <Button variant='outline' size='sm' className='lg:hidden' onClick={onMobileFiltersOpen}>
                <SlidersHorizontal className='mr-2 h-3.5 w-3.5' />
                Filters &amp; Sort
            </Button>
        </div>
    );
}

export default memo(FoodsToolbar);
