import { useCallback } from 'react';

import { CartItemModel } from '@/apis';
import { useAppDispatch } from '@/core/hooks';
import { addItem, removeItem, replaceItemCustomisations, updateItemQuantity } from '@/store/cart/cart.thunks';

export function useCart() {
    const dispatch = useAppDispatch();

    const addToCart = useCallback(
        async (item: Omit<CartItemModel, 'quantity'>, quantity: number) => {
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

    const replaceCartItemCustomisations = useCallback(
        async (params: { id: string; customisations: { groupId: string; optionId: string }[] }) => {
            await dispatch(replaceItemCustomisations(params)).unwrap();
        },
        [dispatch]
    );

    return {
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        replaceCartItemCustomisations,
    };
}
