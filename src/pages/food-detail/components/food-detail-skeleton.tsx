import { memo } from 'react';

import { Skeleton } from '@/components/skeleton';

function FoodDetailSkeleton() {
    return (
        <div className='bg-background'>
            <div className='container mx-auto px-4 py-8'>
                <Skeleton className='mb-8 h-10 w-32' />
                <div className='grid gap-8 lg:grid-cols-2 lg:gap-12'>
                    {/* Image skeleton */}
                    <div className='relative'>
                        <Skeleton className='aspect-square w-full rounded-3xl' />
                    </div>

                    {/* Details skeleton */}
                    <div className='flex flex-col space-y-6'>
                        <Skeleton className='h-6 w-24' />
                        <Skeleton className='h-12 w-3/4' />
                        <div className='flex items-center gap-2'>
                            <div className='flex gap-0.5'>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className='h-5 w-5' />
                                ))}
                            </div>
                            <Skeleton className='h-4 w-24' />
                        </div>
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-4 w-3/4' />
                        </div>
                        <div className='flex flex-wrap gap-4'>
                            <Skeleton className='h-10 w-32' />
                            <Skeleton className='h-10 w-32' />
                        </div>
                        <div>
                            <Skeleton className='mb-2 h-6 w-24' />
                            <Skeleton className='h-12 w-40' />
                        </div>
                        <div className='mt-auto flex flex-col gap-4 sm:flex-row sm:items-center'>
                            <Skeleton className='h-14 w-32' />
                            <Skeleton className='h-14 flex-1' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(FoodDetailSkeleton);
