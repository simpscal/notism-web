import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { loadCart } from '@/store/cart';

export function useReloadCart() {
    const dispatch = useAppDispatch();
    const cartIsInitialized = useAppSelector(state => state.cart.isInitialized);
    const authIsInitialized = useAppSelector(state => state.auth.isInitialized);

    useEffect(() => {
        if (authIsInitialized && !cartIsInitialized) {
            dispatch(loadCart());
        }
    }, [dispatch, authIsInitialized, cartIsInitialized]);
}
