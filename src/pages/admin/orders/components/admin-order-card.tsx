import { StickyNote } from 'lucide-react';
import { memo, useCallback } from 'react';

import { AdminOrderResponseModel } from '@/apis/models';
import { formatVnd } from '@/app/utils';
import { Badge } from '@/components/badge';
import { Card, CardContent } from '@/components/card';
import { PaymentStatusBadge, PaymentStatusEnum } from '@/features/payment';

interface AdminOrderCardProps {
    order: AdminOrderResponseModel;
    onOrderClick: (orderId: string) => void;
}

function AdminOrderCard({ order, onOrderClick }: AdminOrderCardProps) {
    const handleClick = useCallback(() => {
        onOrderClick(order.slugId);
    }, [onOrderClick, order.slugId]);

    return (
        <Card className='hover:border-primary transition-colors' onClick={handleClick}>
            <CardContent className='p-4'>
                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <span className='font-semibold text-sm'>#{order.slugId}</span>
                        <Badge variant='outline' className='text-xs'>
                            {formatVnd(order.totalAmount)}
                        </Badge>
                    </div>
                    <PaymentStatusBadge paymentStatus={order.paymentStatus as PaymentStatusEnum} />
                    <div className='text-xs text-muted-foreground'>
                        <div>{order.userName}</div>
                        <div>{order.userEmail}</div>
                    </div>
                    <div className='text-xs text-muted-foreground'>
                        {order.totalItems} item{order.totalItems !== 1 ? 's' : ''}
                    </div>
                    {order.deliveryNote && (
                        <div className='flex items-start gap-1 text-xs text-muted-foreground'>
                            <StickyNote className='mt-0.5 h-3 w-3 shrink-0' />
                            <span className='line-clamp-2'>{order.deliveryNote}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(AdminOrderCard);
