import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CategoryFilter, FoodsGrid, FoodsHeroSection } from './components';

import { ListItemModel } from '@/app/models';
import { useAppSelector } from '@/core/hooks';

function Foods() {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategory = searchParams.get('category');
    const keyword = searchParams.get('keyword') || '';

    const [searchInput, setSearchInput] = useState(keyword);
    const [totalCount, setTotalCount] = useState(0);

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

    return (
        <div className='bg-background'>
            <FoodsHeroSection
                searchInput={searchInput}
                onSearchChange={setSearchInput}
                totalCount={totalCount}
                categoriesCount={categories.length}
            />

            <section className='container mx-auto max-w-7xl px-4 py-4 sm:py-6 md:py-8 lg:py-12'>
                <div className='mb-4 sm:mb-6 md:mb-8 lg:mb-10'>
                    <h2 className='mb-3 text-base font-semibold sm:mb-4 sm:text-lg lg:text-xl'>Categories</h2>
                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                    />
                </div>

                <FoodsGrid
                    category={selectedCategory}
                    keyword={keyword}
                    onTotalCountChange={handleTotalCountChange}
                    onClearFilters={handleClearFilters}
                />
            </section>
        </div>
    );
}

export default memo(Foods);
