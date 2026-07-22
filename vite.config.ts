import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv, type Plugin } from 'vite';

// Opt-in only — `npm run analyze` sets ANALYZE=true. Never runs in normal dev/CI/prod builds.
const isAnalyze = Boolean(process.env.ANALYZE);

// Stamps `public/sw.js`'s `__BUILD_ID__` / `__API_ORIGIN__` placeholders into the
// built `dist/sw.js` after every build. A fresh CACHE_VERSION per build makes the
// service worker's `activate` handler reliably evict the previous deploy's caches;
// the API origin lets it recognize which cross-origin GETs to stale-while-revalidate.
function swVersionStamp(mode: string): Plugin {
    let outDir = 'dist';
    let apiOrigin = '';

    return {
        name: 'sw-version-stamp',
        apply: 'build',
        configResolved(config) {
            outDir = config.build.outDir;
            const env = loadEnv(mode, process.cwd());
            apiOrigin = env.VITE_API_BASE_URL ? new URL(env.VITE_API_BASE_URL).origin : '';
        },
        closeBundle() {
            const swPath = path.resolve(outDir, 'sw.js');
            if (!existsSync(swPath)) {
                return;
            }

            let buildId: string;
            try {
                buildId = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
                    .toString()
                    .trim();
            } catch {
                buildId = Date.now().toString(36);
            }

            const contents = readFileSync(swPath, 'utf-8')
                .replaceAll('__BUILD_ID__', buildId)
                .replaceAll('__API_ORIGIN__', apiOrigin);

            writeFileSync(swPath, contents);
        },
    };
}

export default defineConfig(({ mode }) => ({
    plugins: [
        react(),
        tailwindcss(),
        swVersionStamp(mode),
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
            '@/uis': path.resolve(__dirname, './src/uis'),
            '@/utils': path.resolve(__dirname, './src/app/utils'),
            '@/enums': path.resolve(__dirname, './src/app/enums'),
            '@/constants': path.resolve(__dirname, './src/app/constants'),
            '@/hooks': path.resolve(__dirname, './src/core/hooks'),
            '@/contexts': path.resolve(__dirname, './src/core/contexts'),
        },
    },
}));
