import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Clock } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { OrdersEmpty, OrdersError } from './components';

import { orderApi } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { FoodImage } from '@/features/food';
import { DELIVERY_STATUS, DeliveryStatusEnum, type DeliveryStatusConfig } from '@/features/order';

const getDeliveryStatusInfo = (status: string): DeliveryStatusConfig => {
    const step = DELIVERY_STATUS.find(s => s.key === status);
    return (
        step || {
            key: status as DeliveryStatusEnum,
            label: status,
            icon: Clock,
            colorClass: 'bg-gray-500 text-white border-gray-600',
        }
    );
};

function Orders() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['orders', 'list'] as const,
        queryFn: () => orderApi.getOrders(),
    });

    const orders = useMemo(() => data?.orders || [], [data]);

    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (isError) {
        return <OrdersError />;
    }

    if (orders.length === 0) {
        return <OrdersEmpty />;
    }

    return (
        <div className='container mx-auto px-4 py-6 sm:py-8'>
            <div className='mb-6 sm:mb-8'>
                <h1 className='text-2xl sm:text-3xl font-bold'>My Orders</h1>
                <p className='mt-2 text-sm text-muted-foreground'>View and track all your orders</p>
            </div>

            <div className='space-y-4 sm:space-y-6'>
                {orders.map(order => {
                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    const statusInfo = getDeliveryStatusInfo(order.deliveryStatus);
                    const StatusIcon = statusInfo.icon;

                    return (
                        <Card
                            key={order.id}
                            className='overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg'
                        >
                            <CardHeader className='pb-4'>
                                <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                                    <div className='flex-1'>
                                        <CardTitle className='mb-2 text-lg sm:text-xl'>Order #{order.slugId}</CardTitle>
                                        <div className='mb-2 sm:mb-0'>
                                            <Badge
                                                variant='outline'
                                                className={`${statusInfo.colorClass} flex w-fit items-center gap-1.5 border-0`}
                                            >
                                                <StatusIcon className='h-3 w-3' />
                                                {statusInfo.label}
                                            </Badge>
                                        </div>
                                        <CardDescription className='mt-2 flex items-center gap-2'>
                                            <Clock className='h-3.5 w-3.5' />
                                            {orderDate}
                                        </CardDescription>
                                    </div>
                                    <div className='flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-1'>
                                        <div className='text-xl sm:text-2xl font-bold'>
                                            ${order.totalAmount.toFixed(2)}
                                        </div>
                                        <div className='text-xs text-muted-foreground'>
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className='pt-0'>
                                <div className='space-y-4'>
                                    {/* Order Items with Images */}
                                    <div className='space-y-3'>
                                        {order.items.slice(0, 3).map(item => (
                                            <div key={item.id} className='flex items-center gap-3'>
                                                <div className='relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border bg-muted'>
                                                    <FoodImage
                                                        src={item.imageUrl}
                                                        alt={item.foodName}
                                                        className='h-full w-full object-cover'
                                                    />
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <div className='font-medium text-sm truncate'>{item.foodName}</div>
                                                    <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                                                        <span>Qty: {item.quantity}</span>
                                                        <span>•</span>
                                                        <span className='font-medium text-foreground'>
                                                            ${item.totalPrice.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className='flex items-center gap-3 pl-17'>
                                                <div className='text-sm font-medium text-muted-foreground'>
                                                    +{order.items.length - 3} more item
                                                    {order.items.length - 3 > 1 ? 's' : ''}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                                        <div className='flex items-center gap-2 text-sm'>
                                            <span className='text-muted-foreground'>Payment:</span>
                                            <Badge variant='outline' className='font-medium capitalize'>
                                                {order.paymentMethod}
                                            </Badge>
                                        </div>
                                        <Button variant='default' size='sm' className='w-full sm:w-auto' asChild>
                                            <Link to={`/${ROUTES.ORDERS.DETAIL(order.slugId)}`}>
                                                View Details
                                                <ArrowRight className='ml-2 h-4 w-4' />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

export default memo(Orders);
