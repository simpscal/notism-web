import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import type { StorybookConfig } from '@storybook/react-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
    stories: ['../src/stories/**/*.stories.@(ts|tsx)'],
    addons: ['@storybook/addon-a11y', '@storybook/addon-themes'],
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    async viteFinal(config) {
        const { mergeConfig } = await import('vite');
        return mergeConfig(config, {
            resolve: {
                alias: {
                    '@': resolve(__dirname, '../src'),
                    '@/components': resolve(__dirname, '../src/components'),
                    '@/utils': resolve(__dirname, '../src/app/utils'),
                    '@/enums': resolve(__dirname, '../src/app/enums'),
                    '@/constants': resolve(__dirname, '../src/app/constants'),
                    '@/hooks': resolve(__dirname, '../src/core/hooks'),
                    '@/contexts': resolve(__dirname, '../src/core/contexts'),
                },
            },
        });
    },
};

export default config;
