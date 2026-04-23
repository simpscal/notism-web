import { describe, expect, it } from 'vitest';

import { formatVnd } from './currency.utils';

describe('formatVnd', () => {
    it('formats zero as "0 ₫"', () => {
        expect(formatVnd(0)).toBe('0 ₫');
    });

    it('formats a large amount with ₫ symbol and no decimal digits', () => {
        const result = formatVnd(1000000);
        expect(result).toContain('₫');
        // Must not end with a decimal pattern like ".00" or ".50" — vi-VN uses "." as thousands separator,
        // so we check for a decimal: a dot followed by exactly 1-2 digits then a space or end of string
        expect(result).not.toMatch(/\.\d{1,2}(\s|$)/);
    });

    it('formats a small amount with ₫ symbol and no decimal digits', () => {
        const result = formatVnd(1500);
        expect(result).toContain('₫');
        expect(result).not.toMatch(/\.\d{1,2}(\s|$)/);
    });

    it('never contains the $ symbol', () => {
        expect(formatVnd(0)).not.toContain('$');
        expect(formatVnd(1500)).not.toContain('$');
        expect(formatVnd(1000000)).not.toContain('$');
    });

    it('never contains a decimal fraction (no .00 or .50 style suffix)', () => {
        // toFixed(2) produces "1000000.00" — a literal decimal with exactly 2 fractional digits.
        // vi-VN locale uses "." as thousands separator so "1.000.000 ₫" is expected — the dot
        // there is always followed by exactly 3 digits, never 1-2. This pattern catches only decimals.
        expect(formatVnd(0)).not.toMatch(/\.\d{1,2}(\s|$)/);
        expect(formatVnd(1500)).not.toMatch(/\.\d{1,2}(\s|$)/);
        expect(formatVnd(1000000)).not.toMatch(/\.\d{1,2}(\s|$)/);
    });
});
