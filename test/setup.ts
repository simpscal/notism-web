import '@testing-library/jest-dom';

import { vi } from 'vitest';

// ---------------------------------------------------------------------------
// Recharts + jsdom interop
//
// Recharts relies on ResizeObserver and measures its parent via
// ResponsiveContainer. jsdom implements neither layout nor ResizeObserver, so
// charts render at 0×0 and never paint. Provide a ResizeObserver polyfill and
// give ResponsiveContainer a fixed size so chart children render in tests.
// ---------------------------------------------------------------------------

class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}

if (!('ResizeObserver' in globalThis)) {
    (globalThis as unknown as { ResizeObserver: typeof ResizeObserverStub }).ResizeObserver = ResizeObserverStub;
}

vi.mock('recharts', async () => {
    const actual = await vi.importActual<typeof import('recharts')>('recharts');
    const { createElement } = await import('react');
    const OriginalResponsiveContainer = actual.ResponsiveContainer as unknown as React.ComponentType<{
        width: number;
        height: number;
        children: React.ReactNode;
    }>;

    return {
        ...actual,
        ResponsiveContainer: ({ children }: { children: React.ReactNode }) =>
            createElement(OriginalResponsiveContainer, { width: 800, height: 400, children }),
    };
});
