import { memo, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { CartEmpty, CartItem } from './components';

import { ROUTES } from '@/app/constants/routes.constant';
import { Button } from '@/components/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { useAppSelector, useAppDispatch } from '@/core/hooks';
import { useCart } from '@/features/cart';
import { getFoodPricing } from '@/features/food';
import { CheckoutProgress, CheckoutTrustBar } from '@/features/order';
import { selectCartItems, selectCartIsInitialized, setItemSelection } from '@/store/cart';

function Cart() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { updateCartItemQuantity, removeFromCart } = useCart();

    const user = useAppSelector(state => state.user.user);
    const items = useAppSelector(selectCartItems);
    const isInitialized = useAppSelector(selectCartIsInitialized);

    const selectedItemsList = useMemo(() => {
        return items.filter(item => item.isSelected);
    }, [items]);

    const selectedTotalPrice = useMemo(() => {
        return selectedItemsList.reduce((total, item) => {
            const itemPrice = getFoodPricing(item.price, item.discountPrice).effectivePrice;
            return total + itemPrice * item.quantity;
        }, 0);
    }, [selectedItemsList]);

    const handleQuantityChange = useCallback(
        async (id: string, delta: number) => {
            const item = items.find(i => i.id === id);
            if (!item) return;

            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) {
                await removeFromCart(id);
                toast.success('Item removed from cart');
            } else if (newQuantity > item.stockQuantity) {
                toast.error(`Only ${item.stockQuantity} items available`);
            } else {
                await updateCartItemQuantity(id, newQuantity);
            }
        },
        [updateCartItemQuantity, removeFromCart, items]
    );

    const handleRemoveItem = useCallback(
        async (id: string, name: string) => {
            await removeFromCart(id);
            toast.success(`${name} removed from cart`);
        },
        [removeFromCart]
    );

    const handleSelectionChange = useCallback(
        (id: string, selected: boolean) => {
            dispatch(setItemSelection({ id, isSelected: selected }));
        },
        [dispatch]
    );

    const handleProceedToPayment = useCallback(() => {
        if (selectedItemsList.length === 0) {
            toast.error('Please select at least one item to proceed');
            return;
        }
        if (!user) {
            const returnUrl = encodeURIComponent(`/${ROUTES.PAYMENT}`);
            navigate(`/${ROUTES.AUTH.LOGIN}?returnUrl=${returnUrl}`);
        } else {
            navigate(`/${ROUTES.PAYMENT}`);
        }
    }, [user, navigate, selectedItemsList.length]);

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
                        <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Shopping Cart</h1>
                        <span className='rounded-full bg-primary/10 px-3 py-0.5 text-sm font-semibold text-primary'>
                            {items.length} {items.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    <div className='space-y-3'>
                        <CheckoutTrustBar />
                        <CheckoutProgress currentStep='cart' />
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
                            />
                        ))}
                    </div>

                    <div className='lg:col-span-1'>
                        <Card className='sticky top-4'>
                            <CardHeader>
                                <h2 className='text-xl font-bold'>Order Summary</h2>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='space-y-2'>
                                    {selectedItemsList.length > 0 ? (
                                        selectedItemsList.map(item => {
                                            const { effectivePrice } = getFoodPricing(item.price, item.discountPrice);
                                            const itemTotal = effectivePrice * item.quantity;

                                            return (
                                                <div
                                                    key={item.id}
                                                    className='flex items-center justify-between gap-3 text-sm'
                                                >
                                                    <div className='flex items-center gap-2 min-w-0'>
                                                        <div className='relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted'>
                                                            <img
                                                                src={item.imageUrl}
                                                                alt={item.name}
                                                                className='h-full w-full object-cover'
                                                                onError={e => {
                                                                    (e.target as HTMLImageElement).style.display =
                                                                        'none';
                                                                }}
                                                            />
                                                        </div>
                                                        <span className='truncate text-muted-foreground'>
                                                            {item.name} ×{item.quantity}
                                                        </span>
                                                    </div>
                                                    <span className='shrink-0 font-medium'>
                                                        ${itemTotal.toFixed(2)}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className='text-sm text-muted-foreground'>No items selected</p>
                                    )}
                                </div>

                                <Separator />

                                <div className='flex justify-between'>
                                    <span className='text-lg font-semibold'>Total</span>
                                    <span className='text-xl font-black'>${selectedTotalPrice.toFixed(2)}</span>
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
                                    Proceed to Payment
                                </Button>
                                {user && (
                                    <Button variant='outline' size='lg' className='w-full' asChild>
                                        <Link to={`/${ROUTES.ORDERS.LIST}`}>View My Orders</Link>
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
