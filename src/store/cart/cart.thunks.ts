import { createAsyncThunk } from '@reduxjs/toolkit';

import { getCartFromStorage } from './cart.selectors';

import { cartApi } from '@/apis';
import { CartItemViewModel } from '@/features/cart';
import { RootState } from '@/store';

export const loadCart = createAsyncThunk('cart/load', async (_, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = !!state.user.user?.id;

    if (isAuthenticated) {
        const response = await cartApi.getCart();
        return response.items.map(item => ({ ...item, isSelected: true }));
    } else {
        return getCartFromStorage();
    }
});

export const addItem = createAsyncThunk(
    'cart/addItem',
    async ({ item, quantity }: { item: Omit<CartItemViewModel, 'quantity'>; quantity: number }, { getState }) => {
        const state = getState() as RootState;
        const isAuthenticated = !!state.user.user?.id;

        if (isAuthenticated) {
            const response = await cartApi.addItem({
                foodId: item.id,
                quantity,
                ...(item.customisationOptionId ? { customisationOptionId: item.customisationOptionId } : {}),
            });
            return { item: { ...response, quantity, isSelected: true }, isAuthenticated: true as const };
        } else {
            return {
                item: { ...item, quantity, isSelected: true },
                isAuthenticated: false as const,
            };
        }
    }
);

export const updateItemQuantity = createAsyncThunk(
    'cart/updateItemQuantity',
    async ({ id, quantity }: { id: string; quantity: number }, { getState }) => {
        const state = getState() as RootState;
        const isAuthenticated = !!state.user.user?.id;

        if (isAuthenticated) {
            await cartApi.updateItemQuantity(id, { quantity });
            return { id, quantity, isAuthenticated: true as const };
        } else {
            return { id, quantity, isAuthenticated: false as const };
        }
    }
);

export const removeItem = createAsyncThunk('cart/removeItem', async (id: string, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = !!state.user.user?.id;

    if (isAuthenticated) {
        await cartApi.removeItem(id);
        return { id, isAuthenticated: true as const };
    } else {
        return { id, isAuthenticated: false as const };
    }
});

export const clearItems = createAsyncThunk('cart/clearCart', async (_, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = !!state.user.user?.id;

    if (isAuthenticated) {
        await cartApi.clearCart();
    }
    return { isAuthenticated };
});

export const updateItemCustomisation = createAsyncThunk(
    'cart/updateItemCustomisation',
    async ({
        id,
        customisationOptionId,
        customisationGroupId,
        customisationGroupLabel,
        customisationLabel,
        surcharge,
    }: {
        id: string;
        customisationOptionId: string;
        customisationGroupId: string | null;
        customisationGroupLabel: string | null;
        customisationLabel: string;
        surcharge: number | null;
    }) => {
        await cartApi.updateItemCustomisation(id, { customisationOptionId });
        return {
            id,
            customisationOptionId,
            customisationGroupId,
            customisationGroupLabel,
            customisationLabel,
            surcharge,
        };
    }
);

export const syncCartItems = createAsyncThunk('cart/syncCartItems', async (_, { getState }) => {
    const state = getState() as RootState;
    const isAuthenticated = !!state.user.user?.id;

    if (!isAuthenticated || !state.cart.items?.length) {
        return { synced: false };
    }

    const items = state.cart.items.map(item => ({
        foodId: item.id,
        quantity: item.quantity,
    }));

    await cartApi.bulkAddItems({ items });

    return { synced: true };
});
