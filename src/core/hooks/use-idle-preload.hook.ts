import { useEffect } from 'react';

import { PreloadableComponent } from '@/app/routing/lazy-with-preload';

type IdleCallbackWindow = Window & {
    requestIdleCallback?: (callback: () => void) => number;
    cancelIdleCallback?: (handle: number) => void;
};

/**
 * During browser idle time, preloads each of the given lazy route components so the
 * likely-next screen's chunk is already warm before the user navigates to it. Falls back to
 * a `setTimeout` in environments without `requestIdleCallback` (e.g. Safari), so neighbour
 * preload never blocks main-thread input responsiveness either way.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useIdlePreload(components: PreloadableComponent<any>[] | undefined): void {
    useEffect(() => {
        if (!components || components.length === 0) {
            return;
        }

        const idleWindow = window as IdleCallbackWindow;

        const preloadAll = () => {
            components.forEach(component => {
                component.preload();
            });
        };

        if (typeof idleWindow.requestIdleCallback === 'function') {
            const idleHandle = idleWindow.requestIdleCallback(preloadAll);
            return () => idleWindow.cancelIdleCallback?.(idleHandle);
        }

        const timeoutHandle = setTimeout(preloadAll, 1);
        return () => clearTimeout(timeoutHandle);
    }, [components]);
}
