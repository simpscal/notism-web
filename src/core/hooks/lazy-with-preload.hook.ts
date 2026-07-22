import { ComponentType, lazy, LazyExoticComponent } from 'react';

export interface PreloadableComponent<T extends ComponentType<unknown>> extends LazyExoticComponent<T> {
    preload: () => Promise<{ default: T }>;
}

/**
 * Thin wrapper around `React.lazy()` that caches the dynamic `import()` promise and exposes
 * a `.preload()` method, so calling it ahead of navigation (nav-link hover/focus, idle-time
 * neighbour warmup) warms the module cache without triggering a second fetch — the component
 * that eventually renders via Suspense reuses the same in-flight/resolved promise.
 *
 * `factory` must resolve to a `{ default: T }` shape. For a named-export page module, map it
 * at the call site: `lazyWithPreload(() => import('@/pages/foods').then(m => ({ default: m.Foods })))`.
 */
export function lazyWithPreload<T extends ComponentType<unknown>>(
    factory: () => Promise<{ default: T }>
): PreloadableComponent<T> {
    let promise: Promise<{ default: T }> | undefined;

    const load = () => {
        if (!promise) {
            promise = factory();
        }
        return promise;
    };

    const Component = lazy(load) as PreloadableComponent<T>;
    Component.preload = load;

    return Component;
}
