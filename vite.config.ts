import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// Opt-in only — `npm run analyze` sets ANALYZE=true. Never runs in normal dev/CI/prod builds.
const isAnalyze = Boolean(process.env.ANALYZE);

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        ...(isAnalyze ? [visualizer({ filename: 'bundle-stats.html', template: 'treemap', gzipSize: true })] : []),
    ],
    envPrefix: ['VITE_', 'REACT_APP_'],
    server: {
        port: 4200,
    },
    build: {
        // Fires Vite's chunk-size warning well before a chunk creeps back toward the
        // pre-code-split 1.6 MB monolith.
        chunkSizeWarningLimit: 350,
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
