import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bell, BellOff, ExternalLink, ShoppingBag, WifiOff } from 'lucide-react';
import React from 'react';
import { toast, Toaster as SonnerToaster } from 'sonner';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Toaster } from '@/components/sonner';
import Spinner from '@/components/spinner';

// ---------------------------------------------------------------------------
// Implementation reference — story 274 (live in-app new-order alert).
//
// NEW behaviour added to the EXISTING admin dashboard page
// (src/pages/admin/..., the surface composed in Sprint 5's AdminDashboardPage
// story). When the admin dashboard is open, a live feed (Microsoft SignalR per
// CLAUDE.md) pushes each newly-placed customer order, and a transient in-app
// ALERT surfaces for it — no page refresh:
//
//   • 274 — order placed while the dashboard is open → a new-order alert appears
//     within a few seconds, without refreshing.
//   • 274 — the alert shows the order NUMBER and the TIME the order was placed.
//   • 274 — several orders in quick succession → a DISTINCT alert per order
//     (each toast carries its own order id, so they stack, never collapse).
//   • 274 — dashboard NOT open → no in-app alert (the live subscription only
//     exists while the dashboard is mounted; see the "Dashboard Closed" story
//     + <confirmations>).
//
// SURFACE = the alert itself, built on the app's established toast primitive
// (Sonner — src/components/sonner.tsx + the `toast` API, the same pattern used
// for the admin payment-status failure toast in Sprint 6 and the refund-routing
// toast in Sprint 7). The alert is a `toast.custom(...)` so it can carry the
// order number, placed-at time, and a "View order" action in one card; each is
// dispatched with the order id as the toast `id` so concurrent orders produce
// distinct, individually-dismissable alerts.
//
// The dashboard itself is unchanged by this sprint → the page body is a labelled
// placeholder. Only the live-alert region (the toasts) + the small "live feed"
// status pill in the header are this sprint's surface and are fully implemented.
//
// Mock-only fixtures; local interaction harness only — no api/model/state/SignalR
// imports. SignalR pushes are simulated with timers + buttons.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shapes (mock only — matches the ACs' data shape, not real models)
// ---------------------------------------------------------------------------

interface NewOrderEvent {
    /** Stable order id — used as the toast id so each order alert is distinct. */
    orderId: string;
    /** Customer-facing order number shown in the alert (274). */
    orderNumber: string;
    /** Human-readable time the order was placed, shown in the alert (274). */
    placedAt: string;
    /** Item count + total — light context so staff can triage at a glance. */
    itemCount: number;
    total: string;
}

// ---------------------------------------------------------------------------
// Fixtures — order numbers / times mirror the app's `ORD-YYYYMMDD-NNNN` +
// `DD Mon YYYY, HH:MM` conventions used across the orders surfaces.
// ---------------------------------------------------------------------------

const ORDER_ONE: NewOrderEvent = {
    orderId: 'ord-8001',
    orderNumber: 'ORD-20260625-1042',
    placedAt: '25 Jun 2026, 12:04',
    itemCount: 3,
    total: '285,000 ₫',
};

const ORDER_TWO: NewOrderEvent = {
    orderId: 'ord-8002',
    orderNumber: 'ORD-20260625-1043',
    placedAt: '25 Jun 2026, 12:04',
    itemCount: 1,
    total: '95,000 ₫',
};

const ORDER_THREE: NewOrderEvent = {
    orderId: 'ord-8003',
    orderNumber: 'ORD-20260625-1044',
    placedAt: '25 Jun 2026, 12:05',
    itemCount: 5,
    total: '612,000 ₫',
};

const BURST: NewOrderEvent[] = [ORDER_ONE, ORDER_TWO, ORDER_THREE];

// ---------------------------------------------------------------------------
// New-order alert card — the toast body (274).
//
// Order NUMBER is the headline (it is what staff act on); the placed-at TIME and
// light triage context sit beneath. "View order" is the one action — a short
// pointer trip to the order. role/aria handled by Sonner's live region so the
// alert is announced when it appears.
// ---------------------------------------------------------------------------

interface NewOrderAlertProps {
    order: NewOrderEvent;
    onViewOrder: (orderId: string) => void;
    onDismiss: () => void;
}

function NewOrderAlert({ order, onViewOrder, onDismiss }: NewOrderAlertProps) {
    return (
        <div className='flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-primary/30 bg-popover p-4 shadow-lg'>
            <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <ShoppingBag className='h-4 w-4' aria-hidden />
            </span>
            <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold text-popover-foreground'>New order</span>
                    <Badge variant='success' className='px-1.5 py-0 text-[10px] uppercase tracking-wide'>
                        Live
                    </Badge>
                </div>
                {/* Order number — the headline staff act on (274). */}
                <p className='mt-1 truncate font-mono text-sm font-semibold tracking-tight text-foreground'>
                    {order.orderNumber}
                </p>
                {/* Time placed (274) + light triage context. */}
                <p className='mt-0.5 text-xs text-muted-foreground'>
                    Placed {order.placedAt} &middot; {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}{' '}
                    &middot; {order.total}
                </p>
                <div className='mt-3'>
                    <Button size='sm' variant='outline' className='h-8' onClick={() => onViewOrder(order.orderId)}>
                        <ExternalLink className='mr-1.5 h-3.5 w-3.5' />
                        View order
                    </Button>
                </div>
            </div>
            <button
                type='button'
                aria-label='Dismiss new-order alert'
                onClick={onDismiss}
                className='shrink-0 rounded-md p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
                <span aria-hidden className='text-base leading-none'>
                    &times;
                </span>
            </button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Toast dispatch — fires one distinct alert per order (274).
//
// `id: order.orderId` keeps each alert separate (no collapse on rapid bursts)
// and individually dismissable. `duration: Infinity` so a busy admin never
// misses one to an auto-timeout — it persists until viewed or dismissed.
// ---------------------------------------------------------------------------

function pushNewOrderAlert(order: NewOrderEvent, onViewOrder: (orderId: string) => void) {
    toast.custom(
        id => (
            <NewOrderAlert
                order={order}
                onViewOrder={orderId => {
                    onViewOrder(orderId);
                    toast.dismiss(id);
                }}
                onDismiss={() => toast.dismiss(id)}
            />
        ),
        { id: order.orderId, duration: Infinity }
    );
}

// ---------------------------------------------------------------------------
// Live-feed status pill (header) — the only persistent on-page affordance for
// this surface. Tells staff the dashboard is actively listening for new orders
// (the precondition for 274's "while the dashboard is open"). Three states:
// connecting (loading), live (default), disconnected (error).
// ---------------------------------------------------------------------------

type FeedStatus = 'connecting' | 'live' | 'disconnected';

function LiveFeedPill({ status, onReconnect }: { status: FeedStatus; onReconnect?: () => void }) {
    if (status === 'connecting') {
        return (
            <span className='inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground'>
                <Spinner size='xs' />
                Connecting to live orders…
            </span>
        );
    }

    if (status === 'disconnected') {
        return (
            <span className='inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive'>
                <WifiOff className='h-3.5 w-3.5' aria-hidden />
                Live orders disconnected
                {onReconnect && (
                    <Button
                        size='sm'
                        variant='ghost'
                        className='h-6 px-2 text-xs text-destructive hover:bg-destructive/15 hover:text-destructive'
                        onClick={onReconnect}
                    >
                        Reconnect
                    </Button>
                )}
            </span>
        );
    }

    return (
        <span className='inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success'>
            <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-success' />
            </span>
            Live orders on
        </span>
    );
}

// ---------------------------------------------------------------------------
// Dashboard shell — the page is UNCHANGED by this sprint, so everything below
// the header is a labelled placeholder. The header carries the live-feed pill
// (this sprint's only persistent UI); the alerts render over the page via the
// Toaster. This puts the surface in its real page context, per the placeholder
// rule, without reimplementing the dashboard.
// ---------------------------------------------------------------------------

function DashboardShell({
    feedStatus,
    onReconnect,
    children,
}: {
    feedStatus: FeedStatus;
    onReconnect?: () => void;
    children?: React.ReactNode;
}) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {/* Top navigation — placeholder; exists in current system, not changed by this sprint */}
            <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
                <div className='h-px w-6 bg-muted-foreground/30' />
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    admin nav placeholder
                </span>
                <div className='h-px w-6 bg-muted-foreground/30' />
            </div>

            <main className='mx-auto w-full max-w-7xl px-6 py-8'>
                {/* Page header — title is existing; the live-feed pill (right) is this sprint's surface */}
                <div className='mb-8 flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
                        <p className='mt-0.5 text-sm text-muted-foreground'>
                            New orders appear here in real time while this page is open.
                        </p>
                    </div>
                    <LiveFeedPill status={feedStatus} onReconnect={onReconnect} />
                </div>

                {/* Interaction harness slot (story-only controls) */}
                {children}

                {/* Today's sales — placeholder; existing dashboard section, not changed by this sprint */}
                <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {[0, 1].map(i => (
                        <div
                            key={i}
                            className='flex h-[120px] items-center justify-center rounded-xl border border-dashed bg-muted/20'
                        >
                            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                                metric placeholder
                            </span>
                        </div>
                    ))}
                </div>

                {/* Orders / revenue charts — placeholder; existing dashboard sections, not changed by this sprint */}
                <div className='mt-4 flex h-[320px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                        dashboard charts placeholder
                    </span>
                </div>
            </main>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Static toast renderer — for non-interactive states (Default / Concurrent),
// shows the alert card(s) in their on-screen position WITHOUT depending on the
// async toast queue, so the story renders the alert deterministically. The
// Interactive stories use the real `toast` API + Sonner Toaster.
// ---------------------------------------------------------------------------

function StaticAlertStack({ orders }: { orders: NewOrderEvent[] }) {
    return (
        <div className='pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-3' aria-live='polite'>
            {orders.map(order => (
                <div key={order.orderId} className='pointer-events-auto'>
                    <NewOrderAlert order={order} onViewOrder={() => undefined} onDismiss={() => undefined} />
                </div>
            ))}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — simulates the SignalR pushes with buttons / a timed
// burst. Real app: a SignalR subscription mounted with the dashboard dispatches
// `pushNewOrderAlert` per incoming order; unmounting the dashboard tears down
// the subscription (hence no alerts when the dashboard is closed — 274).
// ---------------------------------------------------------------------------

function AlertHarness() {
    const [status] = React.useState<FeedStatus>('live');
    const counterRef = React.useRef(0);

    const handleViewOrder = (orderId: string) => {
        // Real app: navigate to the admin order detail (admin/orders/{id}).
        toast.success(`Opening order ${orderId}`);
    };

    const fireOne = () => {
        counterRef.current += 1;
        const n = counterRef.current;
        const seq = String(1042 + n).padStart(4, '0');
        pushNewOrderAlert(
            {
                orderId: `ord-live-${n}`,
                orderNumber: `ORD-20260625-${seq}`,
                placedAt: '25 Jun 2026, 12:0' + ((n % 9) + 1),
                itemCount: ((n * 2) % 5) + 1,
                total: `${(120 + n * 37) % 700},000 ₫`,
            },
            handleViewOrder
        );
    };

    const fireBurst = () => {
        BURST.forEach((order, i) => {
            window.setTimeout(() => pushNewOrderAlert(order, handleViewOrder), i * 600);
        });
    };

    return (
        <>
            <DashboardShell feedStatus={status}>
                <div className='flex flex-wrap gap-2 rounded-lg border border-dashed bg-muted/10 p-4'>
                    <span className='mr-2 self-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                        story controls — simulate the live feed
                    </span>
                    <Button size='sm' variant='outline' onClick={fireOne}>
                        Place a new order
                    </Button>
                    <Button size='sm' variant='outline' onClick={fireBurst}>
                        Burst of 3 (quick succession)
                    </Button>
                    <Button size='sm' variant='ghost' onClick={() => toast.dismiss()}>
                        Clear alerts
                    </Button>
                </div>
            </DashboardShell>
            <Toaster />
        </>
    );
}

// ---------------------------------------------------------------------------
// Auto-arrive harness — drives the "appears within a few seconds without
// refreshing" AC (274): a single alert is pushed ~2s after the dashboard
// renders, with no user action.
// ---------------------------------------------------------------------------

function AutoArriveHarness() {
    const handleViewOrder = (orderId: string) => toast.success(`Opening order ${orderId}`);

    React.useEffect(() => {
        const timer = window.setTimeout(() => pushNewOrderAlert(ORDER_ONE, handleViewOrder), 2000);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            <DashboardShell feedStatus='live'>
                <div className='rounded-lg border border-dashed bg-muted/10 p-4'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                        no user action — a new-order alert arrives ~2s after load (274)
                    </span>
                </div>
            </DashboardShell>
            <Toaster />
        </>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 8/Admin New Order Alert',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — the dashboard is open, the live feed is on, and one new-order alert
 * is shown bottom-right with the order NUMBER and the TIME placed (274). Static
 * render so the alert is always visible to the reviewer.
 */
export const Default: Story = {
    name: 'Default — Single New-Order Alert (274)',
    render: () => (
        <>
            <DashboardShell feedStatus='live' />
            <StaticAlertStack orders={[ORDER_ONE]} />
        </>
    ),
};

/**
 * Concurrent — several orders placed in quick succession produce a DISTINCT
 * alert per order, stacked (274). Each carries its own order number + time and
 * is individually dismissable.
 */
export const Concurrent: Story = {
    name: 'Partial — Concurrent Distinct Alerts (274)',
    render: () => (
        <>
            <DashboardShell feedStatus='live' />
            <StaticAlertStack orders={BURST} />
        </>
    ),
};

/**
 * Empty — the dashboard is open and the live feed is on, but no orders have come
 * in yet, so no alert is shown. The page sits quietly, listening.
 */
export const Empty: Story = {
    name: 'Empty — Listening, No New Orders Yet',
    render: () => (
        <DashboardShell feedStatus='live'>
            <div className='flex items-center gap-2 rounded-lg border bg-muted/10 px-4 py-3 text-sm text-muted-foreground'>
                <Bell className='h-4 w-4 text-muted-foreground' aria-hidden />
                Waiting for new orders — alerts will appear here automatically.
            </div>
        </DashboardShell>
    ),
};

/**
 * Loading — the dashboard has mounted and is establishing the live-orders
 * subscription. The header pill shows "Connecting…"; no alerts can arrive until
 * the feed is live.
 */
export const Loading: Story = {
    name: 'Loading — Connecting To Live Orders',
    render: () => <DashboardShell feedStatus='connecting' />,
};

/**
 * Error — the live-orders connection dropped. The header pill turns destructive
 * with a Reconnect action; while disconnected, new orders won't surface until the
 * feed is restored (the failure mode behind 274's "within a few seconds").
 */
export const Error: Story = {
    name: 'Error — Live Feed Disconnected (Reconnect)',
    render: () => <DashboardShell feedStatus='disconnected' onReconnect={() => undefined} />,
};

/**
 * Success — the admin acted on an alert: a confirmation toast shows the order is
 * being opened. (In the real app, "View order" routes to admin/orders/{id}; here
 * it is mocked with a success toast.)
 */
export const Success: Story = {
    name: 'Success — Alert Acted On (View Order)',
    render: () => {
        function SuccessHarness() {
            React.useEffect(() => {
                toast.success('Opening order ORD-20260625-1042');
            }, []);
            return (
                <>
                    <DashboardShell feedStatus='live' />
                    <SonnerToaster position='bottom-right' richColors />
                </>
            );
        }
        return <SuccessHarness />;
    },
};

/**
 * Dashboard Closed — when the dashboard is NOT open, the live subscription does
 * not exist, so NO in-app alert is shown for a placed order (274). Represented by
 * a different admin page (e.g. Orders) with no live-feed pill and no alert.
 */
export const DashboardClosed: Story = {
    name: 'Dashboard Closed — No Alert (274)',
    render: () => (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
                <div className='h-px w-6 bg-muted-foreground/30' />
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    admin nav placeholder
                </span>
                <div className='h-px w-6 bg-muted-foreground/30' />
            </div>
            <main className='mx-auto w-full max-w-7xl px-6 py-8'>
                <div className='mb-8 flex items-center gap-2.5'>
                    <BellOff className='h-5 w-5 text-muted-foreground' aria-hidden />
                    <div>
                        <h1 className='text-2xl font-bold text-foreground'>Orders</h1>
                        <p className='mt-0.5 text-sm text-muted-foreground'>
                            A different admin page — the dashboard is closed, so no live new-order alert appears here.
                        </p>
                    </div>
                </div>
                <div className='flex h-[420px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                        orders page placeholder — no live-alert subscription
                    </span>
                </div>
            </main>
        </div>
    ),
};

/**
 * Interactive — drive the live feed by hand: place a single order, fire a burst
 * of three in quick succession (each a distinct alert), view an order (mocked
 * route toast), or clear all alerts.
 */
export const Interactive: Story = {
    name: 'Interactive — Simulate The Live Feed',
    render: () => <AlertHarness />,
};

/**
 * Auto-arrive — no user action: a new-order alert arrives ~2 seconds after the
 * dashboard loads, demonstrating "appears within a few seconds without
 * refreshing" (274).
 */
export const AutoArrive: Story = {
    name: 'Interactive — Alert Auto-Arrives (~2s)',
    render: () => <AutoArriveHarness />,
};
