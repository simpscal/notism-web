import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { OrdersEmpty, OrdersError } from './components';

import { orderApi } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';

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
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>My Orders</h1>

            <div className='space-y-4'>
                {orders.map(order => {
                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    return (
                        <Card key={order.id} className='hover:shadow-md transition-shadow'>
                            <CardHeader>
                                <div className='flex items-start justify-between'>
                                    <div>
                                        <CardTitle className='mb-1'>Order #{order.slugId}</CardTitle>
                                        <CardDescription>{orderDate}</CardDescription>
                                    </div>
                                    <div className='text-right'>
                                        <div className='text-lg font-semibold'>${order.totalAmount.toFixed(2)}</div>
                                        <div className='text-sm text-muted-foreground capitalize'>
                                            {order.deliveryStatus}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    <div className='space-y-2'>
                                        {order.items.slice(0, 3).map(item => (
                                            <div key={item.id} className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>
                                                    {item.foodName} x{item.quantity}
                                                </span>
                                                <span className='font-medium'>${item.totalPrice.toFixed(2)}</span>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className='text-sm text-muted-foreground'>
                                                +{order.items.length - 3} more item
                                                {order.items.length - 3 > 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className='flex items-center justify-between'>
                                        <div className='text-sm text-muted-foreground'>
                                            Payment:{' '}
                                            <span className='font-medium capitalize'>{order.paymentMethod}</span>
                                        </div>
                                        <Button variant='outline' size='sm' asChild>
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
