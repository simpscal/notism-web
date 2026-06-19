import { StickyNote } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import type { OrderItemModel } from '@/apis';
import { formatVnd } from '@/app/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import { FoodImage, getFoodPricing } from '@/features/food';

interface OrderItemsCardProps {
    items: OrderItemModel[];
    paymentMethod: string;
    totalAmount: number;
    deliveryNotes: string | null;
}

function OrderItemsCard({ items, paymentMethod, totalAmount, deliveryNotes }: OrderItemsCardProps) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('orderDetail.orderItems')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-4'>
                    {items.map(item => {
                        const unitPrice = item.unitPrice ?? 0;
                        const { effectivePrice, hasSavings } = getFoodPricing(unitPrice, item.discountPrice);
                        const surchargeInclusiveUnitPrice = effectivePrice + (item.surcharge ?? 0);

                        return (
                            <div key={item.id} className='flex gap-4'>
                                <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted'>
                                    <FoodImage
                                        src={item.imageUrl}
                                        alt={item.foodName}
                                        className='h-full w-full object-cover'
                                    />
                                </div>
                                <div className='flex-1'>
                                    <div className='font-medium'>{item.foodName}</div>
                                    {item.customisationLabel && (
                                        <div className='text-sm text-muted-foreground'>{item.customisationLabel}</div>
                                    )}
                                    <div className='text-sm text-muted-foreground'>
                                        {t('orderDetail.quantity')} {item.quantity}
                                    </div>
                                    <div className='mt-1 flex items-center gap-2'>
                                        {hasSavings && item.unitPrice != null && (
                                            <span className='text-xs text-muted-foreground line-through'>
                                                {formatVnd(item.unitPrice)}
                                            </span>
                                        )}
                                        <span className='font-bold'>{formatVnd(surchargeInclusiveUnitPrice)}</span>
                                        <span className='text-xs text-muted-foreground'>{t('orderDetail.each')}</span>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <div className='font-bold'>{formatVnd(item.totalPrice ?? 0)}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <Separator />

                <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>{t('orderDetail.paymentMethod')}</span>
                        <span className='font-medium capitalize'>{paymentMethod}</span>
                    </div>
                    {deliveryNotes && (
                        <div className='flex items-start gap-1.5 text-sm'>
                            <StickyNote className='mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground' />
                            <span className='text-muted-foreground'>{deliveryNotes}</span>
                        </div>
                    )}
                    <div className='flex justify-between text-xl font-black'>
                        <span>{t('orderDetail.total')}</span>
                        <span>{formatVnd(totalAmount)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(OrderItemsCard);
