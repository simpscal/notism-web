import { memo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { DELIVERY_STATUS, DeliveryStatusEnum } from '@/features/order';

const getDeliveryStatusLabel = (status: string): string => {
    const step = DELIVERY_STATUS.find(s => s.key === status);
    return step?.label || status;
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
                <div className='space-y-2 text-sm'>
                    <div>
                        <div className='text-muted-foreground'>Order ID</div>
                        <div className='font-medium'>{slugId}</div>
                    </div>
                    <div>
                        <div className='text-muted-foreground'>Placed on</div>
                        <div className='font-medium'>{orderDate}</div>
                    </div>
                    <div>
                        <div className='text-muted-foreground'>Status</div>
                        <div className='font-medium'>{getDeliveryStatusLabel(deliveryStatus)}</div>
                    </div>
                </div>
            </CardContent>
            <CardContent className='pt-0'>
                <div className='space-y-2'>
                    <Button size='lg' className='w-full' asChild>
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
