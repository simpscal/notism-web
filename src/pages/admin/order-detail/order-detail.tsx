import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { adminApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import ErrorState from '@/components/error-state';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { OrderDeliveryStatusTimeline, OrderHeader } from '@/features/order';

function AdminOrderDetail() {
    const { id } = useParams<{ id: string }>();

    const {
        data: order,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['admin', 'orders', 'detail', id] as const,
        queryFn: () => {
            return adminApi.getOrderById(id!);
        },
        enabled: !!id,
    });

    const orderDate = useMemo(() => {
        if (!order) return '';
        return new Date(order.createdAt).toLocaleDateString('en-US', {
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
                        Back to Orders
                    </Link>
                </Button>
                <ErrorState
                    title='Failed to load order details'
                    description='Please try again later or go back to the orders list.'
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.ADMIN.ORDERS}`}>Back to Orders</Link>
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ADMIN.ORDERS}`}>
                    <ArrowLeft className=' h-4 w-4' />
                    Back to Orders
                </Link>
            </Button>

            <div className='mx-auto max-w-4xl space-y-6'>
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
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>Total Items</span>
                                        <span className='font-medium'>
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>Payment Method</span>
                                        <span className='font-medium capitalize'>{order.paymentMethod}</span>
                                    </div>
                                    <div className='flex justify-between text-lg font-semibold'>
                                        <span>Total</span>
                                        <span>${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(AdminOrderDetail);
