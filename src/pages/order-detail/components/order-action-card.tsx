import { Clock } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { formatVnd } from '@/app/utils';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import Spinner from '@/components/spinner';
import {
    DELIVERY_STATUS,
    DeliveryStatusEnum,
    RefundStatusPanel,
    shouldShowRefundRequest,
    type DeliveryStatusConfig,
    type RefundSummaryViewModel,
} from '@/features/order';

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
    totalAmount: number;
    paymentMethod: string;
    deliveredCompletedAt: string | null;
    refund: RefundSummaryViewModel | null;
    onConfirmCancel?: () => void;
    isCancelling?: boolean;
    onConfirmRefund?: () => void;
    isRequestingRefund?: boolean;
}

function OrderActionCard({
    slugId,
    orderDate,
    deliveryStatus,
    totalAmount,
    paymentMethod,
    deliveredCompletedAt,
    refund,
    onConfirmCancel,
    isCancelling = false,
    onConfirmRefund,
    isRequestingRefund = false,
}: OrderActionCardProps) {
    const { t } = useTranslation();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showRefundDialog, setShowRefundDialog] = useState(false);
    const statusInfo = getDeliveryStatusInfo(deliveryStatus);
    const StatusIcon = statusInfo.icon;

    const showRefundRequest =
        !!onConfirmRefund &&
        shouldShowRefundRequest({
            paymentMethod,
            deliveryStatus,
            deliveredCompletedAt,
            hasRefund: !!refund,
        });

    const handleCancelClick = useCallback(() => {
        setShowCancelDialog(true);
    }, []);

    const handleKeepOrderClick = useCallback(() => {
        setShowCancelDialog(false);
    }, []);

    const handleConfirmCancel = useCallback(() => {
        onConfirmCancel?.();
    }, [onConfirmCancel]);

    const handleRequestRefundClick = useCallback(() => {
        setShowRefundDialog(true);
    }, []);

    const handleRefundNotNowClick = useCallback(() => {
        setShowRefundDialog(false);
    }, []);

    const handleConfirmRefund = useCallback(() => {
        onConfirmRefund?.();
    }, [onConfirmRefund]);

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

                    {refund ? (
                        <RefundStatusPanel
                            status={refund.status}
                            amount={refund.amount}
                            sentDate={refund.paidAt}
                            transferReference={null}
                        />
                    ) : showRefundRequest ? (
                        <>
                            <Button
                                variant='outline'
                                size='lg'
                                className='w-full'
                                onClick={handleRequestRefundClick}
                                disabled={isRequestingRefund}
                            >
                                {isRequestingRefund ? (
                                    <>
                                        <Spinner size='sm' />
                                        {t('orderDetail.requesting')}
                                    </>
                                ) : (
                                    t('orderDetail.requestRefund')
                                )}
                            </Button>
                            <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t('orderDetail.requestRefundConfirmTitle')}</DialogTitle>
                                        <DialogDescription>
                                            {t('orderDetail.requestRefundConfirmDescription', {
                                                amount: formatVnd(totalAmount),
                                            })}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant='outline'
                                            onClick={handleRefundNotNowClick}
                                            disabled={isRequestingRefund}
                                        >
                                            {t('orderDetail.requestRefundNotNow')}
                                        </Button>
                                        <Button onClick={handleConfirmRefund} disabled={isRequestingRefund}>
                                            {isRequestingRefund
                                                ? t('orderDetail.requesting')
                                                : t('orderDetail.requestRefund')}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(OrderActionCard);
