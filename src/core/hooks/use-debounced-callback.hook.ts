import { useCallback, useEffect, useRef } from 'react';

/**
 * Returns a debounced version of `callback`. Each invocation resets a per-key
 * timer; the callback runs once `delay` ms elapse without a further call for
 * that key. A `key` lets callers debounce distinct targets independently (e.g.
 * per cart line item) so unrelated bursts never clobber each other's pending
 * call. Pending timers are cleared on unmount.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(callback: (...args: TArgs) => void, delay: number) {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    const timersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());

    useEffect(() => {
        const timers = timersRef.current;
        return () => {
            timers.forEach(timer => clearTimeout(timer));
            timers.clear();
        };
    }, []);

    return useCallback(
        (key: string, ...args: TArgs) => {
            const timers = timersRef.current;
            const existing = timers.get(key);
            if (existing) {
                clearTimeout(existing);
            }

            const timer = setTimeout(() => {
                timers.delete(key);
                callbackRef.current(...args);
            }, delay);

            timers.set(key, timer);
        },
        [delay]
    );
}
