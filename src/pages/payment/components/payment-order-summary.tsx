import { memo } from 'react';

import { formatVnd } from '@/app/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import { CartItemViewModel } from '@/features/cart/models';
import { getFoodPricing } from '@/features/food';

interface PaymentOrderSummaryProps {
    items: CartItemViewModel[];
    totalPrice: number;
}

function PaymentOrderSummary({ items, totalPrice }: PaymentOrderSummaryProps) {
    return (
        <Card className='lg:sticky lg:top-24'>
            <CardHeader className='pb-2'>
                <CardTitle className='text-base'>Order summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='divide-y'>
                    {items.map(item => {
                        const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
                        const surcharge = item.totalSurcharge ?? 0;
                        const itemTotal = (effectivePrice + surcharge) * item.quantity;

                        const customisationLabel = (item.customisations ?? [])
                            .map(c => c.optionLabel)
                            .filter(label => label != null && label !== '')
                            .join(', ');

                        return (
                            <div key={item.id} className='flex items-start justify-between py-2.5'>
                                <div>
                                    <p className='text-sm font-medium text-foreground'>{item.name}</p>
                                    {customisationLabel !== '' && (
                                        <p className='text-xs text-muted-foreground'>
                                            {customisationLabel}
                                            {surcharge > 0 && (
                                                <span className='ml-1 text-primary'>+{formatVnd(surcharge)}</span>
                                            )}
                                        </p>
                                    )}
                                    <p className='text-xs text-muted-foreground'>× {item.quantity}</p>
                                </div>
                                <span className='text-sm font-semibold'>{formatVnd(itemTotal)}</span>
                            </div>
                        );
                    })}
                </div>

                <Separator />

                <div className='flex justify-between font-bold text-base'>
                    <span>Total</span>
                    <span className='text-primary'>{formatVnd(totalPrice)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(PaymentOrderSummary);
