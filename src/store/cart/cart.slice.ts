import { createSlice } from '@reduxjs/toolkit';

import { addItem, clearItems, loadCart, removeItem, updateItemQuantity } from './cart.thunks';

import { CartItemViewModel } from '@/features/cart/models';

export interface CartState {
    items: CartItemViewModel[];
    isInitialized: boolean;
}

const INITIAL_STATE: CartState = {
    items: [],
    isInitialized: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: INITIAL_STATE,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loadCart.fulfilled, (state, action) => {
                state.items = action.payload;
                state.isInitialized = true;
            })
            .addCase(loadCart.rejected, state => {
                state.isInitialized = true;
            });

        builder.addCase(addItem.fulfilled, (state, action) => {
            const { item: newItem } = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity = Math.min(existingItem.quantity + newItem.quantity, newItem.stockQuantity);
            } else {
                state.items.push(newItem);
            }
        });

        builder.addCase(updateItemQuantity.fulfilled, (state, action) => {
            if (action.payload.isAuthenticated) {
                const { item: updatedItem } = action.payload;
                const item = state.items.find(item => item.id === updatedItem.id);

                if (item) {
                    item.quantity = updatedItem.quantity;
                }
            } else {
                const { id, quantity } = action.payload;
                const item = state.items.find(cartItem => cartItem.id === id);

                if (item) {
                    if (quantity <= 0) {
                        state.items = state.items.filter(cartItem => cartItem.id !== id);
                    } else {
                        item.quantity = Math.min(quantity, item.stockQuantity);
                    }
                }
            }
        });

        builder.addCase(removeItem.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
        });

        builder.addCase(clearItems.fulfilled, state => {
            state.items = [];
        });
    },
});

export default cartSlice.reducer;
