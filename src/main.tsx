import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './app/assets/styles/index.css';
import { BrowserRouter } from 'react-router-dom';

import App from './app.tsx';
import { store } from './store';

import { ThemeProvider } from '@/core/contexts';

async function enableMocking() {
    if (import.meta.env.VITE_ENABLE_MOCK !== 'true') {
        return;
    }

    const { worker } = await import('../mocks/browser');
    return worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
            url: '/mockServiceWorker.js',
        },
    });
}

const queryClient = new QueryClient();

enableMocking().then(() => {
    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <ThemeProvider>
                            <App />
                            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
                        </ThemeProvider>
                    </BrowserRouter>
                </QueryClientProvider>
            </Provider>
        </StrictMode>
    );
});
