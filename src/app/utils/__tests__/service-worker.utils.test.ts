import { describe, expect, it, vi } from 'vitest';

import {
    type CacheLike,
    cacheFirst,
    isApiRequest,
    isAppShellRequest,
    selectStaleCacheKeys,
    staleWhileRevalidate,
    trimCache,
} from '../service-worker.utils';

const SELF_ORIGIN = 'https://app.example.com';
const API_ORIGIN = 'https://api.example.com';

function createCacheMock(initialMatch: Response | undefined = undefined): CacheLike & {
    put: ReturnType<typeof vi.fn>;
    match: ReturnType<typeof vi.fn>;
    keys: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
} {
    return {
        match: vi.fn().mockResolvedValue(initialMatch),
        put: vi.fn().mockResolvedValue(undefined),
        keys: vi.fn().mockResolvedValue([]),
        delete: vi.fn().mockResolvedValue(true),
    };
}

describe('isAppShellRequest', () => {
    it('matches a same-origin navigation request', () => {
        const url = new URL('/timeline', SELF_ORIGIN);
        expect(isAppShellRequest({ mode: 'navigate' }, url, SELF_ORIGIN)).toBe(true);
    });

    it('matches a same-origin static asset by extension', () => {
        const url = new URL('/assets/index-abc123.js', SELF_ORIGIN);
        expect(isAppShellRequest({ mode: 'no-cors' }, url, SELF_ORIGIN)).toBe(true);
    });

    it('does not match a same-origin non-navigate, non-static request', () => {
        const url = new URL('/some/api-like/path', SELF_ORIGIN);
        expect(isAppShellRequest({ mode: 'cors' }, url, SELF_ORIGIN)).toBe(false);
    });

    it('does not match a cross-origin request even if it looks like a navigation', () => {
        const url = new URL('/timeline', API_ORIGIN);
        expect(isAppShellRequest({ mode: 'navigate' }, url, SELF_ORIGIN)).toBe(false);
    });
});

describe('isApiRequest', () => {
    it('matches a request to the configured API origin', () => {
        const url = new URL('/orders', API_ORIGIN);
        expect(isApiRequest(url, API_ORIGIN)).toBe(true);
    });

    it('does not match a request to a different origin', () => {
        const url = new URL('/orders', SELF_ORIGIN);
        expect(isApiRequest(url, API_ORIGIN)).toBe(false);
    });

    it('does not match anything when the API origin is not configured', () => {
        const url = new URL('/orders', API_ORIGIN);
        expect(isApiRequest(url, '')).toBe(false);
    });
});

describe('selectStaleCacheKeys', () => {
    it('returns no keys when the cache is within the limit', () => {
        expect(selectStaleCacheKeys(['a', 'b', 'c'], 5)).toEqual([]);
    });

    it('returns no keys when the cache is exactly at the limit', () => {
        expect(selectStaleCacheKeys(['a', 'b'], 2)).toEqual([]);
    });

    it('returns the oldest entries in insertion order when over the limit', () => {
        expect(selectStaleCacheKeys(['a', 'b', 'c', 'd'], 2)).toEqual(['a', 'b']);
    });
});

describe('trimCache', () => {
    it('deletes only the oldest entries beyond maxEntries', async () => {
        const requests = ['a', 'b', 'c', 'd'].map(path => new Request(`${SELF_ORIGIN}/${path}`));
        const cache = createCacheMock();
        cache.keys.mockResolvedValue(requests);

        await trimCache(cache, 2);

        expect(cache.delete).toHaveBeenCalledTimes(2);
        expect(cache.delete).toHaveBeenNthCalledWith(1, requests[0]);
        expect(cache.delete).toHaveBeenNthCalledWith(2, requests[1]);
    });

    it('deletes nothing when within the limit', async () => {
        const requests = ['a', 'b'].map(path => new Request(`${SELF_ORIGIN}/${path}`));
        const cache = createCacheMock();
        cache.keys.mockResolvedValue(requests);

        await trimCache(cache, 5);

        expect(cache.delete).not.toHaveBeenCalled();
    });
});

describe('cacheFirst', () => {
    it('returns the cached response without hitting the network', async () => {
        const cachedResponse = new Response('cached');
        const cache = createCacheMock(cachedResponse);
        const request = new Request(`${SELF_ORIGIN}/index.html`);
        const fetcher = vi.fn();

        const result = await cacheFirst(cache, request, fetcher);

        expect(result).toBe(cachedResponse);
        expect(fetcher).not.toHaveBeenCalled();
        expect(cache.put).not.toHaveBeenCalled();
    });

    it('fetches the network and populates the cache on a miss', async () => {
        const cache = createCacheMock(undefined);
        const request = new Request(`${SELF_ORIGIN}/index.html`);
        const networkResponse = new Response('fresh', { status: 200 });
        const fetcher = vi.fn().mockResolvedValue(networkResponse);

        const result = await cacheFirst(cache, request, fetcher);

        expect(result).toBe(networkResponse);
        expect(fetcher).toHaveBeenCalledWith(request);
        expect(cache.put).toHaveBeenCalledTimes(1);
        expect(cache.put).toHaveBeenCalledWith(request, expect.any(Response));
    });

    it('does not populate the cache when the network response is not ok', async () => {
        const cache = createCacheMock(undefined);
        const request = new Request(`${SELF_ORIGIN}/index.html`);
        const networkResponse = new Response('error', { status: 500 });
        const fetcher = vi.fn().mockResolvedValue(networkResponse);

        const result = await cacheFirst(cache, request, fetcher);

        expect(result).toBe(networkResponse);
        expect(cache.put).not.toHaveBeenCalled();
    });
});

describe('staleWhileRevalidate', () => {
    it('returns the cached response immediately while revalidating in the background', async () => {
        const cachedResponse = new Response('cached');
        const cache = createCacheMock(cachedResponse);
        cache.keys.mockResolvedValue([]);
        const request = new Request(`${API_ORIGIN}/orders`);
        const networkResponse = new Response('fresh', { status: 200 });
        const fetcher = vi.fn().mockResolvedValue(networkResponse);

        const result = await staleWhileRevalidate(cache, request, fetcher, 100);

        expect(result).toBe(cachedResponse);
        // Let the background revalidation microtasks flush.
        await new Promise(resolve => setTimeout(resolve, 0));
        expect(fetcher).toHaveBeenCalledWith(request);
        expect(cache.put).toHaveBeenCalledWith(request, expect.any(Response));
    });

    it('falls back to the network when there is no cached response', async () => {
        const cache = createCacheMock(undefined);
        cache.keys.mockResolvedValue([]);
        const request = new Request(`${API_ORIGIN}/orders`);
        const networkResponse = new Response('fresh', { status: 200 });
        const fetcher = vi.fn().mockResolvedValue(networkResponse);

        const result = await staleWhileRevalidate(cache, request, fetcher, 100);

        expect(result).toBe(networkResponse);
        expect(cache.put).toHaveBeenCalledWith(request, expect.any(Response));
    });

    it('throws when there is no cache entry and the network fails', async () => {
        const cache = createCacheMock(undefined);
        const request = new Request(`${API_ORIGIN}/orders`);
        const fetcher = vi.fn().mockRejectedValue(new Error('offline'));

        await expect(staleWhileRevalidate(cache, request, fetcher, 100)).rejects.toThrow(
            'Network request failed and no cached response is available'
        );
    });

    it('trims the cache after a successful background revalidation', async () => {
        const cachedResponse = new Response('cached');
        const cache = createCacheMock(cachedResponse);
        const requests = ['a', 'b', 'c'].map(path => new Request(`${API_ORIGIN}/${path}`));
        cache.keys.mockResolvedValue(requests);
        const request = new Request(`${API_ORIGIN}/orders`);
        const networkResponse = new Response('fresh', { status: 200 });
        const fetcher = vi.fn().mockResolvedValue(networkResponse);

        await staleWhileRevalidate(cache, request, fetcher, 2);
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(cache.delete).toHaveBeenCalledWith(requests[0]);
    });
});
