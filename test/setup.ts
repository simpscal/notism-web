import '@testing-library/jest-dom';

// jsdom does not implement matchMedia; some UI libs (e.g. embla-carousel) require it.
if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }) as unknown as MediaQueryList;
}

// jsdom does not implement IntersectionObserver; required by embla-carousel and
// react-intersection-observer (infinite scroll).
if (!('IntersectionObserver' in globalThis)) {
    class MockIntersectionObserver {
        observe = () => {};
        unobserve = () => {};
        disconnect = () => {};
        takeRecords = () => [];
        root = null;
        rootMargin = '';
        thresholds = [];
    }
    globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
    window.IntersectionObserver = globalThis.IntersectionObserver;
}

// jsdom does not implement ResizeObserver; required by embla-carousel.
if (!('ResizeObserver' in globalThis)) {
    class MockResizeObserver {
        observe = () => {};
        unobserve = () => {};
        disconnect = () => {};
    }
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    window.ResizeObserver = globalThis.ResizeObserver;
}
