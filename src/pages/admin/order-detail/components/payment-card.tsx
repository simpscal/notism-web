import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PAYMENT_STATUS_OPTIONS, PaymentStatusBadge, PaymentStatusType } from '@/features/order';
import { Button } from '@/uis/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/uis/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/uis/select';
import { Separator } from '@/uis/separator';
import Spinner from '@/uis/spinner';

interface PaymentCardProps {
    paymentStatus: string;
    paymentMethod: string;
    isPending: boolean;
    onConfirm: (next: string) => void;
}

function PaymentCard({ paymentStatus, paymentMethod, isPending, onConfirm }: PaymentCardProps) {
    const { t } = useTranslation();

    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    const handleSelect = useCallback(
        (next: string) => {
            if (next === paymentStatus) return;
            setPendingStatus(next);
        },
        [paymentStatus]
    );

    const handleCancel = useCallback(() => {
        setPendingStatus(null);
    }, []);

    const handleConfirm = useCallback(() => {
        if (pendingStatus === null) return;
        onConfirm(pendingStatus);
        setPendingStatus(null);
    }, [onConfirm, pendingStatus]);

    const handleDialogOpenChange = useCallback(
        (open: boolean) => {
            if (!open) handleCancel();
        },
        [handleCancel]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('admin.orderDetailPage.paymentMethod')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>{t('admin.orders.paymentStatus.currentStatus')}</span>
                    <PaymentStatusBadge paymentStatus={paymentStatus as PaymentStatusType} />
                </div>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>{t('admin.orders.paymentStatus.method')}</span>
                    <span className='font-medium capitalize'>{paymentMethod}</span>
                </div>

                <Separator />

                <div className='space-y-1.5'>
                    <label htmlFor='payment-status-select' className='text-sm font-medium'>
                        {t('admin.orders.paymentStatus.label')}
                    </label>
                    <Select value={paymentStatus} onValueChange={handleSelect} disabled={isPending}>
                        <SelectTrigger
                            id='payment-status-select'
                            className='w-full'
                            aria-label={t('admin.orders.paymentStatus.label')}
                        >
                            {isPending ? (
                                <span className='flex items-center gap-2 text-muted-foreground'>
                                    <Spinner size='sm' />
                                    {t('admin.orders.paymentStatus.saving')}
                                </span>
                            ) : (
                                <SelectValue />
                            )}
                        </SelectTrigger>
                        <SelectContent>
                            {PAYMENT_STATUS_OPTIONS.map(option => (
                                <SelectItem key={option.key} value={option.key}>
                                    {t(option.label)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>

            <Dialog open={pendingStatus !== null} onOpenChange={handleDialogOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('admin.orders.paymentStatus.dialog.title')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.orders.paymentStatus.dialog.description', {
                                from: t(`payment.statuses.${paymentStatus}`),
                                to: pendingStatus ? t(`payment.statuses.${pendingStatus}`) : '',
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCancel}>
                            {t('admin.orders.paymentStatus.dialog.cancel')}
                        </Button>
                        <Button onClick={handleConfirm}>{t('admin.orders.paymentStatus.dialog.confirm')}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default memo(PaymentCard);
