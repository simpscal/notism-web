import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, StickyNote } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { ADMIN_QUERY_KEYS, adminApi } from '@/apis';
import type { AdminOrderDetailModel } from '@/apis';
import { ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import {
    OrderDeliveryStatusTimeline,
    OrderHeader,
    PaymentMethodType,
    BankingPaymentConfirmedPanel,
    PaymentStatusType,
} from '@/features/order';
import { PaymentCard } from '@/pages/admin/order-detail/components';
import { Button } from '@/uis/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import ErrorState from '@/uis/error-state';
import { Separator } from '@/uis/separator';
import Spinner from '@/uis/spinner';

function AdminOrderDetail() {
    const { t, i18n } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const {
        data: order,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ADMIN_QUERY_KEYS.orderDetail(id ?? ''),
        queryFn: () => {
            return adminApi.getOrderById(id!);
        },
        enabled: !!id,
    });

    const { mutate: mutatePaymentStatus, isPending: isPaymentStatusPending } = useMutation({
        mutationFn: (next: string) => adminApi.updateOrderPaymentStatus(order!.id, { paymentStatus: next }),
        onSuccess: updatedOrder => {
            queryClient.setQueryData<AdminOrderDetailModel>(ADMIN_QUERY_KEYS.orderDetail(id ?? ''), oldData =>
                oldData ? { ...oldData, paymentStatus: updatedOrder.paymentStatus } : oldData
            );
        },
    });

    const handleConfirmPaymentStatus = useCallback((next: string) => mutatePaymentStatus(next), [mutatePaymentStatus]);

    const orderDate = useMemo(() => {
        if (!order) return '';
        return new Date(order.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [order]);

    const paidAtDate = useMemo(() => {
        if (!order?.paidAt) return '';
        return new Date(order.paidAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [order]);

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (isError || !order) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.ADMIN.ORDERS}`}>
                        <ArrowLeft className='h-4 w-4' />
                        {t('admin.orderDetailPage.backToOrders')}
                    </Link>
                </Button>
                <ErrorState
                    title={t('admin.orderDetailPage.failedToLoad')}
                    description={t('admin.orderDetailPage.failedToLoadDescription')}
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.ADMIN.ORDERS}`}>{t('admin.orderDetailPage.backToOrders')}</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    const isPaid = order.paymentStatus === PaymentStatusType.Paid;
    const bankingPaymentConfirmed = order.paymentMethod === PaymentMethodType.Banking && isPaid;

    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ADMIN.ORDERS}`}>
                    <ArrowLeft className=' h-4 w-4' />
                    {t('admin.orderDetailPage.backToOrders')}
                </Link>
            </Button>

            <div className='mx-auto max-w-4xl space-y-6'>
                {bankingPaymentConfirmed && (
                    <BankingPaymentConfirmedPanel totalAmount={order.totalAmount} slugId={order.slugId} />
                )}

                <OrderHeader
                    slugId={order.slugId}
                    totalAmount={order.totalAmount}
                    deliveryStatus={order.deliveryStatus}
                    orderDate={orderDate}
                />

                <div className='grid gap-6 lg:grid-cols-3'>
                    <div className='lg:col-span-2 space-y-6'>
                        <OrderDeliveryStatusTimeline
                            deliveryStatus={order.deliveryStatus}
                            deliveryStatusTiming={{
                                orderPlacedCompletedAt: order.deliveryStatusTiming.orderPlacedCompletedAt,
                                preparingCompletedAt: order.deliveryStatusTiming.preparingCompletedAt,
                                onTheWayCompletedAt: order.deliveryStatusTiming.onTheWayCompletedAt,
                                deliveredCompletedAt: order.deliveryStatusTiming.deliveredCompletedAt,
                            }}
                        />

                        <Card>
                            <CardHeader>
                                <CardTitle>{t('admin.orderDetailPage.orderItems')}</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            {t('admin.orderDetailPage.totalItems')}
                                        </span>
                                        <span className='font-medium'>
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>
                                            {t('admin.orderDetailPage.paymentMethod')}
                                        </span>
                                        <span className='font-medium capitalize'>{order.paymentMethod}</span>
                                    </div>
                                    {order.deliveryNotes && (
                                        <div className='flex items-start gap-1.5 text-sm'>
                                            <StickyNote className='mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground' />
                                            <span className='text-muted-foreground'>{order.deliveryNotes}</span>
                                        </div>
                                    )}
                                    <div className='flex justify-between text-lg font-semibold'>
                                        <span>{t('orderDetail.total')}</span>
                                        <span>{formatVnd(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {isPaid && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Details</CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>Amount Paid</span>
                                        <span className='font-medium'>{formatVnd(order.totalAmount)}</span>
                                    </div>
                                    <Separator />
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>Payment Confirmed</span>
                                        <span className='font-medium'>{paidAtDate}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className='space-y-6'>
                        <PaymentCard
                            paymentStatus={order.paymentStatus}
                            paymentMethod={order.paymentMethod}
                            isPending={isPaymentStatusPending}
                            onConfirm={handleConfirmPaymentStatus}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(AdminOrderDetail);
