import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { CartItemModel } from '@/apis';
import { formatVnd } from '@/app/utils';
import { getFoodPricing } from '@/features/food';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import { Separator } from '@/uis/separator';

interface PaymentOrderSummaryProps {
    items: CartItemModel[];
    totalPrice: number;
}

function PaymentOrderSummary({ items, totalPrice }: PaymentOrderSummaryProps) {
    const { t } = useTranslation();
    return (
        <Card className='lg:sticky lg:top-24'>
            <CardHeader className='pb-2'>
                <CardTitle className='text-base'>{t('payment.summary.title')}</CardTitle>
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
                    <span>{t('payment.summary.total')}</span>
                    <span className='text-primary'>{formatVnd(totalPrice)}</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(PaymentOrderSummary);
