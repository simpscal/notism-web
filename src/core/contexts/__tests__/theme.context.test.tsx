import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ThemeProvider, useTheme } from '../theme.context';

function ThemeProbe() {
    const { theme } = useTheme();
    return <span>theme:{theme}</span>;
}

describe('ThemeProvider', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('reads the persisted theme from localStorage on mount', () => {
        localStorage.setItem('vite-ui-theme', 'dark');

        render(
            <ThemeProvider>
                <ThemeProbe />
            </ThemeProvider>
        );

        expect(screen.getByText('theme:dark')).toBeInTheDocument();
    });

    it('falls back to the default theme when nothing is persisted', () => {
        render(
            <ThemeProvider defaultTheme='light'>
                <ThemeProbe />
            </ThemeProvider>
        );

        expect(screen.getByText('theme:light')).toBeInTheDocument();
    });

    // Simulates the SSR environment (no `window.localStorage`) without deleting the
    // real `window` global, which would break Testing Library / jsdom.
    describe('when localStorage is unavailable (SSR)', () => {
        let originalLocalStorage: Storage;

        beforeEach(() => {
            originalLocalStorage = window.localStorage;
            // @ts-expect-error -- simulating an environment with no localStorage
            delete window.localStorage;
        });

        afterEach(() => {
            Object.defineProperty(window, 'localStorage', {
                value: originalLocalStorage,
                configurable: true,
                writable: true,
            });
        });

        it('renders with the default theme instead of throwing', () => {
            expect(() => {
                render(
                    <ThemeProvider defaultTheme='light'>
                        <ThemeProbe />
                    </ThemeProvider>
                );
            }).not.toThrow();

            expect(screen.getByText('theme:light')).toBeInTheDocument();
        });
    });
});

describe('ThemeProvider effects', () => {
    it('applies the resolved theme class to <html> after mount', () => {
        act(() => {
            render(
                <ThemeProvider defaultTheme='dark'>
                    <ThemeProbe />
                </ThemeProvider>
            );
        });

        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
});
