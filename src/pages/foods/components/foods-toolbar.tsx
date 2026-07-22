import { SlidersHorizontal, X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';

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
    const { t } = useTranslation();
    const hasActiveFilters = selectedCategory !== null || keyword !== '';

    return (
        <div className='mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6'>
            <div className='flex flex-wrap items-center gap-2'>
                <span className='text-sm text-muted-foreground'>
                    <span className='font-semibold text-foreground'>{totalCount}</span>{' '}
                    {totalCount === 1 ? t('foods.toolbar.dishFound') : t('foods.toolbar.dishesFound')}
                </span>

                {keyword && (
                    <Badge variant='secondary' className='gap-1 text-xs'>
                        &ldquo;{keyword}&rdquo;
                        <Button
                            variant='ghost'
                            size='icon-xs'
                            onClick={onClearFilters}
                            className='-mr-1 h-3.5 w-3.5 hover:text-destructive'
                            aria-label={t('common.close')}
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
                            aria-label={t('common.close')}
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
                        {t('foods.toolbar.clearAll')}
                    </Button>
                )}
            </div>

            {/* Mobile filter button */}
            <Button variant='outline' size='sm' className='lg:hidden' onClick={onMobileFiltersOpen}>
                <SlidersHorizontal className='mr-2 h-3.5 w-3.5' />
                {t('foods.toolbar.filtersSort')}
            </Button>
        </div>
    );
}

export default memo(FoodsToolbar);
