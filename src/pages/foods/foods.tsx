import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { FoodsGrid, FoodsHeroSection, FoodsSidebar, FoodsToolbar } from './components';
import { FoodSortOption } from './enums';

import { ListItemModel } from '@/app/models';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/sheet';
import { useAppSelector } from '@/core/hooks';

function Foods() {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategory = searchParams.get('category');
    const keyword = searchParams.get('keyword') || '';

    const [searchInput, setSearchInput] = useState(keyword);
    const [totalCount, setTotalCount] = useState(0);
    const [sortBy, setSortBy] = useState<FoodSortOption>('default');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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
            setMobileFiltersOpen(false);
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
        setMobileFiltersOpen(false);
    }, []);

    return (
        <div className='bg-background'>
            <FoodsHeroSection searchInput={searchInput} onSearchChange={setSearchInput} />

            <div className='container mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:py-10'>
                <div className='flex gap-8'>
                    {/* Desktop sticky sidebar */}
                    <aside className='hidden w-56 shrink-0 lg:block'>
                        <div className='sticky top-6'>
                            <FoodsSidebar
                                categories={categories}
                                selectedCategory={selectedCategory}
                                sortBy={sortBy}
                                onCategoryChange={handleCategoryChange}
                                onSortChange={handleSortChange}
                            />
                        </div>
                    </aside>

                    {/* Main content */}
                    <div className='min-w-0 flex-1'>
                        <FoodsToolbar
                            totalCount={totalCount}
                            selectedCategory={selectedCategory}
                            keyword={keyword}
                            onClearFilters={handleClearFilters}
                            onMobileFiltersOpen={() => setMobileFiltersOpen(true)}
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
            </div>

            {/* Mobile filters sheet */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetContent side='left' className='w-72 p-0'>
                    <SheetHeader className='border-b px-5 py-4'>
                        <SheetTitle>Filters &amp; Sort</SheetTitle>
                    </SheetHeader>
                    <div className='overflow-y-auto p-5'>
                        <FoodsSidebar
                            categories={categories}
                            selectedCategory={selectedCategory}
                            sortBy={sortBy}
                            onCategoryChange={handleCategoryChange}
                            onSortChange={handleSortChange}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default memo(Foods);
