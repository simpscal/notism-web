import { configureStore } from '@reduxjs/toolkit';

import authReducer, { type IAuthState } from './auth/auth.slice';
import cartReducer, { type ICartState } from './cart/cart.slice';
import foodReducer, { type IFoodState } from './food/food.slice';
import userReducer, { type IUserState } from './user/user.slice';

export type RootState = {
    auth: IAuthState;
    user: IUserState;
    cart: ICartState;
    food: IFoodState;
};

// Factory so SSR can instantiate a fresh store per request — a module-level singleton
// would leak state (auth, cart, etc.) across concurrent requests on the server.
export function createStore() {
    return configureStore({
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
}

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
