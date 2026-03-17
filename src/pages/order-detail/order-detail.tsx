import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { OrderActionCard, OrderDetailError } from './components';

import { orderApi } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { getFoodPricing, FoodImage } from '@/features/food';
import { OrderDeliveryStatusTimeline, OrderHeader } from '@/features/order';

function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: order,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['orders', 'detail', id] as const,
        queryFn: () => {
            if (!id) throw new Error('Order ID is required');
            return orderApi.getOrderById(id);
        },
        enabled: !!id,
    });

    const cancelOrderMutation = useMutation({
        mutationFn: (orderId: string) => orderApi.cancel(orderId),
        onSuccess: () => {
            toast.success('Order cancelled successfully');
            navigate(`/${ROUTES.ORDERS.LIST}`);
        },
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
        return <OrderDetailError />;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ORDERS.LIST}`}>
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
                                <div className='space-y-4'>
                                    {order.items.map(item => {
                                        const unitPrice = item.unitPrice ?? 0;
                                        const { effectivePrice, hasSavings } = getFoodPricing(
                                            unitPrice,
                                            item.discountPrice
                                        );

                                        return (
                                            <div key={item.id} className='flex gap-4'>
                                                <div className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg'>
                                                    <FoodImage
                                                        src={item.imageUrl}
                                                        alt={item.foodName}
                                                        className='h-full w-full object-cover'
                                                    />
                                                </div>
                                                <div className='flex-1'>
                                                    <div className='font-medium'>{item.foodName}</div>
                                                    <div className='text-sm text-muted-foreground'>
                                                        Quantity: {item.quantity}
                                                    </div>
                                                    <div className='mt-1 flex items-center gap-2'>
                                                        {hasSavings && item.unitPrice != null && (
                                                            <span className='text-sm text-muted-foreground line-through'>
                                                                ${item.unitPrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                        <span className='font-medium'>
                                                            ${effectivePrice.toFixed(2)}
                                                        </span>
                                                        <span className='text-sm text-muted-foreground'>each</span>
                                                    </div>
                                                </div>
                                                <div className='text-right'>
                                                    <div className='font-semibold'>
                                                        ${(item.totalPrice ?? 0).toFixed(2)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Separator />

                                <div className='space-y-2'>
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

                    <div className='lg:col-span-1'>
                        <OrderActionCard
                            slugId={order.slugId}
                            orderDate={orderDate}
                            deliveryStatus={order.deliveryStatus}
                            onConfirmCancel={() => cancelOrderMutation.mutate(order.id)}
                            isCancelling={cancelOrderMutation.isPending}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(OrderDetail);
