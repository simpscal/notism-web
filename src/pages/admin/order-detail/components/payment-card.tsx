import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { adminApi } from '@/apis';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import type { AdminOrderDetailViewModel } from '@/features/admin';
import { PAYMENT_STATUS_OPTIONS, PaymentStatusBadge, PaymentStatusEnum } from '@/features/payment';

interface PaymentCardProps {
    /** Order id used by the PATCH endpoint. */
    orderId: string;
    /** Slug id used as the detail query cache key (matches the route param). */
    slugId: string;
    /** Current persisted payment status. */
    paymentStatus: string;
    /** Payment method — display only; the change is allowed for any method. */
    paymentMethod: string;
}

function PaymentCard({ orderId, slugId, paymentStatus, paymentMethod }: PaymentCardProps) {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // The status the badge / control reflects. Optimistically updated on mutate,
    // reverted on error, reconciled from the server on success.
    const [status, setStatus] = useState<string>(paymentStatus);
    // Pending status awaiting confirmation; non-null drives the dialog open.
    const [pendingStatus, setPendingStatus] = useState<string | null>(null);

    const detailQueryKey = ['admin', 'orders', 'detail', slugId] as const;

    const { mutate, isPending } = useMutation({
        mutationFn: (nextStatus: string) => adminApi.updateOrderPaymentStatus(orderId, { paymentStatus: nextStatus }),
        onMutate: (nextStatus: string) => {
            const previousStatus = status;
            // Optimistic — the badge reflects the new status immediately.
            setStatus(nextStatus);
            return { previousStatus };
        },
        onError: (_error, _nextStatus, context) => {
            // Revert the badge to its previous value and surface a destructive toast.
            if (context) {
                setStatus(context.previousStatus);
            }
            toast.error(t('admin.orders.paymentStatus.updateError'));
        },
        onSuccess: updatedOrder => {
            setStatus(updatedOrder.paymentStatus);
            // Reconcile the detail cache so a refetch is not required.
            queryClient.setQueryData<AdminOrderDetailViewModel>(detailQueryKey, oldData =>
                oldData ? { ...oldData, paymentStatus: updatedOrder.paymentStatus } : oldData
            );
        },
    });

    const handleSelect = useCallback(
        (next: string) => {
            // Selecting the current status is a no-op — no dialog, no request.
            if (next === status) return;
            setPendingStatus(next);
        },
        [status]
    );

    const handleCancel = useCallback(() => {
        setPendingStatus(null);
    }, []);

    const handleConfirm = useCallback(() => {
        if (pendingStatus === null) return;
        const next = pendingStatus;
        setPendingStatus(null);
        mutate(next);
    }, [mutate, pendingStatus]);

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
                    <PaymentStatusBadge paymentStatus={status as PaymentStatusEnum} />
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
                    <Select value={status} onValueChange={handleSelect} disabled={isPending}>
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
                                from: t(`admin.orders.paymentStatus.options.${status}`),
                                to: pendingStatus ? t(`admin.orders.paymentStatus.options.${pendingStatus}`) : '',
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
