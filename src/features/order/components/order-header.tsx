import { memo } from 'react';

export interface OrderHeaderProps {
    slugId: string;
    totalAmount: number;
    deliveryStatus: string;
    orderDate: string;
}

function OrderHeader({ slugId, totalAmount, deliveryStatus, orderDate }: OrderHeaderProps) {
    return (
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
                <h1 className='mb-2 text-3xl font-bold'>Order Details</h1>
                <p className='text-muted-foreground'>Order ID: {slugId}</p>
                <p className='text-sm text-muted-foreground'>{orderDate}</p>
            </div>
            <div className='text-right'>
                <div className='text-2xl font-bold'>${totalAmount.toFixed(2)}</div>
                <div className='text-sm text-muted-foreground capitalize'>{deliveryStatus}</div>
            </div>
        </div>
    );
}

export default memo(OrderHeader);
