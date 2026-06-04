import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';

export default function FoodDetailSkeleton() {
    return (
        <div className='mx-auto max-w-4xl'>
            <div className='mb-8 flex items-start justify-between'>
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-8 w-56' />
                    <Skeleton className='h-4 w-36' />
                </div>
                <Skeleton className='h-8 w-24 rounded-md' />
            </div>
            <Separator className='mb-8' />
            <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <div className='space-y-1'>
                        <Skeleton className='h-5 w-48' />
                        <Skeleton className='h-3 w-28' />
                    </div>
                    <Skeleton className='h-8 w-28 rounded-md' />
                </div>
                {[2, 3].map(n => (
                    <div key={n} className='overflow-hidden rounded-lg border'>
                        <div className='flex items-center justify-between bg-muted/40 px-4 py-3'>
                            <Skeleton className='h-5 w-32' />
                            <div className='flex gap-2'>
                                <Skeleton className='h-7 w-24 rounded-md' />
                                <Skeleton className='h-7 w-7 rounded-md' />
                            </div>
                        </div>
                        <div className='divide-y'>
                            {Array.from({ length: n }).map((_, i) => (
                                <div key={i} className='flex items-center justify-between px-4 py-3'>
                                    <Skeleton className='h-4 w-40' />
                                    <Skeleton className='h-4 w-16' />
                                    <Skeleton className='h-7 w-7 rounded-md' />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
