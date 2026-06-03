import { CartItemViewModel } from '@/features/cart/models';
import { getFoodPricing } from '@/features/food/utils';
import { RootState } from '@/store';

const CART_STORAGE_KEY = 'cart_items';

export const getCartFromStorage = (): CartItemViewModel[] => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) return [];
        const items = JSON.parse(stored) as CartItemViewModel[];
        return items.map(item => ({
            ...item,
            isSelected: item.isSelected ?? true,
        }));
    } catch {
        return [];
    }
};

export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartTotalItems = (state: RootState) =>
    state.cart.items.reduce((total: number, item: CartItemViewModel) => total + item.quantity, 0);

export const selectCartIsInitialized = (state: RootState) => state.cart.isInitialized;

export const selectSelectedCartItems = (state: RootState) =>
    state.cart.items.filter((item: CartItemViewModel) => item.isSelected);

export const selectSelectedCartTotalPrice = (state: RootState) =>
    state.cart.items
        .filter((item: CartItemViewModel) => item.isSelected)
        .reduce((total: number, item: CartItemViewModel) => {
            const itemPrice = getFoodPricing(item.price, item.discountPrice).effectivePrice;
            return total + (itemPrice + (item.surcharge ?? 0)) * item.quantity;
        }, 0);
