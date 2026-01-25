import { CartItemViewModel } from '@/features/cart/models';
import { RootState } from '@/store';

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalItems = (state: RootState) =>
    state.cart.items.reduce((total: number, item: CartItemViewModel) => total + item.quantity, 0);

export const selectCartTotalPrice = (state: RootState) =>
    state.cart.items.reduce((total: number, item: CartItemViewModel) => {
        const itemPrice = item.discountPrice ?? item.price;
        return total + itemPrice * item.quantity;
    }, 0);

export const selectCartIsInitialized = (state: RootState) => state.cart.isInitialized;
