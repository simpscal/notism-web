import { CheckCircle2 } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatVnd } from '@/app/utils';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { Separator } from '@/components/separator';
import { CartItemViewModel } from '@/features/cart/models';
import { getFoodPricing } from '@/features/food';

export type PaymentSuccessMethod = 'cod' | 'banking';

export interface PaymentSuccessState {
    method: PaymentSuccessMethod;
    slugId: string;
    totalPrice: number;
}

interface PaymentSuccessProps {
    success: PaymentSuccessState;
    items: CartItemViewModel[];
    onTrackOrder: () => void;
    onBrowseMenu: () => void;
}

function PaymentSuccess({ success, items, onTrackOrder, onBrowseMenu }: PaymentSuccessProps) {
    const { t } = useTranslation();
    const isCod = success.method === 'cod';
    const { totalPrice, slugId } = success;

    return (
        <div>
            <div className='mb-8 flex flex-col items-center rounded-2xl bg-primary/5 px-6 py-10 text-center'>
                <CheckCircle2 className='mb-4 h-14 w-14 text-primary' />
                <h2 className='mb-1 text-2xl font-bold text-foreground'>
                    {isCod ? t('payment.success.codTitle') : t('payment.success.bankingTitle')}
                </h2>
                <p className='mb-3 text-sm text-muted-foreground'>
                    {isCod
                        ? t('payment.success.codMessage', { amount: formatVnd(totalPrice) })
                        : t('payment.success.bankingMessage', { amount: formatVnd(totalPrice) })}
                </p>
                <Badge variant='outline' className='font-mono text-sm'>
                    {slugId}
                </Badge>
            </div>
            <div className='mx-auto max-w-sm space-y-4'>
                <Card>
                    <CardContent className='space-y-3 pt-6'>
                        <div className='text-center'>
                            <p className='mb-1 text-xs uppercase tracking-widest text-muted-foreground'>
                                {isCod ? t('payment.success.amountDueOnDelivery') : t('payment.success.amountReceived')}
                            </p>
                            <p className='text-4xl font-bold text-primary tabular-nums'>{formatVnd(totalPrice)}</p>
                        </div>
                        <Separator />
                        <div className='space-y-1.5 text-sm'>
                            {items.map(item => {
                                const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
                                const surcharge = item.totalSurcharge ?? 0;
                                const itemTotal = (effectivePrice + surcharge) * item.quantity;
                                const customLabel = (item.customisations ?? [])
                                    .map(c => c.optionLabel)
                                    .filter(l => l)
                                    .join(', ');
                                return (
                                    <div key={item.id} className='flex justify-between text-muted-foreground'>
                                        <span>
                                            {item.name}
                                            {customLabel ? ` (${customLabel})` : ''} × {item.quantity}
                                        </span>
                                        <span>{formatVnd(itemTotal)}</span>
                                    </div>
                                );
                            })}
                            <Separator />
                            <div className='flex justify-between font-semibold text-foreground'>
                                <span>{t('payment.summary.total')}</span>
                                <span>{formatVnd(totalPrice)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className='flex gap-3'>
                    <Button variant='outline' className='flex-1' onClick={onTrackOrder}>
                        {t('payment.success.trackOrder')}
                    </Button>
                    <Button className='flex-1' onClick={onBrowseMenu}>
                        {t('payment.success.browseMenu')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default memo(PaymentSuccess);
