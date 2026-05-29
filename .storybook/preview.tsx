import { withThemeByClassName } from '@storybook/addon-themes';
import type { Preview, Decorator } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';

import '../src/app/assets/styles/index.css';
import i18n from '../src/app/i18n/i18n';
import { ThemeProvider } from '../src/core/contexts/theme.context';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            staleTime: Infinity,
        },
    },
});

const withProviders: Decorator = Story => (
    <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
            <ThemeProvider defaultTheme='light'>
                <Story />
            </ThemeProvider>
        </I18nextProvider>
    </QueryClientProvider>
);

const withLocale: Decorator = (Story, context) => {
    const { locale } = context.globals;

    const LocalizedStory = () => {
        useEffect(() => {
            i18n.changeLanguage(locale);
        }, [locale]);

        return <Story />;
    };

    return <LocalizedStory />;
};

const preview: Preview = {
    globalTypes: {
        locale: {
            description: 'Locale for i18n',
            defaultValue: 'en',
            toolbar: {
                title: 'Locale',
                icon: 'globe',
                items: [
                    { value: 'en', title: 'English' },
                    { value: 'vi', title: 'Tiếng Việt' },
                ],
                dynamicTitle: true,
            },
        },
    },
    decorators: [
        withThemeByClassName({
            themes: {
                light: '',
                dark: 'dark',
            },
            defaultTheme: 'light',
        }),
        withLocale,
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
