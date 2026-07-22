import { useInfiniteQuery } from '@tanstack/react-query';
import { Clock, StickyNote } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import { OrdersEmpty, OrdersLoadMore } from './components';

import { ORDER_QUERY_KEYS, orderApi } from '@/apis';
import { PAGE_SIZE } from '@/app/constants';
import { ROUTES } from '@/app/constants/routes.constant';
import { formatVnd } from '@/app/utils';
import {
    DELIVERY_STATUS,
    DeliveryStatusEnum,
    RefundStatusBadge,
    toCustomerRefundStatus,
    type DeliveryStatusConfig,
} from '@/features/order';
import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import ErrorState from '@/uis/error-state';
import { Separator } from '@/uis/separator';
import Spinner from '@/uis/spinner';

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

function Orders() {
    const { t, i18n } = useTranslation();
    const { ref: loadMoreRef, inView } = useInView();

    const { data, isLoading, isError, isFetchingNextPage, isFetchNextPageError, hasNextPage, fetchNextPage } =
        useInfiniteQuery({
            queryKey: ORDER_QUERY_KEYS.list(),
            queryFn: ({ pageParam = 0 }) => orderApi.getOrders({ skip: pageParam, take: PAGE_SIZE }),
            getNextPageParam: (lastPage, allPages) => {
                const loadedCount = allPages.reduce((acc, page) => acc + page.items.length, 0);
                return loadedCount < lastPage.totalCount ? loadedCount : undefined;
            },
            initialPageParam: 0,
        });

    const orders = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data?.pages]);
    const totalCount = data?.pages[0]?.totalCount ?? 0;

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

    const handleRetry = useCallback(() => {
        fetchNextPage();
    }, [fetchNextPage]);

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    const pageHeader = (
        <div className='relative overflow-hidden border-b bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 py-8 sm:py-10'>
            <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
                <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
            </div>
            <div className='relative container mx-auto max-w-3xl'>
                <div className='flex items-center gap-3'>
                    <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>{t('orders.title')}</h1>
                    {totalCount > 0 && (
                        <span className='rounded-full bg-primary/10 px-3 py-0.5 text-sm font-semibold text-primary'>
                            {t('orders.orderCount_one', { count: totalCount })}
                        </span>
                    )}
                </div>
                <p className='mt-2 text-sm text-muted-foreground'>{t('orders.subtitle')}</p>
            </div>
        </div>
    );

    // Full-page error only when the very first batch fails (nothing rendered yet).
    // A failed subsequent batch keeps already-loaded orders visible and surfaces
    // an inline retry via the load-more sentinel below.
    if (isError && orders.length === 0) {
        return (
            <div className='bg-background'>
                {pageHeader}
                <div className='container mx-auto max-w-3xl px-4 py-8'>
                    <ErrorState title={t('orders.failedToLoad')} description={t('orders.tryAgain')} iconSize='sm' />
                </div>
            </div>
        );
    }

    if (totalCount === 0) {
        return <OrdersEmpty />;
    }

    return (
        <div className='bg-background'>
            {pageHeader}
            <div className='container mx-auto max-w-3xl px-4 py-6 sm:py-8'>
                <div className='space-y-4'>
                    {orders.map(order => {
                        const locale = i18n.language === 'en' ? 'en-US' : 'vi-VN';
                        const orderDate = new Date(order.createdAt).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        });

                        const statusInfo = getDeliveryStatusInfo(order.deliveryStatus);
                        const StatusIcon = statusInfo.icon;
                        const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
                        const hasSurcharges = order.items.some(i => (i.surcharge ?? 0) > 0);

                        return (
                            <Card
                                key={order.id}
                                className='border border-border transition-all hover:border-primary/40 hover:shadow-md'
                            >
                                <CardHeader className='pb-0'>
                                    <div className='flex items-start justify-between gap-4'>
                                        <div className='space-y-1'>
                                            <CardTitle className='font-mono text-sm text-muted-foreground'>
                                                {order.slugId}
                                            </CardTitle>
                                            <p className='text-xs text-muted-foreground'>{orderDate}</p>
                                        </div>
                                        <div className='flex flex-wrap items-center justify-end gap-2'>
                                            <Badge
                                                variant='outline'
                                                className={`${statusInfo.colorClass} flex w-fit items-center gap-1.5`}
                                            >
                                                <StatusIcon className='h-3 w-3' />
                                                {t(statusInfo.label)}
                                            </Badge>
                                            {order.refund && (
                                                <RefundStatusBadge
                                                    status={toCustomerRefundStatus(order.refund.status)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className='space-y-3'>
                                    <p className='text-sm text-muted-foreground'>
                                        {t('cart.itemCount', { count: itemCount })}
                                        {hasSurcharges ? ` · ${t('orders.includesSurcharges')}` : ''}
                                    </p>

                                    {order.deliveryNotes && (
                                        <div className='flex items-start gap-1.5 text-sm text-muted-foreground'>
                                            <StickyNote className='mt-0.5 h-3.5 w-3.5 shrink-0' />
                                            <span>{order.deliveryNotes}</span>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='text-xs text-muted-foreground'>{t('orders.orderTotal')}</p>
                                            <p className='text-base font-bold text-foreground'>
                                                {formatVnd(order.totalAmount)}
                                            </p>
                                        </div>
                                        <Button variant='outline' size='sm' asChild>
                                            <Link to={`/${ROUTES.ORDERS.DETAIL(order.slugId)}`}>
                                                {t('orders.viewDetails')}
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div ref={loadMoreRef}>
                    <OrdersLoadMore
                        isFetchingNextPage={isFetchingNextPage}
                        isError={isFetchNextPageError}
                        hasNextPage={hasNextPage}
                        onRetry={handleRetry}
                    />
                </div>
            </div>
        </div>
    );
}

export default memo(Orders);
