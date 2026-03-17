import { useCallback } from 'react';

import { CartItemViewModel } from '../models';

import { useAppDispatch } from '@/core/hooks';
import { addItem, removeItem, updateItemQuantity } from '@/store/cart/cart.thunks';

export function useCart() {
    const dispatch = useAppDispatch();

    const addToCart = useCallback(
        async (item: Omit<CartItemViewModel, 'quantity'>, quantity: number) => {
            await dispatch(addItem({ item, quantity })).unwrap();
        },
        [dispatch]
    );

    const updateCartItemQuantity = useCallback(
        async (id: string, quantity: number) => {
            await dispatch(updateItemQuantity({ id, quantity })).unwrap();
        },
        [dispatch]
    );

    const removeFromCart = useCallback(
        async (id: string) => {
            await dispatch(removeItem(id)).unwrap();
        },
        [dispatch]
    );

    return {
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
    };
}
