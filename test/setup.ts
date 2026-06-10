import '@testing-library/jest-dom';

import { cloneElement, isValidElement, type ReactNode } from 'react';
import { vi } from 'vitest';

// jsdom has no layout engine, so recharts' ResponsiveContainer measures a 0x0
// box and renders nothing. Polyfill ResizeObserver and replace ResponsiveContainer
// with a wrapper that hands the chart explicit pixel dimensions, so bars, axes
// and labels render and can be asserted on in tests.
class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
}

globalThis.ResizeObserver = globalThis.ResizeObserver ?? (ResizeObserverMock as unknown as typeof ResizeObserver);

const CHART_WIDTH = 800;
const CHART_HEIGHT = 320;

vi.mock('recharts', async () => {
    const actual = await vi.importActual<typeof import('recharts')>('recharts');
    return {
        ...actual,
        ResponsiveContainer: ({ children }: { children: ReactNode }) =>
            isValidElement(children)
                ? cloneElement(children as React.ReactElement<{ width?: number; height?: number }>, {
                      width: CHART_WIDTH,
                      height: CHART_HEIGHT,
                  })
                : children,
    };
});
