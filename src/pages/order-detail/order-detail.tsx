import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { OrderActionCard, OrderDetailError, OrderItemsCard } from './components';

import { ORDER_QUERY_KEYS, orderApi, USER_QUERY_KEYS, userApi } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import {
    OrderCheckoutProgress,
    OrderCheckoutTrustBar,
    OrderDeliveryStatusTimeline,
    OrderHeader,
    PaymentMethodType,
    shouldShowRefundRequest,
    BankingPaymentConfirmedPanel,
    PaymentStatusType,
} from '@/features/order';
import { Button } from '@/uis/button';
import Spinner from '@/uis/spinner';

function OrderDetail() {
    const { t, i18n } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data: order,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ORDER_QUERY_KEYS.detail(id ?? ''),
        queryFn: () => {
            if (!id) throw new Error('Order ID is required');
            return orderApi.getOrderById(id);
        },
        enabled: !!id,
    });

    const { mutate: cancelOrder, isPending: isCancelling } = useMutation({
        mutationFn: (orderId: string) => orderApi.cancel(orderId),
        onSuccess: () => {
            toast.success(t('orderDetail.cancelledSuccess'));
            navigate(`/${ROUTES.ORDERS.LIST}`);
        },
    });

    const { mutate: requestRefund, isPending: isRequestingRefund } = useMutation({
        mutationFn: (orderId: string) => orderApi.requestRefund(orderId),
        onSuccess: () => {
            toast.success(t('orderDetail.refundRequestedSuccess'));
            queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEYS.detail(id ?? '') });
        },
    });

    const canRequestRefund =
        !!order &&
        shouldShowRefundRequest({
            paymentMethod: order.paymentMethod,
            deliveryStatus: order.deliveryStatus,
            deliveredCompletedAt: order.deliveryStatusTiming.deliveredCompletedAt,
            hasRefund: !!order.refund,
        });

    const { data: bankAccount } = useQuery({
        queryKey: USER_QUERY_KEYS.bankAccount(),
        queryFn: () => userApi.getBankAccount(),
        enabled: canRequestRefund,
    });

    const handleConfirmCancel = useCallback(() => {
        if (!order) return;
        cancelOrder(order.id);
    }, [order, cancelOrder]);

    const handleConfirmRefund = useCallback(() => {
        if (!order) return;
        requestRefund(order.id);
    }, [order, requestRefund]);

    const handleAddBankDetails = useCallback(() => {
        navigate(`/${ROUTES.SETTINGS.PAYMENT}`);
    }, [navigate]);

    const orderDate = useMemo(() => {
        if (!order) return '';
        const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN';
        return new Date(order.createdAt).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [order, i18n.language, t]);

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (isError || !order) {
        return <OrderDetailError />;
    }

    const bankingPaymentConfirmed =
        order.paymentMethod === PaymentMethodType.Banking && order.paymentStatus === PaymentStatusType.Paid;

    return (
        <div className='bg-background'>
            <div className='relative overflow-hidden border-b bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 py-8 sm:py-10'>
                <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
                    <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
                </div>
                <div className='relative container mx-auto max-w-5xl'>
                    <Button variant='ghost' size='sm' className='mb-4 -ml-2' asChild>
                        <Link to={`/${ROUTES.ORDERS.LIST}`}>
                            <ArrowLeft className='h-4 w-4' />
                            {t('orderDetail.backToOrders')}
                        </Link>
                    </Button>
                    <h1 className='mb-5 text-3xl font-black tracking-tight sm:text-4xl'>{t('order.title')}</h1>
                    <div className='space-y-3'>
                        <OrderCheckoutTrustBar />
                        <OrderCheckoutProgress currentStep='confirmation' />
                    </div>
                </div>
            </div>

            <div className='container mx-auto max-w-5xl px-4 py-6 sm:py-8'>
                <div className='space-y-6'>
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

                            <OrderItemsCard
                                items={order.items}
                                paymentMethod={order.paymentMethod}
                                totalAmount={order.totalAmount}
                                deliveryNotes={order.deliveryNotes}
                            />
                        </div>

                        <div className='lg:col-span-1'>
                            <OrderActionCard
                                slugId={order.slugId}
                                orderDate={orderDate}
                                deliveryStatus={order.deliveryStatus}
                                totalAmount={order.totalAmount}
                                paymentMethod={order.paymentMethod}
                                deliveredCompletedAt={order.deliveryStatusTiming.deliveredCompletedAt}
                                refund={order.refund}
                                onConfirmCancel={handleConfirmCancel}
                                isCancelling={isCancelling}
                                onConfirmRefund={handleConfirmRefund}
                                isRequestingRefund={isRequestingRefund}
                                hasBankDetails={bankAccount != null}
                                onAddBankDetails={handleAddBankDetails}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(OrderDetail);
