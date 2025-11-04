import { useContext } from 'react';

import AppRoutes from './app.routes';

import { Toaster } from '@/components/ui/sonner';
import Spinner from '@/components/ui/spinner';
import { AppInitializeContext } from '@/core/contexts';

function App() {
    const { isInitialized } = useContext(AppInitializeContext);

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
