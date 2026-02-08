import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PaymentEmpty, PaymentMethod, PaymentOrderSummary } from './components';

import { orderApi } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { PaymentMethodEnum } from '@/features/order';
import { loadCart, selectCartItems, selectCartIsInitialized, selectCartTotalPrice } from '@/store/cart';

function Payment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();
    const items = useAppSelector(selectCartItems);
    const totalPrice = useAppSelector(selectCartTotalPrice);
    const isInitialized = useAppSelector(selectCartIsInitialized);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.CashOnDelivery);

    const { mutate: createOrder, isPending: isCreatingOrder } = useMutation({
        mutationFn: (data: { paymentMethod: string; cartItemIds: string[] }) => orderApi.create(data),
        onSuccess: async order => {
            await dispatch(loadCart()).unwrap();

            queryClient.invalidateQueries({ queryKey: ['orders'] });

            toast.success('Order placed successfully!');
            navigate(`/${ROUTES.ORDERS.DETAIL(order.slugId)}`);
        },
        onError: () => {
            toast.error('Failed to place order. Please try again.');
        },
    });

    const handlePaymentMethodChange = useCallback((value: string) => {
        setPaymentMethod(value as PaymentMethodEnum);
    }, []);

    const handlePlaceOrder = useCallback(() => {
        if (items.length === 0) {
            toast.error('Your cart is empty');
            navigate(`/${ROUTES.CART}`);
            return;
        }

        const cartItemIds = items.map(item => item.id);

        createOrder({
            paymentMethod: paymentMethod,
            cartItemIds,
        });
    }, [items, paymentMethod, navigate, createOrder]);

    const handleBackToCart = useCallback(() => {
        navigate(`/${ROUTES.CART}`);
    }, [navigate]);

    if (!isInitialized) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (items.length === 0) {
        return <PaymentEmpty />;
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>Payment</h1>

            <div className='grid gap-8 lg:grid-cols-3'>
                {/* Payment Method Selection */}
                <div className='lg:col-span-2 space-y-6'>
                    <PaymentMethod value={paymentMethod} onValueChange={handlePaymentMethodChange} />
                    <PaymentOrderSummary items={items} totalPrice={totalPrice} />
                </div>

                {/* Action Buttons */}
                <div className='lg:col-span-1'>
                    <Card className='sticky top-4'>
                        <CardHeader>
                            <CardTitle>Complete Order</CardTitle>
                            <CardDescription>
                                Review your order and payment method before placing the order
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='space-y-2'>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-muted-foreground'>Payment Method</span>
                                    <span className='font-medium'>
                                        {paymentMethod === PaymentMethodEnum.CashOnDelivery
                                            ? 'Cash on Delivery'
                                            : 'Banking'}
                                    </span>
                                </div>
                                <Separator />
                                <div className='flex justify-between text-lg font-semibold'>
                                    <span>Total Amount</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className='flex flex-col gap-2'>
                            <Button
                                size='lg'
                                className='w-full'
                                onClick={handlePlaceOrder}
                                disabled={isCreatingOrder || paymentMethod === PaymentMethodEnum.Banking}
                            >
                                {isCreatingOrder ? (
                                    <>
                                        <Spinner size='sm' className='mr-2' />
                                        Processing...
                                    </>
                                ) : (
                                    'Place Order'
                                )}
                            </Button>
                            <Button variant='outline' size='lg' className='w-full' onClick={handleBackToCart}>
                                Back to Cart
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default memo(Payment);
