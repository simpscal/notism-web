import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import i18n from '@/app/i18n/i18n';
import { store } from '@/store';

function createTestQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
}

interface TestProvidersProps {
    children: ReactNode;
    queryClient?: QueryClient;
    route?: string;
    path?: string;
}

function TestProviders({ children, queryClient, route, path }: TestProvidersProps) {
    const client = queryClient ?? createTestQueryClient();
    const routedChildren =
        path !== undefined ? (
            <Routes>
                <Route path={path} element={children} />
            </Routes>
        ) : (
            children
        );
    return (
        <Provider store={store}>
            <QueryClientProvider client={client}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter initialEntries={route ? [route] : undefined}>{routedChildren}</MemoryRouter>
                </I18nextProvider>
            </QueryClientProvider>
        </Provider>
    );
}

function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient; route?: string; path?: string }
) {
    const { queryClient, route, path, ...renderOptions } = options ?? {};
    return render(ui, {
        wrapper: ({ children }) => (
            <TestProviders queryClient={queryClient} route={route} path={path}>
                {children}
            </TestProviders>
        ),
        ...renderOptions,
    });
}

export { createTestQueryClient, renderWithProviders };
