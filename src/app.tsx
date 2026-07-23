import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AppRoutes from './app.routes';
import Spinner from './uis/spinner';

import { APP_EVENTS, ROUTES } from '@/app/constants';
import { eventEmitterUtils } from '@/app/utils';
import { navigationUtils } from '@/app/utils/navigation.utils';
import { useAppDispatch, useReloadUser } from '@/core/hooks';
import { loadCart } from '@/features/cart/store';
import { loadCategories } from '@/features/food/store';
import { Toaster } from '@/uis/sonner';

function App() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isInitialized } = useReloadUser();

    useEffect(() => {
        dispatch(loadCategories());
    }, [dispatch]);

    useEffect(() => {
        if (isInitialized) {
            dispatch(loadCart());
        }
    }, [isInitialized]);

    useEffect(() => {
        navigationUtils.initialize(navigate);
    }, [navigate]);

    useEffect(() => {
        const unsubscribe = eventEmitterUtils.on(APP_EVENTS.UNAUTHORIZED, () => {
            navigate(`/${ROUTES.AUTH.LOGIN}`, { replace: true });
        });

        return unsubscribe;
    }, [navigate]);

    if (!isInitialized) {
        return (
            <div className='flex h-screen w-screen items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    return (
        <>
            <AppRoutes />
            <Toaster />
        </>
    );
}

export default App;
