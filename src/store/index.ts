import { configureStore } from '@reduxjs/toolkit';

import authReducer, { type IAuthState } from './auth/auth.slice';
import userReducer, { type IUserState } from './user/user.slice';

import cartReducer, { type ICartState } from '@/features/cart/store/cart.slice';
import foodReducer, { type IFoodState } from '@/features/food/store/food.slice';

export type RootState = {
    auth: IAuthState;
    user: IUserState;
    cart: ICartState;
    food: IFoodState;
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        cart: cartReducer,
        food: foodReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
    devTools: import.meta.env.DEV,
});

export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
