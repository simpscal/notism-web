import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AppRoutes from './app.routes';
import { loadCart } from './store/cart';
import { loadCategories } from './store/food';
import Spinner from './uis/spinner';

import { navigationUtils } from '@/app/utils/navigation.utils';
import { useAppDispatch, useReloadUser } from '@/core/hooks';
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
