import { useMutation } from '@tanstack/react-query';
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
import { CheckoutProgress, CheckoutTrustBar, PaymentMethodEnum } from '@/features/order';
import {
    loadCart,
    selectCartItems,
    selectCartIsInitialized,
    selectSelectedCartItems,
    selectSelectedCartTotalPrice,
} from '@/store/cart';

function Payment() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const allItems = useAppSelector(selectCartItems);
    const selectedItems = useAppSelector(selectSelectedCartItems);
    const totalPrice = useAppSelector(selectSelectedCartTotalPrice);
    const isInitialized = useAppSelector(selectCartIsInitialized);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.CashOnDelivery);

    const { mutate: createOrder, isPending: isCreatingOrder } = useMutation({
        mutationFn: (data: { paymentMethod: string; cartItemIds: string[] }) => orderApi.create(data),
        onSuccess: async order => {
            await dispatch(loadCart()).unwrap();

            toast.success('Order placed successfully!');
            navigate(`/${ROUTES.ORDERS.DETAIL(order.slugId)}`);
        },
    });

    const handlePaymentMethodChange = useCallback((value: string) => {
        setPaymentMethod(value as PaymentMethodEnum);
    }, []);

    const handlePlaceOrder = useCallback(() => {
        if (selectedItems.length === 0) {
            toast.error('Please select at least one item to place an order');
            navigate(`/${ROUTES.CART}`);
            return;
        }

        const cartItemIds = selectedItems.map(item => item.id);

        createOrder({
            paymentMethod: paymentMethod,
            cartItemIds,
        });
    }, [selectedItems, paymentMethod, navigate, createOrder]);

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

    if (allItems.length === 0) {
        return <PaymentEmpty />;
    }

    const pageHeader = (
        <div className='relative overflow-hidden border-b bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 py-8 sm:py-10'>
            <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
                <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
            </div>
            <div className='relative container mx-auto max-w-7xl'>
                <h1 className='mb-5 text-3xl font-black tracking-tight sm:text-4xl'>Payment</h1>
                <div className='space-y-3'>
                    <CheckoutTrustBar />
                    <CheckoutProgress currentStep='payment' />
                </div>
            </div>
        </div>
    );

    if (selectedItems.length === 0) {
        return (
            <div className='bg-background'>
                {pageHeader}
                <div className='container mx-auto max-w-7xl px-4 py-8'>
                    <div className='flex flex-col items-center justify-center py-12 text-center'>
                        <p className='mb-4 text-muted-foreground'>No items selected for checkout</p>
                        <Button size='lg' onClick={handleBackToCart}>
                            Back to Cart
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-background'>
            {pageHeader}
            <div className='container mx-auto max-w-7xl px-4 py-6 sm:py-8'>
                <div className='grid gap-8 lg:grid-cols-3'>
                    {/* Payment Method Selection */}
                    <div className='lg:col-span-2 space-y-6'>
                        <PaymentMethod value={paymentMethod} onValueChange={handlePaymentMethodChange} />
                        <PaymentOrderSummary items={selectedItems} totalPrice={totalPrice} />
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
                                    variant='default'
                                    size='lg'
                                    className='w-full'
                                    onClick={handlePlaceOrder}
                                    disabled={isCreatingOrder || paymentMethod === PaymentMethodEnum.Banking}
                                >
                                    {isCreatingOrder ? (
                                        <>
                                            <Spinner size='sm' className='' />
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
        </div>
    );
}

export default memo(Payment);
