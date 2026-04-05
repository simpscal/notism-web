import { memo, useCallback } from 'react';

import { AdminOrderResponseModel } from '@/apis/models';
import { Badge } from '@/components/badge';
import { Card, CardContent } from '@/components/card';
import { OrderPaymentStatusBadge } from '@/features/order';

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
                            ${order.totalAmount.toFixed(2)}
                        </Badge>
                    </div>
                    <OrderPaymentStatusBadge paymentStatus={order.paymentStatus} />
                    <div className='text-xs text-muted-foreground'>
                        <div>{order.userName}</div>
                        <div>{order.userEmail}</div>
                    </div>
                    <div className='text-xs text-muted-foreground'>
                        {order.totalItems} item{order.totalItems !== 1 ? 's' : ''}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(AdminOrderCard);
