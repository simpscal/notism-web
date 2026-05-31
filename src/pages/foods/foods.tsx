import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FoodsControlBar, FoodsGrid, FoodsHeroSection } from './components';
import { FoodSortOption } from './enums';

import { ListItemModel } from '@/app/models';
import { useAppSelector } from '@/core/hooks';

function Foods() {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategory = searchParams.get('category');
    const keyword = searchParams.get('keyword') || '';

    const [searchInput, setSearchInput] = useState(keyword);
    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState<FoodSortOption>('default');

    const storeCategories = useAppSelector(state => state.food.categories);
    const categories: ListItemModel[] = useMemo(
        () => storeCategories.map(c => ({ value: c.id, label: c.name })),
        [storeCategories]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInput !== keyword) {
                const params = new URLSearchParams(searchParams);
                if (searchInput) {
                    params.set('keyword', searchInput);
                } else {
                    params.delete('keyword');
                }
                setSearchParams(params);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput, keyword, searchParams, setSearchParams]);

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
        setSearchInput('');
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
            <FoodsHeroSection searchInput={searchInput} onSearchChange={setSearchInput} />

            <div className='container mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-10'>
                <FoodsControlBar
                    categories={categories}
                    selectedCategory={selectedCategory}
                    sortBy={sortBy}
                    keyword={keyword}
                    totalCount={totalCount}
                    onCategoryChange={handleCategoryChange}
                    onSortChange={handleSortChange}
                    onClearFilters={handleClearFilters}
                />

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
