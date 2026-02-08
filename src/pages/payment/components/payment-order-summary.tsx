import { memo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import { CartItemViewModel } from '@/features/cart/models';

interface PaymentOrderSummaryProps {
    items: CartItemViewModel[];
    totalPrice: number;
}

function PaymentOrderSummary({ items, totalPrice }: PaymentOrderSummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-2'>
                    {items.map(item => {
                        const hasDiscount = item.discountPrice !== null && item.discountPrice < item.price;
                        const effectivePrice = hasDiscount ? item.discountPrice! : item.price;
                        const itemTotal = effectivePrice * item.quantity;

                        return (
                            <div key={item.id} className='flex justify-between text-sm'>
                                <span className='text-muted-foreground'>
                                    {item.name} x{item.quantity}
                                </span>
                                <span className='font-medium'>${itemTotal.toFixed(2)}</span>
                            </div>
                        );
                    })}
                </div>

                <Separator />

                <div className='space-y-2'>
                    <div className='flex justify-between text-lg font-semibold'>
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(PaymentOrderSummary);
