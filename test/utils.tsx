import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

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
}

function TestProviders({ children, queryClient }: TestProvidersProps) {
    const client = queryClient ?? createTestQueryClient();
    return (
        <Provider store={store}>
            <QueryClientProvider client={client}>
                <I18nextProvider i18n={i18n}>
                    <MemoryRouter>{children}</MemoryRouter>
                </I18nextProvider>
            </QueryClientProvider>
        </Provider>
    );
}

function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient }
) {
    const { queryClient, ...renderOptions } = options ?? {};
    return render(ui, {
        wrapper: ({ children }) => <TestProviders queryClient={queryClient}>{children}</TestProviders>,
        ...renderOptions,
    });
}

export { createTestQueryClient, renderWithProviders };
