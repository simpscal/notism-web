// Hand-rolled service worker — no vite-plugin-pwa / Workbox.
//
// CACHE_VERSION and API_ORIGIN below are stamped from build-time placeholders by
// Vite's `sw-version-stamp` plugin (see vite.config.ts) after every production
// build, so each deploy gets a fresh cache version (evicting the previous deploy's
// caches on activate) and the correct cross-origin API origin to intercept.
//
// This file runs as a classic (non-module) service worker, so it cannot `import`
// from `src/**` and has no unit test coverage.

const CACHE_VERSION = '__BUILD_ID__';
const API_ORIGIN = '__API_ORIGIN__';

const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const API_CACHE = `api-cache-${CACHE_VERSION}`;
const API_CACHE_MAX_ENTRIES = 100;

const STATIC_ASSET_EXTENSIONS_REGEX = /\.(?:js|css|html|svg|ico|png|jpe?g|gif|webp|woff2?|ttf)$/i;

function isAppShellRequest(request, url) {
    if (url.origin !== self.location.origin) {
        return false;
    }
    return request.mode === 'navigate' || STATIC_ASSET_EXTENSIONS_REGEX.test(url.pathname);
}

function isApiRequest(url) {
    return API_ORIGIN !== '' && url.origin === API_ORIGIN;
}

async function trimCache(cache, maxEntries) {
    const keys = await cache.keys();
    if (keys.length <= maxEntries) {
        return;
    }
    const staleKeys = keys.slice(0, keys.length - maxEntries);
    await Promise.all(staleKeys.map(key => cache.delete(key)));
}

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
        return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
        await cache.put(request, response.clone());
    }
    return response;
}

async function staleWhileRevalidate(request, cacheName, maxEntries) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    const revalidate = fetch(request)
        .then(async response => {
            if (response.ok) {
                await cache.put(request, response.clone());
                await trimCache(cache, maxEntries);
            }
            return response;
        })
        .catch(() => undefined);

    if (cached) {
        return cached;
    }

    const networkResponse = await revalidate;
    if (networkResponse) {
        return networkResponse;
    }

    throw new Error('Network request failed and no cached response is available');
}

self.addEventListener('install', () => {
    // No eager precache list — enumerating Vite's content-hashed asset filenames
    // at write time isn't possible. The app shell cache fills lazily as routes and
    // assets are visited online.
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames
                    .filter(name => name !== APP_SHELL_CACHE && name !== API_CACHE)
                    .map(name => caches.delete(name))
            );
            await self.clients.claim();
        })()
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    if (isAppShellRequest(request, url)) {
        event.respondWith(cacheFirst(request, APP_SHELL_CACHE));
        return;
    }

    if (isApiRequest(url)) {
        event.respondWith(staleWhileRevalidate(request, API_CACHE, API_CACHE_MAX_ENTRIES));
        return;
    }

    // Non-GET was already returned above. Everything else here is a cross-origin,
    // non-API request (e.g. Google Fonts) — pass through untouched, no interception.
});
