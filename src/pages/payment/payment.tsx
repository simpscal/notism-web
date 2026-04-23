import { useMutation } from '@tanstack/react-query';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PaymentEmpty, PaymentMethod, PaymentOrderSummary } from './components';

import { orderApi } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { formatVnd } from '@/app/utils';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { OrderCheckoutProgress, OrderCheckoutTrustBar, PaymentMethodEnum } from '@/features/order';
import {
    loadCart,
    selectCartItems,
    selectCartIsInitialized,
    selectSelectedCartItems,
    selectSelectedCartTotalPrice,
} from '@/store/cart';

function Payment() {
    const { t } = useTranslation();
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

            toast.success(t('payment.orderPlaced'));
            navigate(`/${ROUTES.ORDERS.DETAIL(order.slugId)}`);
        },
    });

    const handlePaymentMethodChange = useCallback((value: string) => {
        setPaymentMethod(value as PaymentMethodEnum);
    }, []);

    const handlePlaceOrder = useCallback(() => {
        if (selectedItems.length === 0) {
            toast.error(t('payment.selectItem'));
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
                <h1 className='mb-5 text-3xl font-black tracking-tight sm:text-4xl'>{t('payment.title')}</h1>
                <div className='space-y-3'>
                    <OrderCheckoutTrustBar />
                    <OrderCheckoutProgress currentStep='payment' />
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
                        <p className='mb-4 text-muted-foreground'>{t('payment.noItemsSelected')}</p>
                        <Button size='lg' onClick={handleBackToCart}>
                            {t('payment.backToCart')}
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
                                <CardTitle>{t('payment.completeOrder')}</CardTitle>
                                <CardDescription>{t('payment.reviewOrder')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='text-muted-foreground'>{t('payment.paymentMethod')}</span>
                                        <span className='font-medium'>
                                            {paymentMethod === PaymentMethodEnum.CashOnDelivery
                                                ? t('payment.cashOnDelivery')
                                                : t('payment.banking')}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className='flex justify-between text-lg font-semibold'>
                                        <span>{t('payment.totalAmount')}</span>
                                        <span>{formatVnd(totalPrice)}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className='flex flex-col gap-2'>
                                <Button
                                    variant='default'
                                    size='lg'
                                    className='w-full'
                                    onClick={handlePlaceOrder}
                                    disabled={isCreatingOrder}
                                >
                                    {isCreatingOrder ? (
                                        <>
                                            <Spinner size='sm' className='' />
                                            {t('payment.processing')}
                                        </>
                                    ) : (
                                        t('payment.placeOrder')
                                    )}
                                </Button>
                                <Button variant='outline' size='lg' className='w-full' onClick={handleBackToCart}>
                                    {t('payment.backToCart')}
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
