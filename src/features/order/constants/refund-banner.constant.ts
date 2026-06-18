/**
 * localStorage key holding the refund ids whose refund-paid banner the customer
 * has dismissed. Persists dismissals across reloads (story #246) — direct
 * localStorage access per codebase convention, no useLocalStorage hook.
 */
export const REFUND_PAID_BANNER_DISMISSED_KEY = 'refund-paid-banner-dismissed';
