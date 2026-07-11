import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

import { FoodSortOption } from '../enums';

import FoodCard from './food-card';
import FoodsEmpty from './foods-empty';

import { FOOD_QUERY_KEYS, foodApi } from '@/apis';
import { PAGE_SIZE } from '@/app/constants';
import { Skeleton } from '@/components/skeleton';
import Spinner from '@/components/spinner';

interface FoodsGridProps {
    category: string | null;
    keyword: string;
    sortBy: FoodSortOption;
    onTotalCountChange?: (count: number) => void;
    onClearFilters: () => void;
}

const GRID_CLASSES = 'grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4';

function FoodsGrid({ category, keyword, sortBy, onTotalCountChange, onClearFilters }: FoodsGridProps) {
    const { ref: loadMoreRef, inView } = useInView();

    const sortParams = useMemo(() => {
        if (sortBy === 'price-asc') return { sortBy: 'price', sortOrder: 'asc' };
        if (sortBy === 'price-desc') return { sortBy: 'price', sortOrder: 'desc' };
        if (sortBy === 'name-asc') return { sortBy: 'name', sortOrder: 'asc' };
        return {};
    }, [sortBy]);

    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: FOOD_QUERY_KEYS.list({ category, keyword, sortBy, sortParams }),
        queryFn: ({ pageParam = 0 }) =>
            foodApi.getFoods({
                skip: pageParam,
                take: PAGE_SIZE,
                category: category || undefined,
                keyword: keyword || undefined,
                ...sortParams,
            }),
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((acc, page) => acc + page.items.length, 0);
            return loadedCount < lastPage.totalCount ? loadedCount : undefined;
        },
        initialPageParam: 0,
    });

    const totalCount = data?.pages[0]?.totalCount ?? 0;

    const foods = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data?.pages]);

    useEffect(() => {
        onTotalCountChange?.(totalCount);
    }, [totalCount, onTotalCountChange]);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className={GRID_CLASSES}>
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                    <Skeleton key={index} className='aspect-[4/5] w-full rounded-xl' />
                ))}
            </div>
        );
    }

    if (foods.length === 0) {
        return <FoodsEmpty onClearFilters={onClearFilters} />;
    }

    return (
        <>
            <div className={GRID_CLASSES}>
                {foods.map(food => (
                    <FoodCard key={food.id} food={food} />
                ))}
            </div>

            {hasNextPage && (
                <div ref={loadMoreRef} className='mt-6 flex justify-center sm:mt-8 lg:mt-10'>
                    {isFetchingNextPage && <Spinner size='md' />}
                </div>
            )}
        </>
    );
}

export default memo(FoodsGrid);
