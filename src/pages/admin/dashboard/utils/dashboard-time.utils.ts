import { addDays, addMonths, addYears, startOfDay, startOfMonth, startOfYear, format } from 'date-fns';

/**
 * Client-side timezone logic for the admin dashboard.
 *
 * The backend is timezone-agnostic: it stores and queries UTC instants only.
 * Every local↔UTC conversion the dashboard needs lives here, computed in the
 * browser's local zone via the platform `Date`, then serialised to UTC ISO
 * instants. This is the ONLY timezone logic in the web app.
 */

export type DashboardRevenueGranularity = 'year' | 'month' | 'day';

/** Today's window as a half-open UTC range `[startUtc, endUtc)`. */
export interface TodayWindowUtc {
    /** Local midnight today, as a UTC ISO-8601 instant. */
    startUtc: string;
    /** Local midnight tomorrow, as a UTC ISO-8601 instant. */
    endUtc: string;
}

/**
 * A dense, ordered set of period boundaries for a granularity, plus one stable
 * label per bucket. There are `labels.length + 1` boundaries: bucket `i` spans
 * `[boundaries[i], boundaries[i + 1])`.
 */
export interface RevenuePeriodsUtc {
    /** `n + 1` ascending UTC ISO-8601 boundary instants. */
    boundaries: string[];
    /** `n` labels, one per bucket, in ascending order. */
    labels: string[];
}

/** Number of year buckets shown in the Year view, ending at the current year. */
const YEAR_BUCKET_COUNT = 5;

/**
 * Today's `[startUtc, endUtc)` window — local midnight today to local midnight
 * tomorrow — as UTC ISO instants.
 */
export function getTodayWindowUtc(now: Date = new Date()): TodayWindowUtc {
    const start = startOfDay(now);
    const end = addDays(start, 1);

    return {
        startUtc: start.toISOString(),
        endUtc: end.toISOString(),
    };
}

/** Year label, e.g. `2025`. */
function formatYearLabel(date: Date): string {
    return format(date, 'yyyy');
}

/** Month label, e.g. `2026-06`. */
function formatMonthLabel(date: Date): string {
    return format(date, 'yyyy-MM');
}

/** Day label, e.g. `2026-06-10`. */
function formatDayLabel(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

/**
 * For a granularity, the ordered set of UTC boundary instants plus a stable
 * label per bucket, all computed against the browser's local zone:
 *
 * - `year`  — the last {@link YEAR_BUCKET_COUNT} years ending at the current
 *   year; one bucket per year. Label: `2025`.
 * - `month` — each month of the current year; one bucket per month. Label:
 *   `2026-06`.
 * - `day`   — each day of the current month; one bucket per day. Label:
 *   `2026-06-10`.
 *
 * Boundaries are local period starts converted to UTC; the final boundary is
 * the local start of the period immediately after the last bucket, so every
 * bucket is the half-open range `[boundaries[i], boundaries[i + 1])`.
 */
export function getRevenuePeriodsUtc(
    granularity: DashboardRevenueGranularity,
    now: Date = new Date()
): RevenuePeriodsUtc {
    const starts: Date[] = [];
    let label: (date: Date) => string;

    switch (granularity) {
        case 'year': {
            const firstYearStart = startOfYear(addYears(now, -(YEAR_BUCKET_COUNT - 1)));
            for (let i = 0; i < YEAR_BUCKET_COUNT; i += 1) {
                starts.push(addYears(firstYearStart, i));
            }
            label = formatYearLabel;
            break;
        }
        case 'month': {
            const firstMonthStart = startOfYear(now);
            for (let i = 0; i < 12; i += 1) {
                starts.push(addMonths(firstMonthStart, i));
            }
            label = formatMonthLabel;
            break;
        }
        case 'day': {
            const firstDayStart = startOfMonth(now);
            // Days in the current month: walk until the month rolls over.
            for (
                let cursor = firstDayStart;
                cursor.getMonth() === firstDayStart.getMonth();
                cursor = addDays(cursor, 1)
            ) {
                starts.push(cursor);
            }
            label = formatDayLabel;
            break;
        }
    }

    const labels = starts.map(label);

    // n + 1 boundaries: each bucket start, then the start of the period after the last bucket.
    const lastStart = starts[starts.length - 1];
    let afterLast: Date;
    switch (granularity) {
        case 'year':
            afterLast = addYears(lastStart, 1);
            break;
        case 'month':
            afterLast = addMonths(lastStart, 1);
            break;
        case 'day':
            afterLast = addDays(lastStart, 1);
            break;
    }

    const boundaryDates = [...starts, afterLast];
    const boundaries = boundaryDates.map(date => date.toISOString());

    return { boundaries, labels };
}
