import { memo } from 'react';

import { Card, CardFooter } from '@/components/card';
import { Skeleton } from '@/components/skeleton';

function FoodCardSkeleton() {
    return (
        <Card className='relative flex flex-col overflow-hidden pt-0'>
            {/* Square image skeleton */}
            <div className='relative aspect-square overflow-hidden'>
                <Skeleton className='h-full w-full' />
            </div>

            {/* Content skeleton */}
            <CardFooter className='flex flex-1 flex-col gap-3 p-3 sm:p-4'>
                <div className='w-full flex-1'>
                    <Skeleton className='mb-1.5 h-5 w-4/5' />
                    <Skeleton className='mb-1 h-3.5 w-full' />
                    <Skeleton className='h-3.5 w-3/5' />
                </div>
                <div className='flex w-full items-center justify-between'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-8 w-20 rounded-md' />
                </div>
            </CardFooter>
        </Card>
    );
}

export default memo(FoodCardSkeleton);
