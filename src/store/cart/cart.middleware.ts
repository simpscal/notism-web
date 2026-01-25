import { Middleware } from '@reduxjs/toolkit';

import { addItem, clearItems, removeItem, updateItemQuantity } from './cart.thunks';

import { cartStorageUtils } from '@/features/cart';
import { RootState } from '@/store';

const middlewareImpl: Middleware<Record<string, never>, RootState> = storeApi => next => action => {
    const result = next(action);
    const state = storeApi.getState();
    const isAuthenticated = !!state.auth.accessToken;

    if (!state.cart.isInitialized) {
        return result;
    }

    if (
        addItem.fulfilled.match(action) ||
        updateItemQuantity.fulfilled.match(action) ||
        removeItem.fulfilled.match(action) ||
        clearItems.fulfilled.match(action)
    ) {
        if (isAuthenticated) {
            return result;
        }

        cartStorageUtils.setCart(state.cart.items);
    }

    return result;
};

export const cartPersistenceMiddleware = middlewareImpl;
