import { describe, expect, it } from 'vitest';

import { formatVnd } from '../currency.utils';

describe('formatVnd', () => {
    it('formats zero as "0 ₫"', () => {
        expect(formatVnd(0)).toBe('0 ₫');
    });

    it('formats 2000 as "2,000 ₫"', () => {
        expect(formatVnd(2000)).toBe('2,000 ₫');
    });

    it('formats 1000000 as "1,000,000 ₫"', () => {
        expect(formatVnd(1000000)).toBe('1,000,000 ₫');
    });

    it('never contains the $ symbol', () => {
        expect(formatVnd(0)).not.toContain('$');
        expect(formatVnd(1500)).not.toContain('$');
        expect(formatVnd(1000000)).not.toContain('$');
    });

    it('never contains decimal places', () => {
        expect(formatVnd(0)).not.toContain('.');
        expect(formatVnd(1500)).not.toContain('.');
        expect(formatVnd(1000000)).not.toContain('.');
    });
});
