import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './app/assets/styles/index.css';
import { BrowserRouter } from 'react-router-dom';

import { i18nReady } from './app/i18n/i18n';
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

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const app = (
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

Promise.all([enableMocking(), i18nReady]).then(() => {
    const container = document.getElementById('root')!;

    // The SSR server injects real markup (element children) into `#root` for the routes
    // it renders — hydrate those. Every other route is still served as the plain static
    // shell (the `<!--app-html-->` placeholder is left untouched, so `#root` has no
    // element children), so mount fresh exactly like the old CSR-only bootstrap did.
    if (container.children.length > 0) {
        hydrateRoot(container, app);
    } else {
        createRoot(container).render(app);
    }

    // Prod-only: never runs in dev, so it never collides with MSW's own
    // /mockServiceWorker.js registration.
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
        navigator.serviceWorker.register('/sw.js');
    }
});
