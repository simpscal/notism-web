import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import OrderPanel from './order-panel';

import { ROUTES } from '@/app/constants';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/sheet';
import { useAppSelector } from '@/core/hooks';
import { useCart } from '@/features/cart';
import { selectCartItems, selectCartTotalItems, selectSelectedCartTotalPrice } from '@/store/cart';

interface OrderSidebarProps {
    /** Whether the mobile order drawer is open. */
    open: boolean;
    /** Requests a change to the drawer open state. */
    onOpenChange: (open: boolean) => void;
}

// Persistent order Summary Panel. Reads the existing cart slice via its memoized
// selectors (no new state) and wires line-level quantity/remove to the existing
// cart thunks. Renders inline on desktop (lg+) and collapses into the shared
// Sheet drawer below lg, both driven by the same OrderPanel body.
function OrderSidebar({ open, onOpenChange }: OrderSidebarProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { updateCartItemQuantity, removeFromCart } = useCart();

    const items = useAppSelector(selectCartItems);
    const totalItems = useAppSelector(selectCartTotalItems);
    const totalPrice = useAppSelector(selectSelectedCartTotalPrice);

    const handleIncrement = useCallback(
        (id: string) => {
            const item = items.find(cartItem => cartItem.id === id);
            if (!item || item.quantity >= item.stockQuantity) return;
            void updateCartItemQuantity(id, item.quantity + 1).catch(() => {});
        },
        [items, updateCartItemQuantity]
    );

    const handleDecrement = useCallback(
        (id: string) => {
            const item = items.find(cartItem => cartItem.id === id);
            if (!item || item.quantity <= 1) return;
            void updateCartItemQuantity(id, item.quantity - 1).catch(() => {});
        },
        [items, updateCartItemQuantity]
    );

    const handleRemove = useCallback(
        (id: string) => {
            void removeFromCart(id)
                .then(() => toast.success(t('cart.itemRemoved')))
                .catch(() => {});
        },
        [removeFromCart, t]
    );

    const handleCheckout = useCallback(() => {
        navigate(`/${ROUTES.CART}`);
    }, [navigate]);

    const handleBrowseMenu = useCallback(() => {
        navigate(`/${ROUTES.FOODS.LIST}`);
    }, [navigate]);

    const panel = (
        <OrderPanel
            items={items}
            totalItems={totalItems}
            totalPrice={totalPrice}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onRemove={handleRemove}
            onCheckout={handleCheckout}
            onBrowseMenu={handleBrowseMenu}
        />
    );

    return (
        <>
            <aside className='hidden w-[22rem] shrink-0 flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card p-5 shadow-sm lg:flex'>
                {panel}
            </aside>

            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    side='right'
                    className='w-[88vw] gap-0 p-5 motion-reduce:transition-none motion-reduce:animate-none sm:max-w-sm lg:hidden'
                >
                    <SheetHeader className='p-0'>
                        <SheetTitle className='text-lg font-semibold tracking-tight text-foreground'>
                            {t('orderSidebar.title')}
                        </SheetTitle>
                    </SheetHeader>
                    <div className='mt-4 flex min-h-0 flex-1 flex-col'>{panel}</div>
                </SheetContent>
            </Sheet>
        </>
    );
}

export default memo(OrderSidebar);
