import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions, screen } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import { ThemeProvider } from '@/core/contexts/theme.context';
import i18n from '@/core/i18n/i18n';
import { store } from '@/store';

type I18nTextOptions = Record<string, unknown>;

// Resolves the translation key through the live i18n instance before delegating to
// Testing Library's *ByText queries, so assertions stay correct under every locale
// instead of hardcoding the English copy.
function getByI18nText(key: string, opts?: I18nTextOptions) {
    return screen.getByText(i18n.t(key, opts));
}

function getAllByI18nText(key: string, opts?: I18nTextOptions) {
    return screen.getAllByText(i18n.t(key, opts));
}

function queryByI18nText(key: string, opts?: I18nTextOptions) {
    return screen.queryByText(i18n.t(key, opts));
}

function findByI18nText(key: string, opts?: I18nTextOptions) {
    return screen.findByText(i18n.t(key, opts));
}

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

export { createTestQueryClient, renderWithProviders, getByI18nText, getAllByI18nText, queryByI18nText, findByI18nText };
