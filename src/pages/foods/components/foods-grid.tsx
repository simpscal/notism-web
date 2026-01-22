import { useInfiniteQuery } from '@tanstack/react-query';
import { UtensilsCrossed } from 'lucide-react';
import { memo, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { FoodItemViewModel } from '../models';

import FoodCard from './food-card';
import FoodCardSkeleton from './food-card-skeleton';

import { foodApi } from '@/apis';
import { PAGE_SIZE, ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import Spinner from '@/components/spinner';

interface FoodsGridProps {
    category: string | null;
    keyword: string;
    onTotalCountChange?: (count: number) => void;
    onClearFilters: () => void;
}

function FoodsGrid({ category, keyword, onTotalCountChange, onClearFilters }: FoodsGridProps) {
    const navigate = useNavigate();
    const { ref: loadMoreRef, inView } = useInView();

    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteQuery({
        queryKey: ['foods', 'infinite', { category, keyword }] as const,
        queryFn: ({ pageParam = 0 }) =>
            foodApi.getFoods({
                skip: pageParam,
                take: PAGE_SIZE,
                category: category || undefined,
                keyword: keyword || undefined,
            }),
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((acc, page) => acc + page.items.length, 0);
            return loadedCount < lastPage.totalCount ? loadedCount : undefined;
        },
        initialPageParam: 0,
    });

    const foods = data?.pages.flatMap(page => page.items) ?? [];
    const totalCount = data?.pages[0]?.totalCount ?? 0;

    useEffect(() => {
        onTotalCountChange?.(totalCount);
    }, [totalCount, onTotalCountChange]);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleAddToCart = useCallback((food: FoodItemViewModel) => {
        toast.success(`${food.name} added to cart!`, {
            description: `$${(food.discountPrice ?? food.price).toFixed(2)}`,
        });
    }, []);

    const handleViewDetails = useCallback(
        (food: FoodItemViewModel) => {
            navigate(`/${ROUTES.FOODS.DETAIL(food.id)}`);
        },
        [navigate]
    );

    if (isLoading) {
        return (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {Array.from({ length: PAGE_SIZE }).map((_, index) => (
                    <FoodCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    if (foods.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center py-20 text-center'>
                <div className='mb-4 rounded-full p-6'>
                    <UtensilsCrossed className='h-12 w-12' />
                </div>
                <h3 className='mb-2 text-xl font-semibold'>No dishes found</h3>
                <p className='mb-6'>We couldn't find any dishes matching your criteria. Try adjusting your filters.</p>

                <Button variant='outline' onClick={onClearFilters}>
                    Clear all filters
                </Button>
            </div>
        );
    }

    return (
        <>
            {/* Food Grid */}
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {foods.map(food => (
                    <FoodCard
                        key={food.id}
                        food={food}
                        onAddToCart={handleAddToCart}
                        onViewDetails={handleViewDetails}
                    />
                ))}
            </div>

            {/* Load More Trigger */}
            {hasNextPage && (
                <div ref={loadMoreRef} className='mt-8 flex justify-center'>
                    {isFetchingNextPage && <Spinner size='md' />}
                </div>
            )}
        </>
    );
}

export default memo(FoodsGrid);
