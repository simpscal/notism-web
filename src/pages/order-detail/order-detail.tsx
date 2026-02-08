import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { OrderDetailError } from './components';

import { orderApi } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import Timeline from '@/components/timeline';
import { FoodImage } from '@/features/food';
import { DELIVERY_STATUS, DeliveryStatusEnum } from '@/features/order';

const getDeliveryStatusLabel = (status: string): string => {
    const step = DELIVERY_STATUS.find(s => s.key === status);
    return step?.label || status;
};

function OrderDetail() {
    const { id } = useParams<{ id: string }>();

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

    const currentStepIndex = useMemo(() => {
        if (!order) return -1;

        const enumValue = order.deliveryStatus as DeliveryStatusEnum;
        return DELIVERY_STATUS.findIndex(step => step.key === enumValue);
    }, [order]);

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
            {/* Back Button */}
            <Button variant='ghost' className='mb-8' asChild>
                <Link to={`/${ROUTES.ORDERS.LIST}`}>
                    <ArrowLeft className='mr-2 h-4 w-4' />
                    Back to Orders
                </Link>
            </Button>

            <div className='mx-auto max-w-4xl space-y-6'>
                {/* Order Header */}
                <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
                    <div>
                        <h1 className='mb-2 text-3xl font-bold'>Order Details</h1>
                        <p className='text-muted-foreground'>Order ID: {order.slugId}</p>
                        <p className='text-sm text-muted-foreground'>{orderDate}</p>
                    </div>
                    <div className='text-right'>
                        <div className='text-2xl font-bold'>${order.totalAmount.toFixed(2)}</div>
                        <div className='text-sm text-muted-foreground capitalize'>{order.deliveryStatus}</div>
                    </div>
                </div>

                <div className='grid gap-6 lg:grid-cols-3'>
                    {/* Delivery Status Timeline */}
                    <div className='lg:col-span-2 space-y-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Delivery Status</CardTitle>
                                <CardDescription>Track your order progress</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Timeline
                                    items={DELIVERY_STATUS.map((step, index) => {
                                        const isCompleted = index <= currentStepIndex;
                                        const isCurrent = index === currentStepIndex;
                                        const timing = order.deliveryStatusTiming;

                                        let completedAt: string | null = null;
                                        if (step.key === DeliveryStatusEnum.Placed)
                                            completedAt = timing.orderPlacedCompletedAt;
                                        if (step.key === DeliveryStatusEnum.Preparing)
                                            completedAt = timing.preparingCompletedAt;
                                        if (step.key === DeliveryStatusEnum.OnTheWay)
                                            completedAt = timing.onTheWayCompletedAt;
                                        if (step.key === DeliveryStatusEnum.Delivered)
                                            completedAt = timing.deliveredCompletedAt;

                                        return {
                                            title: step.label,
                                            icon: step.icon,
                                            isCompleted,
                                            isCurrent,
                                            completedAt,
                                        };
                                    })}
                                />
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Items</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='space-y-4'>
                                    {order.items.map(item => {
                                        const hasDiscount =
                                            item.discountPrice != null &&
                                            item.unitPrice != null &&
                                            item.discountPrice < item.unitPrice;
                                        const effectivePrice =
                                            hasDiscount && item.discountPrice != null
                                                ? item.discountPrice
                                                : (item.unitPrice ?? 0);

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
                                                        {hasDiscount && item.unitPrice != null && (
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

                    {/* Action Card */}
                    <div className='lg:col-span-1'>
                        <Card className='sticky top-4'>
                            <CardHeader>
                                <CardTitle>Order Information</CardTitle>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='space-y-2 text-sm'>
                                    <div>
                                        <div className='text-muted-foreground'>Order ID</div>
                                        <div className='font-medium'>{order.slugId}</div>
                                    </div>
                                    <div>
                                        <div className='text-muted-foreground'>Placed on</div>
                                        <div className='font-medium'>{orderDate}</div>
                                    </div>
                                    <div>
                                        <div className='text-muted-foreground'>Status</div>
                                        <div className='font-medium'>
                                            {getDeliveryStatusLabel(order.deliveryStatus)}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardContent className='pt-0'>
                                <div className='space-y-2'>
                                    <Button size='lg' className='w-full' asChild>
                                        <Link to={`/${ROUTES.FOODS.LIST}`}>Continue Shopping</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(OrderDetail);
