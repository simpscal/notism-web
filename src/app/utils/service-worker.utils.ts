// Pure, tested mirror of the caching logic hand-rolled in `public/sw.js`.
//
// `public/sw.js` runs as a classic (non-module) service worker script — it cannot
// `import` from `src/**` at runtime — so its cache-first / stale-while-revalidate /
// cache-trim logic is duplicated there in plain JS. This module is the single
// unit-tested source of truth for that logic; keep both files in sync when the
// caching strategy changes.

export const STATIC_ASSET_EXTENSIONS_REGEX = /\.(?:js|css|html|svg|ico|png|jpe?g|gif|webp|woff2?|ttf)$/i;

export interface CacheLike {
    match(request: Request): Promise<Response | undefined>;
    put(request: Request, response: Response): Promise<void>;
    keys(): Promise<readonly Request[]>;
    delete(request: Request): Promise<boolean>;
}

/**
 * Same-origin navigations (SPA route documents) and same-origin static assets
 * (JS/CSS/HTML/SVG/icons) belong in the cache-first app-shell bucket.
 */
export function isAppShellRequest(
    request: Pick<Request, 'mode'>,
    url: Pick<URL, 'origin' | 'pathname'>,
    selfOrigin: string
): boolean {
    if (url.origin !== selfOrigin) {
        return false;
    }
    return request.mode === 'navigate' || STATIC_ASSET_EXTENSIONS_REGEX.test(url.pathname);
}

/** GET requests to the API origin belong in the stale-while-revalidate api-cache bucket. */
export function isApiRequest(url: Pick<URL, 'origin'>, apiOrigin: string): boolean {
    return apiOrigin !== '' && url.origin === apiOrigin;
}

/**
 * Given cache keys in `cache.keys()` insertion order, returns the oldest entries
 * that exceed `maxEntries` — the ones a caller should evict.
 */
export function selectStaleCacheKeys<T>(keys: readonly T[], maxEntries: number): readonly T[] {
    if (keys.length <= maxEntries) {
        return [];
    }
    return keys.slice(0, keys.length - maxEntries);
}

/** Deletes the oldest entries in `cache` so it never exceeds `maxEntries`. */
export async function trimCache(cache: CacheLike, maxEntries: number): Promise<void> {
    const keys = await cache.keys();
    const staleKeys = selectStaleCacheKeys(keys, maxEntries);
    await Promise.all(staleKeys.map(key => cache.delete(key)));
}

/** Cache-first: serve from cache if present, else fetch network and populate cache. */
export async function cacheFirst(
    cache: CacheLike,
    request: Request,
    fetcher: (request: Request) => Promise<Response>
): Promise<Response> {
    const cached = await cache.match(request);
    if (cached) {
        return cached;
    }

    const response = await fetcher(request);
    if (response.ok) {
        await cache.put(request, response.clone());
    }
    return response;
}

/**
 * Stale-while-revalidate: return the cached response immediately (if any) while a
 * background fetch updates the cache and trims it to `maxEntries`. Falls back to
 * the network directly when there is no cache entry yet.
 */
export async function staleWhileRevalidate(
    cache: CacheLike,
    request: Request,
    fetcher: (request: Request) => Promise<Response>,
    maxEntries: number
): Promise<Response> {
    const cached = await cache.match(request);

    const revalidate = fetcher(request)
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
