import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { loadCart } from '@/store/cart';

export function useReloadCart() {
    const dispatch = useAppDispatch();
    const isInitialized = useAppSelector(state => state.cart.isInitialized);

    useEffect(() => {
        if (!isInitialized) {
            dispatch(loadCart());
        }
    }, [dispatch, isInitialized]);
}
