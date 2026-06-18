import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import Banner from '@/components/banner';
import { Button } from '@/components/button';
import { Toaster } from '@/components/sonner';

// ---------------------------------------------------------------------------
// Implementation reference — story 246 (refund-paid notification banner).
//
// NEW global, app-wide surface. Distinct from the per-order refund surfaces
// (CustomerRefundTracking / OrdersListRefundStatus): this banner is NOT bound to
// any one page. It is mounted ONCE in the customer app shell (e.g. inside the
// shared customer layout that wraps every authenticated customer route), so it
// renders pinned at the top of EVERY page.
//
//   • 246 — when one of the customer's bank-transfer refunds becomes Paid, a
//     notification banner appears at the top of the application on every page and
//     PERSISTS until the customer dismisses it.
//   • 246 — clicking the banner routes the customer to that order's details page
//     (route `orders/{id}`). The dismiss (X) control is separate and does NOT
//     route — it only dismisses.
//   • Dismissal must persist across reloads — see <confirmations> for the chosen
//     persistence mechanism (modelled here as a dismissed-id set).
//
// Customer-visible refund status model is reused VERBATIM from the other sprint-7
// customer surfaces: a refund the customer ever sees is Pending | Paid only. A
// behind-the-scenes Failed/retrying transfer is NEVER surfaced — so this banner
// only ever announces the Paid (terminal, customer-visible) transition.
//
// Built on the existing Banner component (src/components/banner.tsx): success
// variant, leading icon, clickable message region, and the built-in dismiss (X)
// via onClose. The rest of the app below the banner is a labelled placeholder so
// the reviewer sees the banner as a top-of-app element in real page context.
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
 * A refund the customer is notified about. The banner only ever fires on the
 * Paid transition, so a paid-refund notification carries the order it belongs to
 * (for routing) and the amount sent (for the message). Pending/Failed never
 * produce a banner — Failed is never surfaced to the customer.
 */
interface PaidRefundNotification {
    /** Stable id used both for routing target and for dismissed-state keying. */
    refundId: string;
    /** Order whose detail page the banner routes to — route `orders/{orderId}`. */
    orderId: string;
    /** Customer-facing order reference shown in the message. */
    orderRef: string;
    /** Amount the refund transfer sent. */
    amount: number;
    /** Date the refund was sent (246). */
    sentDate: string;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PAID_ONE: PaidRefundNotification = {
    refundId: 'rfd-9001',
    orderId: 'A1B2C3',
    orderRef: 'ORD-20260613-0099',
    amount: 485_000,
    sentDate: '13 June 2026, 14:27',
};

const PAID_TWO: PaidRefundNotification = {
    refundId: 'rfd-9002',
    orderId: 'D4E5F6',
    orderRef: 'ORD-20260612-0074',
    amount: 215_000,
    sentDate: '12 June 2026, 10:05',
};

const PAID_THREE: PaidRefundNotification = {
    refundId: 'rfd-9003',
    orderId: 'G7H8I9',
    orderRef: 'ORD-20260610-0051',
    amount: 1_120_000,
    sentDate: '10 June 2026, 18:40',
};

// ---------------------------------------------------------------------------
// Refund-paid banner — one banner per paid refund (see <confirmations>).
//
// The whole message region is the click-to-route affordance (246); the trailing
// X (Banner.onClose) dismisses only. Wrapped in role=status / aria-live=polite
// so the announcement reaches assistive tech when it appears.
// ---------------------------------------------------------------------------

interface RefundPaidBannerProps {
    refund: PaidRefundNotification;
    onOpenOrder: (orderId: string) => void;
    onDismiss: (refundId: string) => void;
}

function RefundPaidBanner({ refund, onOpenOrder, onDismiss }: RefundPaidBannerProps) {
    return (
        <Banner
            variant='success'
            className='rounded-none border-x-0 border-t-0'
            icon={<CheckCircle2 className='h-5 w-5' />}
            onClose={() => onDismiss(refund.refundId)}
            message={
                // Message is the routing affordance — a real button so it is
                // keyboard-reachable and announces as actionable (246).
                <button
                    type='button'
                    onClick={() => onOpenOrder(refund.orderId)}
                    className='block w-full text-left focus-visible:outline-none focus-visible:underline'
                >
                    <span className='font-semibold'>Refund sent</span>{' '}
                    <span className='font-normal'>
                        — {formatVnd(refund.amount)} for order {refund.orderRef} was transferred to your bank on{' '}
                        {refund.sentDate}.
                    </span>{' '}
                    <span className='font-normal underline underline-offset-2'>View order</span>
                </button>
            }
        />
    );
}

// ---------------------------------------------------------------------------
// Banner stack — global region mounted in the app shell. Renders one banner per
// not-yet-dismissed paid refund, newest first. Empty → nothing rendered (the
// region collapses, no top-of-app element). aria-live announces new banners.
// ---------------------------------------------------------------------------

interface RefundPaidBannerStackProps {
    refunds: PaidRefundNotification[];
    dismissed: ReadonlySet<string>;
    onOpenOrder: (orderId: string) => void;
    onDismiss: (refundId: string) => void;
}

function RefundPaidBannerStack({ refunds, dismissed, onOpenOrder, onDismiss }: RefundPaidBannerStackProps) {
    const visible = refunds.filter(r => !dismissed.has(r.refundId));

    if (visible.length === 0) {
        return null;
    }

    return (
        <div className='sticky top-0 z-[60]' role='status' aria-live='polite'>
            {visible.map(refund => (
                <RefundPaidBanner
                    key={refund.refundId}
                    refund={refund}
                    onOpenOrder={onOpenOrder}
                    onDismiss={onDismiss}
                />
            ))}
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
                        the refund-paid banner shows above this on any page
                    </span>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page composition — the global banner region pinned above the full app shell.
// ---------------------------------------------------------------------------

interface AppWithBannerProps {
    refunds: PaidRefundNotification[];
    dismissed: ReadonlySet<string>;
    onOpenOrder: (orderId: string) => void;
    onDismiss: (refundId: string) => void;
}

function AppWithBanner({ refunds, dismissed, onOpenOrder, onDismiss }: AppWithBannerProps) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <RefundPaidBannerStack
                refunds={refunds}
                dismissed={dismissed}
                onOpenOrder={onOpenOrder}
                onDismiss={onDismiss}
            />
            <AppShellPlaceholder />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — drives click-to-route + dismiss against local state.
// Routing is mocked with a toast (we cannot navigate inside a story); dismissal
// updates the in-memory dismissed set, standing in for the persisted store.
// ---------------------------------------------------------------------------

function BannerHarness({ initialRefunds }: { initialRefunds: PaidRefundNotification[] }) {
    const [dismissed, setDismissed] = React.useState<ReadonlySet<string>>(new Set());

    const handleOpenOrder = (orderId: string) => {
        // Real app: navigate to `orders/{orderId}` (246). Mocked as a toast here.
        toast.success(`Routing to order ${orderId} (orders/${orderId})`);
    };

    const handleDismiss = (refundId: string) => {
        // Real app: persist the dismissed id so it stays dismissed across reloads
        // (see <confirmations> for the chosen mechanism). Mocked in local state.
        setDismissed(previous => new Set(previous).add(refundId));
    };

    return (
        <>
            <AppWithBanner
                refunds={initialRefunds}
                dismissed={dismissed}
                onOpenOrder={handleOpenOrder}
                onDismiss={handleDismiss}
            />
            <Toaster />
        </>
    );
}

const NOOP_OPEN = (): undefined => undefined;
const NOOP_DISMISS = (): undefined => undefined;

function StaticApp(refunds: PaidRefundNotification[], dismissed: ReadonlySet<string> = new Set()) {
    return <AppWithBanner refunds={refunds} dismissed={dismissed} onOpenOrder={NOOP_OPEN} onDismiss={NOOP_DISMISS} />;
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Refund Paid Banner',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a single paid refund: one banner pinned at the very top of the app,
 *  above the nav, on whatever page is open (246). */
export const SingleBanner: Story = {
    name: 'Default — Single Refund-Paid Banner (246)',
    render: () => StaticApp([PAID_ONE]),
};

/** Stacked — multiple paid refunds: one banner PER order, stacked top-to-bottom
 *  (chosen default — see <confirmations>). Each routes to its own order. */
export const StackedBanners: Story = {
    name: 'Stacked — One Banner Per Paid Refund (246)',
    render: () => StaticApp([PAID_ONE, PAID_TWO, PAID_THREE]),
};

/** Dismissed — every paid refund has been dismissed (persisted across reloads),
 *  so the banner region renders nothing and the app shell is unobstructed. */
export const Dismissed: Story = {
    name: 'Dismissed — Nothing Shown (246)',
    render: () => StaticApp([PAID_ONE], new Set([PAID_ONE.refundId])),
};

/** Partial — some paid refunds dismissed, others still shown. The dismissed one
 *  stays gone; the remaining banner(s) persist. */
export const PartiallyDismissed: Story = {
    name: 'Partial — One Dismissed, Others Remain',
    render: () => StaticApp([PAID_ONE, PAID_TWO, PAID_THREE], new Set([PAID_TWO.refundId])),
};

/** Interactive — click the message to route (mocked as a toast → orders/{id});
 *  click the X to dismiss. Dismissing all banners empties the region. */
export const Interactive: Story = {
    name: 'Interactive — Click To Route + Dismiss',
    render: () => <BannerHarness initialRefunds={[PAID_ONE, PAID_TWO, PAID_THREE]} />,
};

/** Reset affordance — when nothing is shown, this harness lets the reviewer
 *  re-trigger banners to re-test the appear → dismiss loop. */
export const InteractiveSingle: Story = {
    name: 'Interactive — Single Banner Appear/Dismiss',
    render: () => {
        function SingleHarness() {
            const [shown, setShown] = React.useState(true);
            return (
                <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
                    {shown ? (
                        <div className='sticky top-0 z-[60]' role='status' aria-live='polite'>
                            <RefundPaidBanner
                                refund={PAID_ONE}
                                onOpenOrder={orderId => toast.success(`Routing to order ${orderId}`)}
                                onDismiss={() => setShown(false)}
                            />
                        </div>
                    ) : null}
                    <AppShellPlaceholder />
                    {!shown && (
                        <div className='container mx-auto max-w-5xl px-4'>
                            <Button variant='outline' size='sm' onClick={() => setShown(true)}>
                                Simulate a new paid refund
                            </Button>
                        </div>
                    )}
                    <Toaster />
                </div>
            );
        }
        return <SingleHarness />;
    },
};
