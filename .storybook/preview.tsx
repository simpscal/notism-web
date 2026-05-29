import { configureStore } from '@reduxjs/toolkit';
import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview, Decorator } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import '../src/app/assets/styles/index.css';
import i18n from '../src/app/i18n/i18n';
import { ThemeProvider } from '../src/core/contexts/theme.context';

// Minimal mock store for Storybook
const mockStore = configureStore({
    reducer: {
        auth: (state = { user: null, isAuthenticated: false, token: null }) => state,
        user: (state = { profile: null }) => state,
        cart: (state = { items: [], total: 0 }) => state,
        food: (state = { items: [], categories: [] }) => state,
    },
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: Infinity,
        },
    },
});

const withProviders: Decorator = Story => (
    <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
                <ThemeProvider defaultTheme='light'>
                    <Story />
                </ThemeProvider>
            </I18nextProvider>
        </QueryClientProvider>
    </Provider>
);

const preview: Preview = {
    decorators: [
        withThemeByClassName({
            themes: {
                light: '',
                dark: 'dark',
            },
            defaultTheme: 'light',
        }),
        withProviders,
    ],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        layout: 'centered',
    },
};

export default preview;
