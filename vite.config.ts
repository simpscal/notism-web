import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    envPrefix: ['VITE_', 'REACT_APP_'],
    server: {
        port: 4200,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/utils': path.resolve(__dirname, './src/app/utils'),
            '@/enums': path.resolve(__dirname, './src/app/enums'),
            '@/constants': path.resolve(__dirname, './src/app/constants'),
            '@/hooks': path.resolve(__dirname, './src/core/hooks'),
            '@/contexts': path.resolve(__dirname, './src/core/contexts'),
        },
    },
});
