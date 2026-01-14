import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AppRoutes from './app.routes';
import Spinner from './components/spinner';

import { navigationUtils } from '@/app/utils/navigation.utils';
import { Toaster } from '@/components/sonner';
import { useReloadUser } from '@/core/hooks';

function App() {
    const navigate = useNavigate();
    const { isInitialized } = useReloadUser();

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
