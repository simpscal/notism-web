import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { FoodsCategoryFilter, FoodsGrid, FoodsSortControl } from './components';
import { FoodSortOption } from './enums';

import { ListItemModel } from '@/app/models';
import { useAppSelector } from '@/core/hooks';

function Foods() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategory = searchParams.get('category');
    const keyword = searchParams.get('keyword') || '';

    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState<FoodSortOption>('default');

    const storeCategories = useAppSelector(state => state.food.categories);
    const categories: ListItemModel[] = useMemo(
        () => storeCategories.map(c => ({ value: c.id, label: c.name })),
        [storeCategories]
    );

    const handleCategoryChange = useCallback(
        (category: string | null) => {
            const params = new URLSearchParams(searchParams);
            if (category) {
                params.set('category', category);
            } else {
                params.delete('category');
            }
            setSearchParams(params);
        },
        [searchParams, setSearchParams]
    );

    const handleClearFilters = useCallback(() => {
        setSearchParams(new URLSearchParams());
    }, [setSearchParams]);

    const handleTotalCountChange = useCallback((count: number) => {
        setTotalCount(count);
    }, []);

    const handleSortChange = useCallback((sort: FoodSortOption) => {
        setSortBy(sort);
    }, []);

    return (
        <div className='bg-background'>
            <header className='bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-10 border-b border-border px-4 pb-3 pt-4 backdrop-blur sm:px-6'>
                <div className='flex items-center justify-between gap-3'>
                    <div className='min-w-0'>
                        <h1 className='truncate text-lg font-bold text-foreground sm:text-xl'>
                            {t('foods.menu.title')}
                        </h1>
                        <p className='text-sm text-muted-foreground'>
                            <span className='font-semibold text-foreground'>{totalCount}</span>{' '}
                            {totalCount === 1 ? t('foods.toolbar.dishFound') : t('foods.toolbar.dishesFound')}
                        </p>
                    </div>

                    <FoodsSortControl sortBy={sortBy} onSortChange={handleSortChange} />
                </div>

                <div className='mt-3'>
                    <FoodsCategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>
            </header>

            <div className='px-4 py-5 sm:px-6 sm:py-6'>
                <FoodsGrid
                    category={selectedCategory}
                    keyword={keyword}
                    sortBy={sortBy}
                    onTotalCountChange={handleTotalCountChange}
                    onClearFilters={handleClearFilters}
                />
            </div>
        </div>
    );
}

export default memo(Foods);
