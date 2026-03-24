import { Clock } from 'lucide-react';
import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { DELIVERY_STATUS, DeliveryStatusEnum, type DeliveryStatusConfig } from '@/features/order';

const getDeliveryStatusInfo = (status: string): DeliveryStatusConfig => {
    const step = DELIVERY_STATUS.find(s => s.key === status);
    return (
        step || {
            key: status as DeliveryStatusEnum,
            label: status,
            icon: Clock,
            colorClass: 'bg-secondary text-secondary-foreground border-secondary/50',
        }
    );
};

const canCancelOrder = (status: string) => {
    return status === DeliveryStatusEnum.Placed || status === DeliveryStatusEnum.Preparing;
};

export interface OrderActionCardProps {
    slugId: string;
    orderDate: string;
    deliveryStatus: string;
    onConfirmCancel?: () => void;
    isCancelling?: boolean;
}

function OrderActionCard({
    slugId,
    orderDate,
    deliveryStatus,
    onConfirmCancel,
    isCancelling = false,
}: OrderActionCardProps) {
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const statusInfo = getDeliveryStatusInfo(deliveryStatus);
    const StatusIcon = statusInfo.icon;

    const handleCancelClick = () => {
        setShowCancelDialog(true);
    };

    const handleConfirmCancel = () => {
        onConfirmCancel?.();
    };

    return (
        <Card className='sticky top-4'>
            <CardHeader>
                <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-3 text-sm'>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            Order ID
                        </div>
                        <div className='font-mono rounded bg-muted px-2 py-1 text-sm'>{slugId}</div>
                    </div>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            Placed on
                        </div>
                        <div className='font-medium'>{orderDate}</div>
                    </div>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            Status
                        </div>
                        <Badge variant='outline' className={`flex w-fit items-center gap-1.5 ${statusInfo.colorClass}`}>
                            <StatusIcon className='h-3 w-3' />
                            {statusInfo.label}
                        </Badge>
                    </div>
                </div>
            </CardContent>
            <CardContent className='pt-0'>
                <div className='space-y-2'>
                    <Button variant='default' size='lg' className='w-full' asChild>
                        <Link to={`/${ROUTES.FOODS.LIST}`}>Continue Shopping</Link>
                    </Button>
                    {canCancelOrder(deliveryStatus) && onConfirmCancel && (
                        <>
                            <Button
                                variant='outline'
                                size='lg'
                                className='w-full'
                                onClick={handleCancelClick}
                                disabled={isCancelling}
                            >
                                Cancel Order
                            </Button>
                            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Cancel Order</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to cancel this order? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant='outline'
                                            onClick={() => setShowCancelDialog(false)}
                                            disabled={isCancelling}
                                        >
                                            Keep Order
                                        </Button>
                                        <Button
                                            variant='destructive'
                                            onClick={handleConfirmCancel}
                                            disabled={isCancelling}
                                        >
                                            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(OrderActionCard);
