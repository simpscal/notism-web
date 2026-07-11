import { memo } from 'react';

import { Skeleton } from '@/components/skeleton';

function FoodCardSkeleton() {
    return <Skeleton className='aspect-[4/5] w-full rounded-[20px]' />;
}

export default memo(FoodCardSkeleton);
