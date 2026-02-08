import { memo, useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CategoryFilter, FoodsGrid, FoodsHeroSection } from './components';

import { FOOD_CATEGORIES } from '@/features/food/constants';

function Foods() {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategory = searchParams.get('category');
    const keyword = searchParams.get('keyword') || '';

    const [searchInput, setSearchInput] = useState(keyword);
    const [totalCount, setTotalCount] = useState(0);

    const categories = FOOD_CATEGORIES;

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
        <div className='min-h-screen'>
            <FoodsHeroSection
                searchInput={searchInput}
                onSearchChange={setSearchInput}
                totalCount={totalCount}
                categoriesCount={categories.length}
            />

            <section className='container mx-auto px-4 py-8 md:py-12'>
                <div className='mb-8'>
                    <h2 className='mb-4 text-lg font-semibold'>Categories</h2>
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
