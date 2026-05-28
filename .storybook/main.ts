import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
    stories: ['../src/stories/**/*.stories.@(ts|tsx|js|jsx)'],
    addons: ['@storybook/addon-docs', '@storybook/addon-themes'],
    framework: '@storybook/react-vite',
};

export default config;
