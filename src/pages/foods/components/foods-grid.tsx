import { useInfiniteQuery } from '@tanstack/react-query';
import { memo, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { toast } from 'sonner';

import { FoodItemViewModel } from '../models';

import FoodCard from './food-card';
import FoodCardSkeleton from './food-card-skeleton';
import FoodsEmpty from './foods-empty';

import { foodApi } from '@/apis';
import { PAGE_SIZE } from '@/app/constants';
import Spinner from '@/components/spinner';
import { CartItemViewModel, useCart } from '@/features/cart';

interface FoodsGridProps {
    category: string | null;
    keyword: string;
    onTotalCountChange?: (count: number) => void;
    onClearFilters: () => void;
}

function FoodsGrid({ category, keyword, onTotalCountChange, onClearFilters }: FoodsGridProps) {
    const { addToCart } = useCart();
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

    const handleAddToCart = useCallback(
        async (food: FoodItemViewModel) => {
            const effectivePrice = food.discountPrice ?? food.price;
            const cartItem: Omit<CartItemViewModel, 'quantity'> = {
                id: food.id,
                name: food.name,
                description: food.description,
                price: food.price,
                discountPrice: food.discountPrice,
                imageUrl: food.imageUrl,
                category: food.category,
                stockQuantity: food.stockQuantity,
                quantityUnit: food.quantityUnit,
            };

            await addToCart(cartItem, 1);
            toast.success(`${food.name} added to cart!`, {
                description: `$${effectivePrice.toFixed(2)}`,
            });
        },
        [addToCart]
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
        return <FoodsEmpty onClearFilters={onClearFilters} />;
    }

    return (
        <>
            {/* Food Grid */}
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {foods.map(food => (
                    <FoodCard key={food.id} food={food} onAddToCart={handleAddToCart} />
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
