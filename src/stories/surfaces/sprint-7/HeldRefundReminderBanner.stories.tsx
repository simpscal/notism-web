import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChevronRight, Landmark } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import Banner from '@/components/banner';
import { Button } from '@/components/button';
import { Toaster } from '@/components/sonner';

// ---------------------------------------------------------------------------
// Implementation reference — story 260 (held-refund bank-details reminder banner).
//
// NEW global, app-wide surface. Like RefundPaidBanner, this banner is NOT bound
// to any one page: it is mounted ONCE in the customer app shell (the shared
// customer layout wrapping every authenticated customer route), so it renders
// pinned at the top of EVERY customer page.
//
// Distinct from RefundPaidBanner in two ways:
//   • PURPOSE — it is a PERSISTENT REMINDER, not a notification. It is shown
//     whenever the customer has at least one refund HELD awaiting bank details
//     (the held state originates in #242 — a cancel-initiated refund created
//     while no bank account is on file cannot be sent). It nudges the customer to
//     add their bank details so the held refund can proceed.
//   • NOT DISMISSIBLE — because it must persist until the underlying condition is
//     resolved, there is NO dismiss (X) control. The whole banner message IS the
//     click-to-route affordance → it routes to the bank-details settings page
//     (settings/payment, story 254 — the same target as the request-refund and
//     held-panel "Add bank details" actions on CustomerRefundTracking).
//
//   • 260 — shown on every page while a held refund exists; clicking routes to
//     settings/payment; once the customer saves their bank details and the held
//     refund proceeds, the banner no longer appears; no held refund → no banner.
//
// Built on the existing Banner component (src/components/banner.tsx). Banner's
// variant union is success | error | info (no `warning`), so we use it as the
// structural base and apply the global --warning palette via className (Banner
// merges className AFTER the variant styles, so the warning tones win) — matching
// the warning-toned "Bank details needed" panel on CustomerRefundTracking. We do
// NOT pass onClose, so no X renders — the banner is non-dismissible by design.
//
// The rest of the app below the banner is a labelled placeholder so the reviewer
// sees the banner as a top-of-app element in real page context.
//
// Mock-only fixtures; local interaction harness only, no api/model/state imports.
// ---------------------------------------------------------------------------

/** Mirrors src/app/utils/currency.utils.ts — VND formatting used across the app. */
function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Refund domain (mock shapes — matches the ACs' data shape, not real models)
// ---------------------------------------------------------------------------

/**
 * A refund held awaiting bank details (#242 / #260). Carries the order it belongs
 * to and the amount so the reminder can name what is waiting. No per-refund route
 * — the banner always routes to settings/payment (the bank-details page).
 */
interface HeldRefund {
    refundId: string;
    orderRef: string;
    amount: number;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const HELD_ONE: HeldRefund = {
    refundId: 'rfd-7001',
    orderRef: 'ORD-20260613-0099',
    amount: 485_000,
};

const HELD_TWO: HeldRefund = {
    refundId: 'rfd-7002',
    orderRef: 'ORD-20260611-0063',
    amount: 215_000,
};

// ---------------------------------------------------------------------------
// Held-refund reminder banner — one consolidated banner for ALL held refunds
// (see <confirmations> for the single-vs-multiple decision).
//
// The whole message region is the click-to-route affordance (260) → routes to
// settings/payment. No onClose → no dismiss control (persistent until resolved).
// Wrapped in role=status / aria-live=polite so it announces when it appears.
// ---------------------------------------------------------------------------

interface HeldRefundReminderBannerProps {
    /** All currently-held refunds. Consolidated into one banner. */
    held: HeldRefund[];
    /** Routes to the bank-details settings page (settings/payment, 254). */
    onAddBankDetails: () => void;
}

function HeldRefundReminderBanner({ held, onAddBankDetails }: HeldRefundReminderBannerProps) {
    const count = held.length;
    const totalAmount = held.reduce((sum, r) => sum + r.amount, 0);

    const message =
        count === 1 ? (
            <>
                <span className='font-semibold'>Add your bank details to receive your refund</span>{' '}
                <span className='font-normal'>
                    — your {formatVnd(held[0].amount)} refund for order {held[0].orderRef} is on hold until we have an
                    account to send it to.
                </span>
            </>
        ) : (
            <>
                <span className='font-semibold'>Add your bank details to receive your refunds</span>{' '}
                <span className='font-normal'>
                    — {count} refunds totalling {formatVnd(totalAmount)} are on hold until we have an account to send
                    them to.
                </span>
            </>
        );

    return (
        <Banner
            // Banner has no `warning` variant; use `info` as the structural base
            // and override with the global --warning palette via className (it is
            // applied after the variant styles, so it wins).
            variant='info'
            className='rounded-none border-x-0 border-t-0 border-warning/30 bg-warning/10 text-warning'
            icon={<Landmark className='h-5 w-5' />}
            message={
                // The whole message IS the routing affordance (260) — a real button
                // so it is keyboard-reachable and announces as actionable. No X.
                <button
                    type='button'
                    onClick={onAddBankDetails}
                    className='flex w-full items-center justify-between gap-3 text-left focus-visible:underline focus-visible:outline-none'
                >
                    <span className='min-w-0'>{message}</span>
                    <span className='flex shrink-0 items-center gap-1 font-semibold underline underline-offset-2'>
                        Add bank details
                        <ChevronRight className='h-4 w-4' />
                    </span>
                </button>
            }
        />
    );
}

// ---------------------------------------------------------------------------
// Banner region — global, mounted in the app shell. Renders the consolidated
// reminder while ANY refund is held; renders NOTHING when none are held (the
// region collapses — no top-of-app element). aria-live announces it on appear.
// ---------------------------------------------------------------------------

interface HeldReminderRegionProps {
    held: HeldRefund[];
    onAddBankDetails: () => void;
}

function HeldReminderRegion({ held, onAddBankDetails }: HeldReminderRegionProps) {
    if (held.length === 0) {
        return null;
    }

    return (
        <div className='sticky top-0 z-[60]' role='status' aria-live='polite'>
            <HeldRefundReminderBanner held={held} onAddBankDetails={onAddBankDetails} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// App-shell placeholder — the entire app below the banner is unchanged by this
// sprint, so it is a labelled placeholder. The banner sits ABOVE it (and above
// the nav) to show it as a true top-of-app, every-page element.
// ---------------------------------------------------------------------------

function AppShellPlaceholder() {
    return (
        <div className='bg-background'>
            {/* Top navigation — placeholder; exists in current system, not changed by this sprint */}
            <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
                <div className='h-px w-6 bg-muted-foreground/30' />
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    nav placeholder
                </span>
                <div className='h-px w-6 bg-muted-foreground/30' />
            </div>
            {/* Current page content — placeholder; the banner renders on EVERY page, this stands in for whichever page is open */}
            <div className='container mx-auto max-w-5xl px-4 py-10'>
                <div className='flex h-[420px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                        current page content placeholder
                    </span>
                    <span className='mt-2 max-w-xs text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/30'>
                        the held-refund reminder shows above this on any page
                    </span>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page composition — the global reminder region pinned above the full app shell.
// ---------------------------------------------------------------------------

function AppWithReminder({ held, onAddBankDetails }: HeldReminderRegionProps) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <HeldReminderRegion held={held} onAddBankDetails={onAddBankDetails} />
            <AppShellPlaceholder />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — drives click-to-route + the resolved transition.
// Routing is mocked with a toast (we cannot navigate inside a story); saving bank
// details resolves the held refunds, so the banner disappears (260).
// ---------------------------------------------------------------------------

function ReminderHarness({ initialHeld }: { initialHeld: HeldRefund[] }) {
    const [held, setHeld] = React.useState<HeldRefund[]>(initialHeld);

    const handleAddBankDetails = () => {
        // Real app: navigate to settings/payment (254). Mocked as a toast here;
        // then we simulate the customer saving details → the held refunds proceed,
        // so the reminder no longer appears (260).
        toast.success('Routing to bank details (settings/payment)');
        window.setTimeout(() => setHeld([]), 900);
    };

    return (
        <>
            <AppWithReminder held={held} onAddBankDetails={handleAddBankDetails} />
            {held.length === 0 && (
                <div className='container mx-auto max-w-5xl px-4'>
                    <Button variant='outline' size='sm' onClick={() => setHeld(initialHeld)}>
                        Simulate a newly-held refund
                    </Button>
                </div>
            )}
            <Toaster />
        </>
    );
}

const NOOP = (): undefined => undefined;

function StaticApp(held: HeldRefund[]) {
    return <AppWithReminder held={held} onAddBankDetails={NOOP} />;
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Held Refund Reminder Banner',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — one held refund: a persistent, non-dismissible reminder pinned at
 *  the very top of the app, above the nav, on whatever page is open (260). The
 *  whole banner is the click-to-route affordance → settings/payment. */
export const SingleHeld: Story = {
    name: 'Default — Held Refund Reminder (260)',
    render: () => StaticApp([HELD_ONE]),
};

/** No held refund — the customer has no refund awaiting bank details, so the
 *  region renders NOTHING and the app shell is unobstructed (260 negative AC). */
export const NoHeldRefund: Story = {
    name: 'No Held Refund — Nothing Shown (260)',
    render: () => StaticApp([]),
};

/** Multiple held refunds — consolidated into ONE banner summarising the count and
 *  total (chosen over one-banner-per-refund — see <confirmations>): the single
 *  resolution (add bank details) clears them all, so one banner is clearer and
 *  less noisy than a stack. */
export const MultipleHeld: Story = {
    name: 'Multiple Held — One Consolidated Banner (260)',
    parameters: {
        docs: {
            description: {
                story: 'When more than one refund is held awaiting bank details, a single consolidated reminder summarises the count and total. One action — adding bank details — resolves them all, so a single banner is clearer and less noisy than one banner per held refund (see <confirmations>).',
            },
        },
    },
    render: () => StaticApp([HELD_ONE, HELD_TWO]),
};

/** Interactive — held → click the banner (routes to settings/payment, mocked as a
 *  toast) → customer saves bank details → the held refund proceeds → the banner
 *  disappears (260). Use the reset button to replay the loop. */
export const Interactive: Story = {
    name: 'Interactive — Add Bank Details → Banner Disappears (260)',
    parameters: {
        docs: {
            description: {
                story: 'Click the banner to route to the bank-details settings page (settings/payment, mocked as a toast). Saving the bank details resolves the held refund, so the persistent reminder no longer appears (260). There is intentionally no dismiss (X) — the banner persists until the underlying condition is resolved. Loading / Error states are omitted: a reminder banner derives from already-loaded customer state and has no fetch of its own, so neither applies (see <confirmations>).',
            },
        },
    },
    render: () => <ReminderHarness initialHeld={[HELD_ONE]} />,
};
