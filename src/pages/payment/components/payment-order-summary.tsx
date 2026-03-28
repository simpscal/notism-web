import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import { CartItemViewModel } from '@/features/cart/models';
import { getFoodPricing } from '@/features/food';
import { FoodImage } from '@/features/food/components';

interface PaymentOrderSummaryProps {
    items: CartItemViewModel[];
    totalPrice: number;
}

function PaymentOrderSummary({ items, totalPrice }: PaymentOrderSummaryProps) {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('payment.orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-3'>
                    {items.map(item => {
                        const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
                        const itemTotal = effectivePrice * item.quantity;

                        return (
                            <div key={item.id} className='flex items-center gap-3 text-sm'>
                                <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted'>
                                    <FoodImage
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className='h-full w-full object-cover'
                                    />
                                </div>
                                <span className='min-w-0 flex-1 truncate text-muted-foreground'>
                                    {item.name} ×{item.quantity}
                                </span>
                                <span className='shrink-0 font-medium'>${itemTotal.toFixed(2)}</span>
                            </div>
                        );
                    })}
                </div>

                <Separator />

                <div className='flex justify-between text-xl font-black'>
                    <span>{t('payment.totalAmount')}</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(PaymentOrderSummary);
