import { addDays, addMonths, addYears, getDaysInMonth, startOfDay, startOfMonth, startOfYear } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { getRevenuePeriodsUtc, getTodayWindowUtc } from '../dashboard-time.utils';

/**
 * These assertions are timezone-independent: rather than hard-coding UTC string
 * literals (which would only hold in one machine zone), they recompute the
 * expected local→UTC instant with the same primitives the helper uses and
 * compare. This pins the contract while staying correct in any local zone.
 */

describe('getTodayWindowUtc', () => {
    it('returns local midnight today to local midnight tomorrow as UTC ISO instants', () => {
        const now = new Date(2026, 5, 10, 14, 37, 12); // 10 Jun 2026, 14:37 local

        const { startUtc, endUtc } = getTodayWindowUtc(now);

        const expectedStart = startOfDay(now);
        const expectedEnd = addDays(expectedStart, 1);

        expect(startUtc).toBe(expectedStart.toISOString());
        expect(endUtc).toBe(expectedEnd.toISOString());
        // Both are valid UTC ISO-8601 instants ending in Z.
        expect(startUtc.endsWith('Z')).toBe(true);
        expect(endUtc.endsWith('Z')).toBe(true);
        // Half-open window spans exactly 24h.
        expect(new Date(endUtc).getTime() - new Date(startUtc).getTime()).toBe(24 * 60 * 60 * 1000);
    });

    it('handles a day at a month boundary (last day of the month)', () => {
        const now = new Date(2026, 0, 31, 23, 59, 59); // 31 Jan 2026

        const { startUtc, endUtc } = getTodayWindowUtc(now);

        expect(new Date(endUtc).getTime() - new Date(startUtc).getTime()).toBe(24 * 60 * 60 * 1000);
        // Tomorrow rolls into February.
        expect(endUtc).toBe(addDays(startOfDay(now), 1).toISOString());
    });
});

describe('getRevenuePeriodsUtc — year', () => {
    it('produces 5 ascending yearly buckets ending at the current year with yyyy labels', () => {
        const now = new Date(2026, 5, 10, 9, 0, 0);

        const { boundaries, labels } = getRevenuePeriodsUtc('year', now);

        expect(labels).toEqual(['2022', '2023', '2024', '2025', '2026']);
        // n labels, n + 1 boundaries.
        expect(boundaries).toHaveLength(labels.length + 1);

        const firstStart = startOfYear(addYears(now, -4));
        expect(boundaries[0]).toBe(firstStart.toISOString());
        // Final boundary is the start of the year after the last bucket.
        expect(boundaries[boundaries.length - 1]).toBe(addYears(startOfYear(now), 1).toISOString());

        // Strictly ascending.
        for (let i = 1; i < boundaries.length; i += 1) {
            expect(new Date(boundaries[i]).getTime()).toBeGreaterThan(new Date(boundaries[i - 1]).getTime());
        }
    });
});

describe('getRevenuePeriodsUtc — month', () => {
    it('produces 12 ascending monthly buckets of the current year with yyyy-MM labels', () => {
        const now = new Date(2026, 5, 10, 9, 0, 0);

        const { boundaries, labels } = getRevenuePeriodsUtc('month', now);

        expect(labels).toEqual([
            '2026-01',
            '2026-02',
            '2026-03',
            '2026-04',
            '2026-05',
            '2026-06',
            '2026-07',
            '2026-08',
            '2026-09',
            '2026-10',
            '2026-11',
            '2026-12',
        ]);
        expect(boundaries).toHaveLength(13);

        expect(boundaries[0]).toBe(startOfYear(now).toISOString());
        // Final boundary rolls over into the next year (year rollover edge).
        expect(boundaries[12]).toBe(addMonths(startOfYear(now), 12).toISOString());
        expect(boundaries[12]).toBe(startOfYear(addYears(now, 1)).toISOString());

        for (let i = 1; i < boundaries.length; i += 1) {
            expect(new Date(boundaries[i]).getTime()).toBeGreaterThan(new Date(boundaries[i - 1]).getTime());
        }
    });
});

describe('getRevenuePeriodsUtc — day', () => {
    it('produces one ascending bucket per day of the current month with yyyy-MM-dd labels', () => {
        const now = new Date(2026, 5, 10, 9, 0, 0); // June 2026 — 30 days
        const daysInMonth = getDaysInMonth(now);

        const { boundaries, labels } = getRevenuePeriodsUtc('day', now);

        expect(labels).toHaveLength(daysInMonth);
        expect(boundaries).toHaveLength(daysInMonth + 1);

        expect(labels[0]).toBe('2026-06-01');
        expect(labels[labels.length - 1]).toBe('2026-06-30');

        expect(boundaries[0]).toBe(startOfMonth(now).toISOString());
        // Final boundary is the first day of the next month (month rollover edge).
        expect(boundaries[boundaries.length - 1]).toBe(addMonths(startOfMonth(now), 1).toISOString());

        for (let i = 1; i < boundaries.length; i += 1) {
            expect(new Date(boundaries[i]).getTime()).toBeGreaterThan(new Date(boundaries[i - 1]).getTime());
        }
    });

    it('handles February in a leap year (29 days) — month/year boundaries correct', () => {
        const now = new Date(2024, 1, 15, 12, 0, 0); // Feb 2024 — leap year, 29 days

        const { boundaries, labels } = getRevenuePeriodsUtc('day', now);

        expect(labels).toHaveLength(29);
        expect(labels[28]).toBe('2024-02-29');
        // Rolls into March.
        expect(boundaries[boundaries.length - 1]).toBe(new Date(2024, 2, 1).toISOString());
    });

    it('handles December — day buckets roll the final boundary into next January', () => {
        const now = new Date(2026, 11, 5, 12, 0, 0); // Dec 2026 — 31 days

        const { boundaries, labels } = getRevenuePeriodsUtc('day', now);

        expect(labels).toHaveLength(31);
        expect(labels[0]).toBe('2026-12-01');
        expect(labels[30]).toBe('2026-12-31');
        // Year rollover edge: final boundary is 1 Jan of the next year.
        expect(boundaries[boundaries.length - 1]).toBe(new Date(2027, 0, 1).toISOString());
    });
});
