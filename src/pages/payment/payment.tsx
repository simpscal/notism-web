import { useMutation, useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PaymentCodForm, PaymentEmpty, PaymentMethod, PaymentOrderSummary } from './components';
import PaymentBankingQr from './components/payment-banking-qr';

import { orderApi, paymentApi, userApi } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { formatVnd } from '@/app/utils';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { CartItemViewModel } from '@/features/cart/models';
import { getFoodPricing } from '@/features/food';
import { OrderCheckoutProgress, OrderCheckoutTrustBar, PaymentMethodEnum } from '@/features/order';
import { PaymentNotificationPayload, PaymentNotificationType, usePaymentSignalR } from '@/features/payment';
import {
    loadCart,
    selectCartItems,
    selectCartIsInitialized,
    selectSelectedCartItems,
    selectSelectedCartTotalPrice,
} from '@/store/cart';
import { updateUser } from '@/store/user/user.slice';

type PaymentSuccessMethod = 'cod' | 'banking';

interface SuccessState {
    method: PaymentSuccessMethod;
    slugId: string;
    totalPrice: number;
}

function PaymentSuccessScreen({
    success,
    items,
    onTrackOrder,
    onBrowseMenu,
}: {
    success: SuccessState;
    items: CartItemViewModel[];
    onTrackOrder: () => void;
    onBrowseMenu: () => void;
}) {
    const { t } = useTranslation();
    const orderRef = success.slugId;
    const isCod = success.method === 'cod';
    const totalPrice = success.totalPrice;

    return (
        <div>
            <div className='mb-8 flex flex-col items-center rounded-2xl bg-primary/5 px-6 py-10 text-center'>
                <CheckCircle2 className='mb-4 h-14 w-14 text-primary' />
                <h2 className='mb-1 text-2xl font-bold text-foreground'>
                    {isCod ? t('payment.success.codTitle') : t('payment.success.bankingTitle')}
                </h2>
                <p className='mb-3 text-sm text-muted-foreground'>
                    {isCod
                        ? t('payment.success.codMessage', { amount: formatVnd(totalPrice) })
                        : t('payment.success.bankingMessage', { amount: formatVnd(totalPrice) })}
                </p>
                <Badge variant='outline' className='font-mono text-sm'>
                    {orderRef}
                </Badge>
            </div>
            <div className='mx-auto max-w-sm space-y-4'>
                <Card>
                    <CardContent className='space-y-3 pt-6'>
                        <div className='text-center'>
                            <p className='mb-1 text-xs uppercase tracking-widest text-muted-foreground'>
                                {isCod ? t('payment.success.amountDueOnDelivery') : t('payment.success.amountReceived')}
                            </p>
                            <p className='text-4xl font-bold text-primary tabular-nums'>{formatVnd(totalPrice)}</p>
                        </div>
                        <Separator />
                        <div className='space-y-1.5 text-sm'>
                            {items.map(item => {
                                const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
                                const surcharge = item.totalSurcharge ?? 0;
                                const itemTotal = (effectivePrice + surcharge) * item.quantity;
                                const customLabel = (item.customisations ?? [])
                                    .map(c => c.optionLabel)
                                    .filter(l => l)
                                    .join(', ');
                                return (
                                    <div key={item.id} className='flex justify-between text-muted-foreground'>
                                        <span>
                                            {item.name}
                                            {customLabel ? ` (${customLabel})` : ''} × {item.quantity}
                                        </span>
                                        <span>{formatVnd(itemTotal)}</span>
                                    </div>
                                );
                            })}
                            <Separator />
                            <div className='flex justify-between font-semibold text-foreground'>
                                <span>{t('payment.summary.total')}</span>
                                <span>{formatVnd(totalPrice)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className='flex gap-3'>
                    <Button variant='outline' className='flex-1' onClick={onTrackOrder}>
                        {t('payment.success.trackOrder')}
                    </Button>
                    <Button className='flex-1' onClick={onBrowseMenu}>
                        {t('payment.success.browseMenu')}
                    </Button>
                </div>
            </div>
        </div>
    );
}

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
    const [successState, setSuccessState] = useState<SuccessState | null>(null);
    const [successItems, setSuccessItems] = useState<CartItemViewModel[]>([]);

    const { data: bankAccount } = useQuery({
        queryKey: ['bank-account'],
        queryFn: () => paymentApi.getBankAccount(),
        enabled: bankingCheckout,
    });

    const { mutate: createBankingCheckout, isPending: isCreatingCheckout } = useMutation({
        mutationFn: (data: { cartItemIds: string[]; totalAmount: number }) => paymentApi.createBankingCheckout(data),
        onSuccess: result => {
            setCheckoutId(result.checkoutId);
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
        (payload: PaymentNotificationPayload) => {
            if (payload.type === PaymentNotificationType.Success) {
                setConfirmedSlugId(payload.slugId);
                setSuccessItems([...selectedItems]);
                setSuccessState({ method: 'banking', slugId: payload.slugId, totalPrice });
                toast.success(t('payment.paymentConfirmed'));
            } else if (payload.type === PaymentNotificationType.Failure) {
                toast.error(t('payment.paymentFailed'));
            }
        },
        [t, totalPrice]
    );

    usePaymentSignalR({ onNotification: handlePaymentNotification, enabled: bankingCheckout });

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
                        dispatch(updateUser({ location: profile.location ?? undefined }));
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
                    <PaymentSuccessScreen
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

                        <PaymentCodForm
                            savedAddress={userLocation}
                            totalPrice={totalPrice}
                            disabled={isCreatingOrder}
                            onPlaceOrder={handleCodPlaceOrder}
                            showPlaceOrderButton={paymentMethod === PaymentMethodEnum.CashOnDelivery}
                        />

                        {paymentMethod === PaymentMethodEnum.Banking &&
                            (isCreatingCheckout || !bankAccount ? (
                                <Card>
                                    <CardContent className='flex items-center justify-center py-12'>
                                        <Spinner size='lg' />
                                    </CardContent>
                                </Card>
                            ) : (
                                <PaymentBankingQr
                                    bankCode={bankAccount.bankCode}
                                    accountNumber={bankAccount.accountNumber}
                                    accountHolderName={bankAccount.accountHolderName}
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
