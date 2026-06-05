import { memo } from 'react';

import { Skeleton } from '@/components/skeleton';

function FoodDetailSkeleton() {
    return (
        <div className='bg-background'>
            <div className='container mx-auto px-4 py-8'>
                {/* Back link skeleton */}
                <Skeleton className='mb-8 h-8 w-32' />

                <div className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
                    {/* Image skeleton */}
                    <Skeleton className='aspect-[4/5] w-full rounded-3xl' />

                    {/* Details skeleton */}
                    <div className='flex flex-col space-y-6'>
                        {/* Category chip */}
                        <Skeleton className='h-4 w-24' />

                        {/* Title */}
                        <Skeleton className='h-12 w-3/4' />

                        {/* Description lines */}
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-3/4' />
                        </div>

                        {/* Meta pills */}
                        <div className='flex flex-wrap gap-3'>
                            <Skeleton className='h-8 w-28 rounded-full' />
                            <Skeleton className='h-8 w-28 rounded-full' />
                        </div>

                        {/* Price */}
                        <Skeleton className='h-14 w-48' />

                        {/* CTA row */}
                        <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <Skeleton className='h-10 w-32 rounded-full' />
                            <Skeleton className='h-10 flex-1 rounded-full' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(FoodDetailSkeleton);
