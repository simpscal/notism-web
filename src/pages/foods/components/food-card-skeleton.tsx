import { memo } from 'react';

import { Card, CardFooter, CardHeader } from '@/components/card';
import { Skeleton } from '@/components/skeleton';

function FoodCardSkeleton() {
    return (
        <Card className='group relative flex flex-col overflow-hidden pt-0'>
            {/* Image skeleton */}
            <div className='relative aspect-[4/3] overflow-hidden'>
                <Skeleton className='h-full w-full' />
            </div>

            {/* Content skeleton */}
            <CardHeader className='flex-1 pb-4'>
                <div className='mb-2 flex items-center justify-between gap-2'>
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-5 w-16' />
                </div>
                <div className='mb-3'>
                    <Skeleton className='mb-1 h-4 w-full' />
                    <Skeleton className='h-4 w-2/3' />
                </div>
                <div className='flex flex-wrap items-center gap-4'>
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-4 w-20' />
                </div>
            </CardHeader>

            {/* Price & Actions skeleton */}
            <CardFooter className='flex items-end justify-between gap-4 pt-0'>
                <Skeleton className='h-8 w-20' />
                <div className='flex gap-2'>
                    <Skeleton className='h-9 w-20' />
                    <Skeleton className='h-9 w-16' />
                </div>
            </CardFooter>
        </Card>
    );
}

export default memo(FoodCardSkeleton);
