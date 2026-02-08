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
            const itemPrice = item.discountPrice ?? item.price;
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
        <div className='container mx-auto px-4 py-8'>
            <h1 className='mb-8 text-3xl font-bold'>Shopping Cart</h1>

            <div className='grid gap-8 lg:grid-cols-3'>
                <div className='lg:col-span-2 space-y-4'>
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
                            <h2 className='text-xl font-semibold'>Order Summary</h2>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            <div className='space-y-2'>
                                {selectedItemsList.length > 0 ? (
                                    selectedItemsList.map(item => {
                                        const hasDiscount =
                                            item.discountPrice !== null && item.discountPrice < item.price;
                                        const effectivePrice = hasDiscount ? item.discountPrice! : item.price;
                                        const itemTotal = effectivePrice * item.quantity;

                                        return (
                                            <div key={item.id} className='flex justify-between text-sm'>
                                                <span className='text-muted-foreground'>
                                                    {item.name} x{item.quantity}
                                                </span>
                                                <span className='font-medium'>${itemTotal.toFixed(2)}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className='text-sm text-muted-foreground'>No items selected</p>
                                )}
                            </div>

                            <Separator />

                            <div className='space-y-2'>
                                <div className='flex justify-between text-lg font-semibold'>
                                    <span>Total</span>
                                    <span>${selectedTotalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className='flex flex-col gap-2'>
                            <Button
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
    );
}

export default memo(Cart);
