import { createSlice } from '@reduxjs/toolkit';

import { resetStore } from '../root.actions';

import {
    addItem,
    clearItems,
    loadCart,
    removeItem,
    replaceItemCustomisations,
    updateItemQuantity,
    syncCartItems,
} from './cart.thunks';

import { CartItemViewModel } from '@/features/cart/models';

const CART_STORAGE_KEY = 'cart_items';

const setCartInStorage = (items: CartItemViewModel[]) => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
};

const clearCartStorage = () => {
    localStorage.removeItem(CART_STORAGE_KEY);
};

export interface ICartState {
    items: CartItemViewModel[];
    isInitialized: boolean;
}

const INITIAL_STATE: ICartState = {
    items: [],
    isInitialized: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: INITIAL_STATE,
    reducers: {
        resetCart: () => INITIAL_STATE,
        setItemSelection: (state, action: { payload: { id: string; isSelected: boolean } }) => {
            const item = state.items.find(item => item.id === action.payload.id);
            if (item) {
                item.isSelected = action.payload.isSelected;
            }
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loadCart.fulfilled, (state, action) => {
                state.items = action.payload.map(item => ({
                    ...item,
                    isSelected: item.isSelected ?? true,
                }));
                state.isInitialized = true;
            })
            .addCase(loadCart.rejected, state => {
                state.isInitialized = true;
            });

        builder.addCase(addItem.fulfilled, (state, action) => {
            const { item: newItem, isAuthenticated } = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (existingItem) {
                existingItem.quantity = Math.min(existingItem.quantity + newItem.quantity, newItem.stockQuantity);
            } else {
                state.items.push(newItem);
            }

            if (!isAuthenticated && state.isInitialized) {
                setCartInStorage(state.items);
            }
        });

        builder.addCase(updateItemQuantity.fulfilled, (state, action) => {
            if (action.payload.isAuthenticated) {
                const { id, quantity } = action.payload;
                const item = state.items.find(item => item.id === id);

                if (item) {
                    item.quantity = quantity;
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

                if (state.isInitialized) {
                    setCartInStorage(state.items);
                }
            }
        });

        builder.addCase(removeItem.fulfilled, (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);

            if (!action.payload.isAuthenticated && state.isInitialized) {
                setCartInStorage(state.items);
            }
        });

        builder.addCase(clearItems.fulfilled, (state, action) => {
            state.items = [];
            if (!action.payload.isAuthenticated) {
                clearCartStorage();
            }
        });

        builder.addCase(replaceItemCustomisations.fulfilled, (state, action) => {
            const { id, updatedItem } = action.payload;
            const item = state.items.find(item => item.id === id);
            if (item) {
                item.customisations = updatedItem.customisations;
                item.totalSurcharge = updatedItem.totalSurcharge;
            }
        });

        builder.addCase(syncCartItems.fulfilled, (_, action) => {
            if (action.payload.synced) {
                clearCartStorage();
            }
        });

        builder.addCase(resetStore, () => {
            clearCartStorage();
            return INITIAL_STATE;
        });
    },
});

export const { resetCart, setItemSelection } = cartSlice.actions;

export default cartSlice.reducer;
