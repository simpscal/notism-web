import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { tokenManagerUtils } from '../token-manager.utils';

describe('tokenManagerUtils', () => {
    afterEach(() => {
        localStorage.clear();
    });

    describe('when localStorage is available (browser)', () => {
        it('round-trips the access token', () => {
            tokenManagerUtils.setToken('token-123');
            expect(tokenManagerUtils.getToken()).toBe('token-123');

            tokenManagerUtils.removeToken();
            expect(tokenManagerUtils.getToken()).toBeNull();
        });

        it('round-trips the XSRF token', () => {
            tokenManagerUtils.setXsrfToken('xsrf-abc');
            expect(tokenManagerUtils.getXsrfToken()).toBe('xsrf-abc');

            tokenManagerUtils.removeXsrfToken();
            expect(tokenManagerUtils.getXsrfToken()).toBeNull();
        });

        it('clearAll removes both the access and XSRF tokens', () => {
            tokenManagerUtils.setToken('token-123');
            tokenManagerUtils.setXsrfToken('xsrf-abc');

            tokenManagerUtils.clearAll();

            expect(tokenManagerUtils.getToken()).toBeNull();
            expect(tokenManagerUtils.getXsrfToken()).toBeNull();
        });
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

        it('read methods return null instead of throwing', () => {
            expect(() => tokenManagerUtils.getToken()).not.toThrow();
            expect(tokenManagerUtils.getToken()).toBeNull();

            expect(() => tokenManagerUtils.getXsrfToken()).not.toThrow();
            expect(tokenManagerUtils.getXsrfToken()).toBeNull();
        });

        it('write methods are no-ops instead of throwing', () => {
            expect(() => tokenManagerUtils.setToken('token-123')).not.toThrow();
            expect(() => tokenManagerUtils.removeToken()).not.toThrow();
            expect(() => tokenManagerUtils.setXsrfToken('xsrf-abc')).not.toThrow();
            expect(() => tokenManagerUtils.removeXsrfToken()).not.toThrow();
            expect(() => tokenManagerUtils.clearAll()).not.toThrow();
        });
    });

    describe('isTokenExpired', () => {
        it('treats an empty token as expired', () => {
            expect(tokenManagerUtils.isTokenExpired('')).toBe(true);
        });

        it('treats a malformed token as expired', () => {
            expect(tokenManagerUtils.isTokenExpired('not-a-jwt')).toBe(true);
        });
    });

    describe('getUserFromToken', () => {
        it('returns null for an empty token', () => {
            expect(tokenManagerUtils.getUserFromToken('')).toBeNull();
        });

        it('returns null for a malformed token', () => {
            expect(tokenManagerUtils.getUserFromToken('not-a-jwt')).toBeNull();
        });
    });
});
