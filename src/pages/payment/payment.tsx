import { useMutation } from '@tanstack/react-query';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PaymentDeliveryForm, PaymentEmpty, PaymentMethod, PaymentOrderSummary, PaymentSuccess } from './components';
import type { PaymentSuccessState } from './components';
import PaymentBankingQr from './components/payment-banking-qr';

import { orderApi, userApi, BankAccountModel, CartItemModel } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { NotificationType } from '@/app/enums';
import { type SharedNotification } from '@/app/models';
import { useAppDispatch, useAppSelector, useNotifications } from '@/core/hooks';
import {
    loadCart,
    selectCartItems,
    selectCartIsInitialized,
    selectSelectedCartItems,
    selectSelectedCartTotalPrice,
} from '@/features/cart/store';
import { OrderCheckoutProgress, OrderCheckoutTrustBar, PaymentMethodEnum } from '@/features/order';
import { updateUser } from '@/store/user/user.slice';
import { Button } from '@/uis/button';
import { Card, CardContent } from '@/uis/card';
import ErrorState from '@/uis/error-state';
import Spinner from '@/uis/spinner';

function Payment() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const allItems = useAppSelector(selectCartItems);
    const selectedItems = useAppSelector(selectSelectedCartItems);
    const totalPrice = useAppSelector(selectSelectedCartTotalPrice);
    const isInitialized = useAppSelector(selectCartIsInitialized);
    const user = useAppSelector(state => state.user.user);
    const userLocation = user?.location;

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnum>(PaymentMethodEnum.CashOnDelivery);
    const [bankingCheckout, setBankingCheckout] = useState(false);
    const [confirmedSlugId, setConfirmedSlugId] = useState<string | null>(null);
    const [checkoutId, setCheckoutId] = useState<string | null>(null);
    const [storeBankAccount, setStoreBankAccount] = useState<BankAccountModel | null>(null);
    const [successState, setSuccessState] = useState<PaymentSuccessState | null>(null);
    const [successItems, setSuccessItems] = useState<CartItemModel[]>([]);

    const {
        mutate: createBankingCheckout,
        isPending: isCreatingCheckout,
        isError: isCheckoutError,
    } = useMutation({
        mutationFn: (data: { cartItemIds: string[]; totalAmount: number }) => orderApi.createBankingCheckout(data),
        onSuccess: result => {
            setCheckoutId(result.checkoutId);
            setStoreBankAccount(result.bankAccount);
            setBankingCheckout(true);
        },
    });

    const { mutate: createOrder, isPending: isCreatingOrder } = useMutation({
        mutationFn: (data: { paymentMethod: string; cartItemIds: string[]; deliveryNotes?: string }) =>
            orderApi.create(data),
        onSuccess: async order => {
            toast.success(t('payment.orderPlaced'));
            setConfirmedSlugId(order.slugId);
            setSuccessItems([...selectedItems]);
            setSuccessState({ method: 'cod', slugId: order.slugId, totalPrice });
            await dispatch(loadCart()).unwrap();
        },
    });

    const handlePaymentNotification = useCallback(
        (payload: SharedNotification) => {
            if (payload.type === NotificationType.Success) {
                setConfirmedSlugId(payload.slugId);
                setSuccessItems([...selectedItems]);
                setSuccessState({ method: 'banking', slugId: payload.slugId, totalPrice });
                toast.success(t('payment.paymentConfirmed'));
            } else if (payload.type === NotificationType.Failure) {
                toast.error(t('payment.paymentFailed'));
            }
        },
        [t, totalPrice]
    );

    useNotifications({ onNotification: handlePaymentNotification, enabled: bankingCheckout });

    const handleViewOrder = useCallback(async () => {
        if (!confirmedSlugId) return;
        await dispatch(loadCart()).unwrap();
        navigate(`/${ROUTES.ORDERS.DETAIL(confirmedSlugId)}`);
    }, [confirmedSlugId, dispatch, navigate]);

    const handlePaymentMethodChange = useCallback(
        (value: string) => {
            setPaymentMethod(value as PaymentMethodEnum);
            if (value === PaymentMethodEnum.Banking && !bankingCheckout) {
                createBankingCheckout({
                    cartItemIds: selectedItems.map(i => i.id),
                    totalAmount: totalPrice,
                });
            }
        },
        [bankingCheckout, selectedItems, totalPrice, createBankingCheckout]
    );

    const handleCodPlaceOrder = useCallback(
        (address: string, notes: string) => {
            if (selectedItems.length === 0) {
                toast.error(t('payment.selectItem'));
                navigate(`/${ROUTES.CART}`);
                return;
            }
            if (address && address !== userLocation) {
                userApi
                    .updateProfile({
                        firstName: user?.firstName ?? '',
                        lastName: user?.lastName ?? '',
                        avatarUrl: user?.avatarUrl ?? null,
                        location: address,
                    })
                    .then(profile => {
                        if (profile) {
                            dispatch(updateUser({ location: profile.location ?? undefined }));
                        }
                    })
                    .catch(() => {});
            }
            createOrder({
                paymentMethod: paymentMethod,
                cartItemIds: selectedItems.map(item => item.id),
                deliveryNotes: notes || undefined,
            });
        },
        [selectedItems, paymentMethod, navigate, createOrder, t, userLocation, dispatch, user]
    );

    const handleBackToCart = useCallback(() => {
        navigate(`/${ROUTES.CART}`);
    }, [navigate]);

    const handleBrowseMenu = useCallback(() => {
        navigate(`/${ROUTES.FOODS.LIST}`);
    }, [navigate]);

    if (!isInitialized) {
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
            <div className='relative container mx-auto max-w-7xl'>
                <h1 className='mb-5 text-3xl font-black tracking-tight sm:text-4xl'>{t('payment.title')}</h1>
                <div className='space-y-3'>
                    <OrderCheckoutTrustBar />
                    <OrderCheckoutProgress currentStep='payment' />
                </div>
            </div>
        </div>
    );

    if (successState) {
        return (
            <div className='bg-background'>
                {pageHeader}
                <div className='container mx-auto max-w-7xl px-4 py-6 sm:py-8'>
                    <PaymentSuccess
                        success={successState}
                        items={successItems}
                        onTrackOrder={handleViewOrder}
                        onBrowseMenu={handleBrowseMenu}
                    />
                </div>
            </div>
        );
    }

    if (allItems.length === 0) {
        return <PaymentEmpty />;
    }

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

    // Default payment selection view (handles COD and banking in one layout)
    return (
        <div className='bg-background'>
            {pageHeader}
            <div className='container mx-auto max-w-7xl px-4 py-6 sm:py-8'>
                <div className='grid gap-8 lg:grid-cols-[1fr_360px]'>
                    {/* Left column: payment method + delivery details (always) + banking QR */}
                    <div className='space-y-6'>
                        <PaymentMethod value={paymentMethod} onValueChange={handlePaymentMethodChange} />

                        <PaymentDeliveryForm
                            savedAddress={userLocation}
                            totalPrice={totalPrice}
                            disabled={isCreatingOrder}
                            onPlaceOrder={handleCodPlaceOrder}
                            showPlaceOrderButton={paymentMethod === PaymentMethodEnum.CashOnDelivery}
                        />

                        {paymentMethod === PaymentMethodEnum.Banking &&
                            (isCheckoutError ? (
                                <Card>
                                    <CardContent>
                                        <ErrorState
                                            title={t('payment.bankTransfer.loadErrorTitle')}
                                            description={t('payment.bankTransfer.loadErrorDescription')}
                                            iconSize='sm'
                                        />
                                    </CardContent>
                                </Card>
                            ) : isCreatingCheckout ? (
                                <Card>
                                    <CardContent className='flex items-center justify-center py-12'>
                                        <Spinner size='lg' />
                                    </CardContent>
                                </Card>
                            ) : !storeBankAccount ? (
                                <Card>
                                    <CardContent>
                                        <ErrorState
                                            title={t('payment.bankTransfer.notAvailableTitle')}
                                            description={t('payment.bankTransfer.notAvailableDescription')}
                                            iconSize='sm'
                                        />
                                    </CardContent>
                                </Card>
                            ) : (
                                <PaymentBankingQr
                                    bankCode={storeBankAccount.bankCode}
                                    accountNumber={storeBankAccount.accountNumber}
                                    amount={totalPrice}
                                    orderReference={checkoutId ? checkoutId.replace(/-/g, '') : ''}
                                />
                            ))}
                    </div>

                    {/* Right column: sticky order summary */}
                    <div>
                        <PaymentOrderSummary items={selectedItems} totalPrice={totalPrice} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Payment);
