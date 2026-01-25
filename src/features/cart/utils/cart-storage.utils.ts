import { CartItemViewModel } from '../models';

const CART_STORAGE_KEY = 'cart_items';

export const cartStorageUtils = {
    getCart: (): CartItemViewModel[] => {
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (!stored) return [];
            return JSON.parse(stored) as CartItemViewModel[];
        } catch {
            return [];
        }
    },

    setCart: (items: CartItemViewModel[]) => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('Failed to save cart to localStorage:', error);
        }
    },

    clearCart: () => {
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch (error) {
            console.error('Failed to clear cart from localStorage:', error);
        }
    },
};
