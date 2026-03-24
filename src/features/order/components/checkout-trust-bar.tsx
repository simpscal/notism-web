import { ShieldCheck, Star, Truck } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@/app/utils/tailwind.utils';

export interface CheckoutTrustBarProps {
    className?: string;
}

function CheckoutTrustBar({ className }: CheckoutTrustBarProps) {
    return (
        <div className={cn('rounded-xl bg-primary/5 px-4 py-3', className)}>
            <div className='grid gap-3 sm:grid-cols-3 sm:items-center'>
                <div className='flex items-center gap-3'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <ShieldCheck className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>Secure checkout</div>
                        <div className='text-xs text-muted-foreground'>Protected payment processing</div>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Truck className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>Fast delivery</div>
                        <div className='text-xs text-muted-foreground'>Reliable order fulfillment</div>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Star className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>Trusted by customers</div>
                        <div className='text-xs text-muted-foreground'>Top-rated shopping experience</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(CheckoutTrustBar);
