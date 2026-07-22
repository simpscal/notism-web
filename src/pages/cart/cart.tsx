import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { CartEmpty, CartItem } from './components';

import { CartItemModel } from '@/apis';
import { ROUTES } from '@/app/constants/routes.constant';
import { formatVnd } from '@/app/utils';
import { useAppSelector, useAppDispatch, useDebouncedCallback } from '@/core/hooks';
import { useCart } from '@/features/cart';
import { getFoodPricing } from '@/features/food';
import { OrderCheckoutProgress, OrderCheckoutTrustBar } from '@/features/order';
import { selectCartItems, selectCartIsInitialized, setItemSelection } from '@/store/cart';
import { Button } from '@/uis/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/uis/card';
import { Separator } from '@/uis/separator';
import Spinner from '@/uis/spinner';

const QUANTITY_DEBOUNCE_MS = 400;

function Cart() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { updateCartItemQuantity, removeFromCart, replaceCartItemCustomisations } = useCart();

    const user = useAppSelector(state => state.user.user);
    const storeItems = useAppSelector(selectCartItems);
    const isInitialized = useAppSelector(selectCartIsInitialized);

    const [items, setItems] = useState<CartItemModel[]>(storeItems);
    useEffect(() => {
        setItems(storeItems);
    }, [storeItems]);

    const selectedItemsList = useMemo(() => {
        return items.filter(item => item.isSelected);
    }, [items]);

    const selectedTotalPrice = useMemo(() => {
        return selectedItemsList.reduce((total, item) => {
            const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
            return total + (effectivePrice + item.totalSurcharge) * item.quantity;
        }, 0);
    }, [selectedItemsList]);

    const flushQuantity = useDebouncedCallback((id: string, quantity: number) => {
        void updateCartItemQuantity(id, quantity).catch(() => {});
    }, QUANTITY_DEBOUNCE_MS);

    const handleQuantityChange = useCallback(
        (id: string, delta: number) => {
            const current = items.find(i => i.id === id);
            if (!current) return;

            const newQuantity = current.quantity + delta;

            if (newQuantity <= 0) {
                void removeFromCart(id)
                    .then(() => toast.success(t('cart.itemRemoved')))
                    .catch(() => {});
                return;
            }

            if (newQuantity > current.stockQuantity) {
                toast.error(t('cart.insufficientStock', { quantity: current.stockQuantity }));
                return;
            }

            setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item)));
            flushQuantity(id, id, newQuantity);
        },
        [items, removeFromCart, flushQuantity, t]
    );

    const handleRemoveItem = useCallback(
        async (id: string) => {
            await removeFromCart(id);
            toast.success(t('cart.itemRemoved'));
        },
        [removeFromCart, t]
    );

    const handleSelectionChange = useCallback(
        (id: string, selected: boolean) => {
            dispatch(setItemSelection({ id, isSelected: selected }));
        },
        [dispatch]
    );

    const handleCustomisationsChange = useCallback(
        async (id: string, customisations: { groupId: string; optionId: string }[]) => {
            try {
                await replaceCartItemCustomisations({ id, customisations });
            } catch {
                toast.error(t('cart.customisationUpdateFailed'));
            }
        },
        [replaceCartItemCustomisations, t]
    );

    const handleSummaryImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        (e.target as HTMLImageElement).style.display = 'none';
    }, []);

    const handleProceedToPayment = useCallback(() => {
        if (selectedItemsList.length === 0) {
            toast.error(t('cart.selectAtLeastOne'));
            return;
        }
        if (!user) {
            const returnUrl = encodeURIComponent(`/${ROUTES.PAYMENT}`);
            navigate(`/${ROUTES.AUTH.LOGIN}?returnUrl=${returnUrl}`);
        } else {
            navigate(`/${ROUTES.PAYMENT}`);
        }
    }, [user, navigate, selectedItemsList.length, t]);

    if (!isInitialized) {
        return (
            <div className='flex h-screen w-screen items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (items.length === 0) {
        return <CartEmpty />;
    }

    return (
        <div className='bg-background'>
            {/* Page header */}
            <div className='relative overflow-hidden border-b bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 py-8 sm:py-10'>
                <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
                    <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl' />
                </div>
                <div className='relative container mx-auto max-w-7xl'>
                    <div className='mb-5 flex items-center gap-3'>
                        <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>{t('cart.title')}</h1>
                        <span className='rounded-full bg-primary/10 px-3 py-0.5 text-sm font-semibold text-primary'>
                            {t('cart.itemCount_one', { count: items.length })}
                        </span>
                    </div>
                    <div className='space-y-3'>
                        <OrderCheckoutTrustBar />
                        <OrderCheckoutProgress currentStep='cart' />
                    </div>
                </div>
            </div>

            <div className='container mx-auto max-w-7xl px-4 py-6 sm:py-8'>
                <div className='grid gap-8 lg:grid-cols-3'>
                    <div className='space-y-4 lg:col-span-2'>
                        {items.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onQuantityChange={handleQuantityChange}
                                onRemove={handleRemoveItem}
                                onSelectionChange={handleSelectionChange}
                                onCustomisationsChange={handleCustomisationsChange}
                            />
                        ))}
                    </div>

                    <div className='lg:col-span-1'>
                        <Card className='sticky top-4'>
                            <CardHeader>
                                <h2 className='text-xl font-bold'>{t('cart.orderSummary')}</h2>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='divide-y'>
                                    {selectedItemsList.length > 0 ? (
                                        selectedItemsList.map(item => {
                                            const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
                                            const itemTotal = (effectivePrice + item.totalSurcharge) * item.quantity;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className='flex items-center justify-between gap-3 py-2 text-sm'
                                                >
                                                    <div className='flex items-center gap-2 min-w-0'>
                                                        <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted'>
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                className='h-full w-full object-cover'
                                                                onError={handleSummaryImageError}
                                                            />
                                                        </div>
                                                        <span className='truncate text-muted-foreground'>
                                                            {item.name} ×{item.quantity}
                                                        </span>
                                                    </div>
                                                    <span className='shrink-0 font-medium'>{formatVnd(itemTotal)}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className='text-sm text-muted-foreground'>{t('cart.noItemsSelected')}</p>
                                    )}
                                </div>

                                <Separator />

                                <div className='flex justify-between'>
                                    <span className='text-lg font-semibold'>{t('cart.total')}</span>
                                    <span className='text-xl font-black'>{formatVnd(selectedTotalPrice)}</span>
                                </div>
                            </CardContent>
                            <CardFooter className='flex flex-col gap-2'>
                                <Button
                                    variant='default'
                                    size='lg'
                                    className='w-full'
                                    disabled={selectedItemsList.length === 0}
                                    onClick={handleProceedToPayment}
                                >
                                    {t('cart.proceedToPayment')}
                                </Button>
                                {user && (
                                    <Button variant='outline' size='lg' className='w-full' asChild>
                                        <Link to={`/${ROUTES.ORDERS.LIST}`}>{t('cart.viewMyOrders')}</Link>
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Cart);
