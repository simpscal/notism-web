import { createAsyncThunk } from '@reduxjs/toolkit';

import { cartApi } from '@/apis';
import { CartItemViewModel, cartStorageUtils } from '@/features/cart';
import { mapCartItemResponseToViewModel } from '@/features/cart/utils';
import { RootState } from '@/store';

export const loadCart = createAsyncThunk('cart/load', async (_, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = !!state.auth.accessToken;

    if (isAuthenticated) {
        const response = await cartApi.getCart();
        return response.items.map(mapCartItemResponseToViewModel);
    } else {
        return cartStorageUtils.getCart();
    }
});

export const addItem = createAsyncThunk(
    'cart/addItem',
    async ({ item, quantity }: { item: Omit<CartItemViewModel, 'quantity'>; quantity: number }, { getState }) => {
        const state = getState() as RootState;
        const isAuthenticated = !!state.auth.accessToken;

        if (isAuthenticated) {
            const response = await cartApi.addItem({ foodId: item.id, quantity });
            return { item: mapCartItemResponseToViewModel(response), isAuthenticated: true as const };
        } else {
            return {
                item: { ...item, quantity: Math.min(quantity, item.stockQuantity) },
                isAuthenticated: false as const,
            };
        }
    }
);

export const updateItemQuantity = createAsyncThunk(
    'cart/updateItemQuantity',
    async ({ id, quantity }: { id: string; quantity: number }, { getState }) => {
        const state = getState() as RootState;
        const isAuthenticated = !!state.auth.accessToken;

        if (isAuthenticated) {
            const response = await cartApi.updateItemQuantity(id, { quantity });
            return { item: mapCartItemResponseToViewModel(response), isAuthenticated: true as const };
        } else {
            return { id, quantity, isAuthenticated: false as const };
        }
    }
);

export const removeItem = createAsyncThunk('cart/removeItem', async (id: string, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = !!state.auth.accessToken;

    if (isAuthenticated) {
        await cartApi.removeItem(id);
        return { id, isAuthenticated: true as const };
    } else {
        return { id, isAuthenticated: false as const };
    }
});

export const clearItems = createAsyncThunk('cart/clearCart', async (_, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = !!state.auth.accessToken;

    if (isAuthenticated) {
        await cartApi.clearCart();
    } else {
        cartStorageUtils.clearCart();
    }
});
