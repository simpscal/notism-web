import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './app/assets/styles/index.css';
import { BrowserRouter } from 'react-router-dom';

import App from './app.tsx';
import { store } from './store';

import { IconProvider } from '@/components/icon/icon-context';
import { ThemeProvider, AppInitializeProvider } from '@/core/contexts';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <ThemeProvider>
                        <IconProvider>
                            <AppInitializeProvider>
                                <App />
                                {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
                            </AppInitializeProvider>
                        </IconProvider>
                    </ThemeProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </Provider>
    </StrictMode>
);
