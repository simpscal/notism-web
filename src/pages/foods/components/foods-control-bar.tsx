import { ArrowUpDown, X } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { FoodSortOption } from '../enums';

import { ListItemModel } from '@/app/models';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

interface FoodsControlBarProps {
    categories: ListItemModel[];
    selectedCategory: string | null;
    sortBy: FoodSortOption;
    keyword: string;
    totalCount: number;
    onCategoryChange: (category: string | null) => void;
    onSortChange: (sort: FoodSortOption) => void;
    onClearFilters: () => void;
}

function FoodsControlBar({
    categories,
    selectedCategory,
    sortBy,
    keyword,
    totalCount,
    onCategoryChange,
    onSortChange,
    onClearFilters,
}: FoodsControlBarProps) {
    const { t } = useTranslation();
    const hasActiveFilters = selectedCategory !== null || keyword !== '';

    const handleToggleChange = (value: string) => {
        onCategoryChange(value === 'all' ? null : value);
    };

    return (
        <div className='md:sticky md:top-16 md:z-40 -mx-4 mb-5 border-b bg-background/95 px-4 pb-3 pt-1 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:mb-6'>
            <div className='flex items-center gap-3'>
                <div className='min-w-0 flex-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
                    <ToggleGroup
                        type='single'
                        value={selectedCategory ?? 'all'}
                        onValueChange={handleToggleChange}
                        aria-label={t('foods.sidebar.categories')}
                        className='w-max flex-nowrap justify-start gap-1.5'
                    >
                        <ToggleGroupItem
                            value='all'
                            aria-label={t('foods.sidebar.allItems')}
                            className='flex-none shrink-0 rounded-full border px-3.5 text-xs font-medium data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground sm:text-sm'
                        >
                            {t('foods.sidebar.allItems')}
                        </ToggleGroupItem>
                        {categories.map(cat => (
                            <ToggleGroupItem
                                key={cat.value}
                                value={cat.label}
                                aria-label={cat.label}
                                className='flex-none shrink-0 rounded-full border px-3.5 text-xs font-medium data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground sm:text-sm'
                            >
                                {cat.label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className='shrink-0'>
                    <Select value={sortBy} onValueChange={v => onSortChange(v as FoodSortOption)}>
                        <SelectTrigger
                            size='sm'
                            aria-label={t('foods.sidebar.sortBy')}
                            className='h-9 gap-2 rounded-full'
                        >
                            <ArrowUpDown className='h-3.5 w-3.5 text-muted-foreground' />
                            <span className='hidden sm:inline'>
                                <SelectValue placeholder={t('foods.sidebar.sortBy')} />
                            </span>
                        </SelectTrigger>
                        <SelectContent align='end'>
                            <SelectItem value='default'>{t('foods.sidebar.default')}</SelectItem>
                            <SelectItem value='price-asc'>{t('foods.sidebar.priceLowHigh')}</SelectItem>
                            <SelectItem value='price-desc'>{t('foods.sidebar.priceHighLow')}</SelectItem>
                            <SelectItem value='name-asc'>{t('foods.sidebar.nameAZ')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className='mt-2.5 flex flex-wrap items-center gap-2'>
                <span className='text-sm text-muted-foreground'>
                    <span className='font-semibold text-foreground'>{totalCount}</span>{' '}
                    {totalCount === 1 ? t('foods.toolbar.dishFound') : t('foods.toolbar.dishesFound')}
                </span>

                {keyword && (
                    <>
                        <span className='text-muted-foreground/40' aria-hidden='true'>
                            •
                        </span>
                        <Badge variant='secondary' className='gap-1 rounded-full pr-1 text-xs'>
                            &ldquo;{keyword}&rdquo;
                            <button
                                type='button'
                                onClick={onClearFilters}
                                className='ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-foreground/10 hover:text-destructive'
                                aria-label={t('common.close')}
                            >
                                <X className='h-3 w-3' />
                            </button>
                        </Badge>
                    </>
                )}

                {selectedCategory && (
                    <>
                        <span className='text-muted-foreground/40' aria-hidden='true'>
                            •
                        </span>
                        <Badge variant='secondary' className='gap-1 rounded-full pr-1 text-xs'>
                            {selectedCategory}
                            <button
                                type='button'
                                onClick={() => onCategoryChange(null)}
                                className='ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-foreground/10 hover:text-destructive'
                                aria-label={`Remove ${selectedCategory} filter`}
                            >
                                <X className='h-3 w-3' />
                            </button>
                        </Badge>
                    </>
                )}

                {hasActiveFilters && (
                    <Button
                        variant='ghost'
                        size='xs'
                        onClick={onClearFilters}
                        className='ml-auto text-muted-foreground hover:text-foreground'
                    >
                        <X className='mr-1 h-3 w-3' />
                        {t('foods.toolbar.clearAll')}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default memo(FoodsControlBar);
