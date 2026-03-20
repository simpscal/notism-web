import { ShieldCheck, Star, Truck } from 'lucide-react';
import { memo } from 'react';

import { Card } from '@/components/card';

export interface CheckoutTrustBarProps {
    className?: string;
}

function CheckoutTrustBar({ className }: CheckoutTrustBarProps) {
    return (
        <Card className={['px-4 py-3', className].filter(Boolean).join(' ')}>
            <div className='grid gap-3 sm:grid-cols-3 sm:items-center'>
                <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground'>
                        <ShieldCheck className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>Secure checkout</div>
                        <div className='text-xs text-muted-foreground'>Protected payment processing</div>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground'>
                        <Truck className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>Fast delivery</div>
                        <div className='text-xs text-muted-foreground'>Reliable order fulfillment</div>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground'>
                        <Star className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>Trusted by customers</div>
                        <div className='text-xs text-muted-foreground'>Top-rated shopping experience</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default memo(CheckoutTrustBar);
