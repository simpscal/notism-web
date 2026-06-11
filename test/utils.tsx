import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import i18n from '@/app/i18n/i18n';
import { ThemeProvider } from '@/core/contexts/theme.context';
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
    initialEntries?: string[];
}

function TestProviders({ children, queryClient, initialEntries }: TestProvidersProps) {
    const client = queryClient ?? createTestQueryClient();
    return (
        <Provider store={store}>
            <QueryClientProvider client={client}>
                <I18nextProvider i18n={i18n}>
                    <ThemeProvider defaultTheme='light'>
                        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
                    </ThemeProvider>
                </I18nextProvider>
            </QueryClientProvider>
        </Provider>
    );
}

function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & { queryClient?: QueryClient; initialEntries?: string[] }
) {
    const { queryClient, initialEntries, ...renderOptions } = options ?? {};
    return render(ui, {
        wrapper: ({ children }) => (
            <TestProviders queryClient={queryClient} initialEntries={initialEntries}>
                {children}
            </TestProviders>
        ),
        ...renderOptions,
    });
}

export { createTestQueryClient, renderWithProviders };
