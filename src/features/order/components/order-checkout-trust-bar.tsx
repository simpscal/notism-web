import { ShieldCheck, Star, Truck } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/app/utils/tailwind.utils';

export interface OrderCheckoutTrustBarProps {
    className?: string;
}

function OrderCheckoutTrustBar({ className }: OrderCheckoutTrustBarProps) {
    const { t } = useTranslation();

    return (
        <div className={cn('rounded-xl bg-primary/5 px-4 py-3', className)}>
            <div className='grid gap-3 sm:grid-cols-3 sm:items-center'>
                <div className='flex items-center gap-3'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <ShieldCheck className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>{t('order.checkout.trustBar.secureTitle')}</div>
                        <div className='text-xs text-muted-foreground'>{t('order.checkout.trustBar.secureDesc')}</div>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Truck className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>{t('order.checkout.trustBar.fastDeliveryTitle')}</div>
                        <div className='text-xs text-muted-foreground'>
                            {t('order.checkout.trustBar.fastDeliveryDesc')}
                        </div>
                    </div>
                </div>

                <div className='flex items-center gap-3'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                        <Star className='h-5 w-5' />
                    </div>
                    <div className='min-w-0'>
                        <div className='text-sm font-semibold'>{t('order.checkout.trustBar.trustedTitle')}</div>
                        <div className='text-xs text-muted-foreground'>{t('order.checkout.trustBar.trustedDesc')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(OrderCheckoutTrustBar);
