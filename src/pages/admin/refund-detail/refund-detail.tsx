import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import {
    RefundActionPanel,
    RefundFailureCard,
    RefundSummaryCard,
    RefundVietQrCard,
    TransferRecordCard,
} from './components';

import { adminApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import { Button } from '@/components/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import ErrorState from '@/components/error-state';
import Spinner from '@/components/spinner';
import { REFUND_QUERY_KEYS, RefundStatusEnum, type RefundDetailViewModel } from '@/features/order';
import { PaymentNotificationType, usePaymentSignalR, type PaymentSharedNotification } from '@/features/payment';

function AdminRefundDetail() {
    const { t, i18n } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [retryConfirmOpen, setRetryConfirmOpen] = useState(false);

    const {
        data: refund,
        isLoading,
        isError,
    } = useQuery({
        queryKey: REFUND_QUERY_KEYS.adminDetail(id!),
        queryFn: () => adminApi.getRefundById(id!),
        enabled: !!id,
    });

    const approveMutation = useMutation({
        mutationFn: () => adminApi.approveRefund(id!),
        onSuccess: approved => {
            queryClient.setQueryData<RefundDetailViewModel>(REFUND_QUERY_KEYS.adminDetail(id!), approved);
            void queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.adminDetail(id!) });
            void queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.adminList() });
            setConfirmOpen(false);
        },
    });

    const retryMutation = useMutation({
        mutationFn: () => adminApi.retryRefund(id!),
        onSuccess: retried => {
            queryClient.setQueryData<RefundDetailViewModel>(REFUND_QUERY_KEYS.adminDetail(id!), retried);
            void queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.adminDetail(id!) });
            void queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.adminList() });
            setRetryConfirmOpen(false);
        },
    });

    const handleRefundNotification = useCallback(
        (payload: PaymentSharedNotification) => {
            if (payload.type !== PaymentNotificationType.RefundStatusChanged || payload.refundId !== id) return;

            void queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.adminDetail(id!) });
            void queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.adminList() });
        },
        [id, queryClient]
    );

    usePaymentSignalR({ onNotification: handleRefundNotification });

    const createdDate = useMemo(() => {
        if (!refund) return '';
        return new Date(refund.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [refund, i18n.language]);

    const paidDate = useMemo(() => {
        if (!refund?.paidAt) return '';
        return new Date(refund.paidAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [refund, i18n.language]);

    const handleApproveClick = useCallback(() => {
        setConfirmOpen(true);
    }, []);

    const handleCancelApprove = useCallback(() => {
        setConfirmOpen(false);
    }, []);

    const { mutate: approveRefund } = approveMutation;

    const handleConfirmApprove = useCallback(() => {
        approveRefund();
    }, [approveRefund]);

    const handleConfirmOpenChange = useCallback((open: boolean) => {
        if (!open) setConfirmOpen(false);
    }, []);

    const handleRetryClick = useCallback(() => {
        setRetryConfirmOpen(true);
    }, []);

    const handleCancelRetry = useCallback(() => {
        setRetryConfirmOpen(false);
    }, []);

    const { mutate: retryRefund } = retryMutation;

    const handleConfirmRetry = useCallback(() => {
        retryRefund();
    }, [retryRefund]);

    const handleRetryConfirmOpenChange = useCallback((open: boolean) => {
        if (!open) setRetryConfirmOpen(false);
    }, []);

    if (isLoading) {
        return (
            <div
                className='flex h-full w-full items-center justify-center'
                role='status'
                aria-label={t('common.loading')}
            >
                <Spinner size='lg' />
            </div>
        );
    }

    if (isError || !refund) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.ADMIN.REFUNDS}`}>
                        <ArrowLeft className='h-4 w-4' />
                        {t('admin.refundDetail.backToRefunds')}
                    </Link>
                </Button>
                <ErrorState
                    title={t('admin.refundDetail.failedToLoad')}
                    description={t('admin.refundDetail.failedToLoadDescription')}
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.ADMIN.REFUNDS}`}>{t('admin.refundDetail.backToRefunds')}</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-6' asChild>
                <Link to={`/${ROUTES.ADMIN.REFUNDS}`}>
                    <ArrowLeft className='h-4 w-4' />
                    {t('admin.refundDetail.backToRefunds')}
                </Link>
            </Button>

            <div className='mb-6'>
                <h1 className='text-2xl font-bold text-foreground'>{t('admin.refundDetail.title')}</h1>
                <p className='mt-0.5 text-sm text-muted-foreground'>{t('admin.refundDetail.subtitle')}</p>
            </div>

            <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
                <div className='space-y-6'>
                    {refund.status === RefundStatusEnum.Processing && (
                        <RefundVietQrCard
                            refundId={refund.id}
                            amount={refund.amount}
                            bankCode={refund.bankCode}
                            accountNumber={refund.accountNumber}
                            accountHolderName={refund.accountHolderName}
                        />
                    )}
                    <RefundSummaryCard
                        id={refund.id}
                        orderSlugId={refund.orderSlugId}
                        amount={refund.amount}
                        status={refund.status}
                        createdDate={createdDate}
                    />
                    {refund.status === RefundStatusEnum.Paid && refund.transferReference && (
                        <TransferRecordCard paidDate={paidDate} transferReference={refund.transferReference} />
                    )}
                    {refund.status === RefundStatusEnum.Failed && refund.failureReason && (
                        <RefundFailureCard reason={refund.failureReason} />
                    )}
                </div>

                <div className='space-y-6'>
                    <RefundActionPanel
                        status={refund.status}
                        isBusy={
                            refund.status === RefundStatusEnum.Failed
                                ? retryMutation.isPending
                                : approveMutation.isPending
                        }
                        onApprove={handleApproveClick}
                        onRetry={handleRetryClick}
                    />
                </div>
            </div>

            <Dialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('admin.refundDetail.confirmTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.refundDetail.confirmDescription', {
                                amount: formatVnd(refund.amount),
                                orderRef: refund.orderSlugId || '—',
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCancelApprove} disabled={approveMutation.isPending}>
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={handleConfirmApprove} disabled={approveMutation.isPending}>
                            {approveMutation.isPending
                                ? t('admin.refundDetail.approving')
                                : t('admin.refundDetail.confirmAction')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={retryConfirmOpen} onOpenChange={handleRetryConfirmOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('admin.refundDetail.retryConfirmTitle')}</DialogTitle>
                        <DialogDescription>
                            {t('admin.refundDetail.retryConfirmDescription', {
                                amount: formatVnd(refund.amount),
                                orderRef: refund.orderSlugId || '—',
                            })}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={handleCancelRetry} disabled={retryMutation.isPending}>
                            {t('common.cancel')}
                        </Button>
                        <Button onClick={handleConfirmRetry} disabled={retryMutation.isPending}>
                            {retryMutation.isPending
                                ? t('admin.refundDetail.retrying')
                                : t('admin.refundDetail.retryConfirmAction')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default memo(AdminRefundDetail);
