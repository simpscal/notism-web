import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./test/setup.ts'],
    },
    resolve: {
        alias: {
            '@/test': path.resolve(__dirname, './test'),
            '@/mocks': path.resolve(__dirname, './mocks'),
            '@': path.resolve(__dirname, './src'),
            '@/uis': path.resolve(__dirname, './src/uis'),
            '@/utils': path.resolve(__dirname, './src/app/utils'),
            '@/enums': path.resolve(__dirname, './src/app/enums'),
            '@/constants': path.resolve(__dirname, './src/app/constants'),
            '@/hooks': path.resolve(__dirname, './src/core/hooks'),
            '@/contexts': path.resolve(__dirname, './src/core/contexts'),
        },
    },
});
