import { CartItemModel } from '@/apis';
import { getFoodPricing } from '@/features/food/utils';
import { RootState } from '@/store';

const CART_STORAGE_KEY = 'cart_items';

export const getCartFromStorage = (): CartItemModel[] => {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (!stored) return [];
        const items = JSON.parse(stored) as CartItemModel[];
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
    state.cart.items.reduce((total: number, item: CartItemModel) => total + item.quantity, 0);

export const selectCartIsInitialized = (state: RootState) => state.cart.isInitialized;

export const selectSelectedCartItems = (state: RootState) =>
    state.cart.items.filter((item: CartItemModel) => item.isSelected);

export const selectSelectedCartTotalPrice = (state: RootState) =>
    state.cart.items
        .filter((item: CartItemModel) => item.isSelected)
        .reduce((total: number, item: CartItemModel) => {
            const itemPrice = getFoodPricing(item.price, item.discountPrice).effectivePrice;
            return total + (itemPrice + item.totalSurcharge) * item.quantity;
        }, 0);
