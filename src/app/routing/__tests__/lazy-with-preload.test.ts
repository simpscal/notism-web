import { describe, expect, it, vi } from 'vitest';

import { lazyWithPreload } from '../lazy-with-preload';

describe('lazyWithPreload', () => {
    it('exposes a preload function alongside the lazy component', () => {
        const factory = () => Promise.resolve({ default: () => null });

        const Lazy = lazyWithPreload(factory);

        expect(typeof Lazy.preload).toBe('function');
    });

    it('invokes the factory only once even when preload is called multiple times', async () => {
        const Comp = () => null;
        const factory = vi.fn(() => Promise.resolve({ default: Comp }));

        const Lazy = lazyWithPreload(factory);
        const [first, second] = await Promise.all([Lazy.preload(), Lazy.preload()]);
        await Lazy.preload();

        expect(factory).toHaveBeenCalledTimes(1);
        expect(first.default).toBe(Comp);
        expect(second.default).toBe(Comp);
    });

    it('caches the resolved module so a later preload call resolves without re-fetching', async () => {
        const Comp = () => null;
        const factory = vi.fn(() => Promise.resolve({ default: Comp }));

        const Lazy = lazyWithPreload(factory);
        await Lazy.preload();
        const result = await Lazy.preload();

        expect(factory).toHaveBeenCalledTimes(1);
        expect(result.default).toBe(Comp);
    });

    it('supports named-export modules mapped to a default shape', async () => {
        const Named = () => null;
        const factory = vi.fn(() => Promise.resolve({ Named }).then(m => ({ default: m.Named })));

        const Lazy = lazyWithPreload(factory);
        const result = await Lazy.preload();

        expect(result.default).toBe(Named);
        expect(factory).toHaveBeenCalledTimes(1);
    });

    it('propagates a factory rejection to every preload caller sharing the cached promise', async () => {
        const factory = vi.fn(() => Promise.reject(new Error('network error')));

        const Lazy = lazyWithPreload(factory);

        await expect(Lazy.preload()).rejects.toThrow('network error');
        await expect(Lazy.preload()).rejects.toThrow('network error');
        expect(factory).toHaveBeenCalledTimes(1);
    });
});
