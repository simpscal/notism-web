import { Clock } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const statusInfo = getDeliveryStatusInfo(deliveryStatus);
    const StatusIcon = statusInfo.icon;

    const handleCancelClick = useCallback(() => {
        setShowCancelDialog(true);
    }, []);

    const handleKeepOrderClick = useCallback(() => {
        setShowCancelDialog(false);
    }, []);

    const handleConfirmCancel = useCallback(() => {
        onConfirmCancel?.();
    }, [onConfirmCancel]);

    return (
        <Card className='sticky top-4'>
            <CardHeader>
                <CardTitle>{t('orderDetail.orderInformation')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-3 text-sm'>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            {t('order.orderId')}
                        </div>
                        <div className='font-mono rounded bg-muted px-2 py-1 text-sm'>{slugId}</div>
                    </div>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            {t('orderDetail.placedOn')}
                        </div>
                        <div className='font-medium'>{orderDate}</div>
                    </div>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            {t('orderDetail.status')}
                        </div>
                        <Badge variant='outline' className={`flex w-fit items-center gap-1.5 ${statusInfo.colorClass}`}>
                            <StatusIcon className='h-3 w-3' />
                            {t(statusInfo.label)}
                        </Badge>
                    </div>
                </div>
            </CardContent>
            <CardContent className='pt-0'>
                <div className='space-y-2'>
                    <Button variant='default' size='lg' className='w-full' asChild>
                        <Link to={`/${ROUTES.FOODS.LIST}`}>{t('orderDetail.continueShopping')}</Link>
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
                                {t('orderDetail.cancelOrder')}
                            </Button>
                            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t('orderDetail.cancelConfirmTitle')}</DialogTitle>
                                        <DialogDescription>
                                            {t('orderDetail.cancelConfirmDescription')}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant='outline'
                                            onClick={handleKeepOrderClick}
                                            disabled={isCancelling}
                                        >
                                            {t('orderDetail.keepOrder')}
                                        </Button>
                                        <Button
                                            variant='destructive'
                                            onClick={handleConfirmCancel}
                                            disabled={isCancelling}
                                        >
                                            {isCancelling ? t('orderDetail.cancelling') : t('orderDetail.cancelOrder')}
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
