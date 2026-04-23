/**
 * Formats a number as Vietnamese Dong (VND).
 * Uses vi-VN locale for thousands separators and appends the ₫ symbol.
 * VND has no subunits, so no decimal places are shown.
 */
export function formatVnd(amount: number): string {
    return amount.toLocaleString('vi-VN') + ' ₫';
}
