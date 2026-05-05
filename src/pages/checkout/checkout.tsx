import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/app/constants/routes.constant';
import { formatVnd } from '@/app/utils';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import { useAppSelector } from '@/core/hooks';
import { OrderCheckoutProgress, OrderCheckoutTrustBar, PaymentMethodEnum } from '@/features/order';
import { selectSelectedCartTotalPrice } from '@/store/cart';

interface CheckoutLocationState {
    paymentMethod?: PaymentMethodEnum;
}

function Checkout() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as CheckoutLocationState | null;

    const totalPrice = useAppSelector(selectSelectedCartTotalPrice);

    const handleBackToCart = useCallback(() => {
        navigate(`/${ROUTES.CART}`);
    }, [navigate]);

    if (!state?.paymentMethod || state.paymentMethod !== PaymentMethodEnum.Banking) {
        return <Navigate to={`/${ROUTES.PAYMENT}`} replace />;
    }

    const pageHeader = (
        <div className='relative overflow-hidden border-b bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 py-8 sm:py-10'>
            <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
                <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
            </div>
            <div className='relative container mx-auto max-w-7xl'>
                <h1 className='mb-5 text-3xl font-black tracking-tight sm:text-4xl'>{t('checkout.title')}</h1>
                <div className='space-y-3'>
                    <OrderCheckoutTrustBar />
                    <OrderCheckoutProgress currentStep='payment' />
                </div>
            </div>
        </div>
    );

    return (
        <div className='bg-background'>
            {pageHeader}
            <div className='container mx-auto max-w-7xl px-4 py-6 sm:py-8'>
                <div className='grid gap-8 lg:grid-cols-3'>
                    {/* Payment Info */}
                    <div className='lg:col-span-2 space-y-6'>
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('checkout.awaitingTransfer')}</CardTitle>
                                <CardDescription>{t('checkout.awaitingDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='space-y-3'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm text-muted-foreground'>
                                            {t('payment.paymentMethod')}
                                        </span>
                                        <span className='font-medium'>{t('payment.banking')}</span>
                                    </div>
                                    <Separator />
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm text-muted-foreground'>{t('orders.status')}</span>
                                        <Badge variant='secondary'>{t('checkout.pending')}</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sticky Summary */}
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
                                        <span className='font-medium'>{t('payment.banking')}</span>
                                    </div>
                                    <Separator />
                                    <div className='flex justify-between text-lg font-semibold'>
                                        <span>{t('payment.totalAmount')}</span>
                                        <span>{formatVnd(totalPrice)}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className='flex flex-col gap-2'>
                                <Button variant='default' size='lg' className='w-full' disabled>
                                    {t('payment.placeOrder')}
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

export default memo(Checkout);
