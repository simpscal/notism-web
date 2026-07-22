import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// `react-dom/server` resolves to a different (mutually exclusive) API per runtime export
// condition — Node gets `renderToPipeableStream`, Bun/edge get `renderToReadableStream`.
// This app runs on Bun in every environment (dev, build tooling, and the production
// server), so importing the explicit `.browser` subpath pins the Web Streams API
// deterministically, regardless of which condition a given resolver would otherwise pick.
import { renderToReadableStream } from 'react-dom/server.browser';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

import App from './app';
import { i18nReady } from './app/i18n/i18n';
import type { SsrRenderResult } from './entry-server.types';
import { createStore } from './store';

import { ThemeProvider } from '@/core/contexts';

export type { SsrRenderResult } from './entry-server.types';

interface RouteMeta {
    title: string;
    description: string;
}

// Only `/` is SSR'd this sprint (see refactor #334) — every other route falls back
// to the plain static SPA shell, so it has no entry here.
const ROUTE_META: Record<string, RouteMeta> = {
    '/': {
        title: 'Notism — Order fresh food in minutes',
        description: 'Browse menus, customize your order, and track delivery in real time with Notism.',
    },
};

const HTML_ESCAPES: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
};

function escapeHtml(value: string): string {
    return value.replace(/[&<>"]/g, char => HTML_ESCAPES[char]);
}

function buildHeadExtra(meta: RouteMeta, canonicalUrl: string): string {
    const title = escapeHtml(meta.title);
    const description = escapeHtml(meta.description);
    const url = escapeHtml(canonicalUrl);

    return [
        `<meta name="description" content="${description}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:title" content="${title}" />`,
        `<meta property="og:description" content="${description}" />`,
        `<meta property="og:url" content="${url}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${title}" />`,
        `<meta name="twitter:description" content="${description}" />`,
        `<link rel="canonical" href="${url}" />`,
    ].join('\n        ');
}

// Fresh Redux store + QueryClient per call — a module-level singleton would leak
// state (auth, cart, …) across concurrent requests on the server.
async function renderAppHtml(url: string): Promise<string> {
    const store = createStore();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    const app = (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <StaticRouter location={url}>
                    <ThemeProvider>
                        <App />
                    </ThemeProvider>
                </StaticRouter>
            </QueryClientProvider>
        </Provider>
    );

    let caughtError: unknown;
    const stream = await renderToReadableStream(app, {
        onError(error) {
            caughtError = error;
        },
    });

    // Waits for every Suspense boundary — including the route's `React.lazy` chunk —
    // to resolve before we read the stream, so crawlers get the fully rendered page
    // in the first response instead of a loading fallback.
    await stream.allReady;

    if (caughtError) {
        throw caughtError;
    }

    return new Response(stream).text();
}

export async function render(url: string, origin: string): Promise<SsrRenderResult> {
    await i18nReady;

    const meta = ROUTE_META[url] ?? ROUTE_META['/'];
    const html = await renderAppHtml(url);

    return {
        html,
        title: escapeHtml(meta.title),
        headExtra: buildHeadExtra(meta, `${origin}${url}`),
    };
}
