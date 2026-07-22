import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    BarChart3,
    Bell,
    ExternalLink,
    LayoutDashboard,
    Moon,
    Package,
    Receipt,
    ShoppingBag,
    WifiOff,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';
import { toast, Toaster as SonnerToaster } from 'sonner';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import { Toaster } from '@/uis/sonner';
import Spinner from '@/uis/spinner';

// ---------------------------------------------------------------------------
// Implementation reference — story 274 (live in-app new-order alert), AMENDED
// per #273: PORTAL-WIDE, not dashboard-scoped.
//
// The live order-status element is a GLOBAL part of the admin portal SHELL /
// LAYOUT (the persistent chrome wrapping every admin page) — not a feature of
// the dashboard page. It is mounted ONCE at the portal layout root, so it is
// present and live on every admin route, and the live connection persists as
// staff navigate between pages:
//
//   • 274 — order placed while ANY admin page is open → a new-order alert
//     appears within a few seconds, no refresh / navigation.
//   • 274 — the alert shows the order NUMBER and the TIME the order was placed
//     (item count + total as light triage context).
//   • 274 — several orders in quick succession → a DISTINCT alert per order
//     (each toast carries its own order id, so they stack, never collapse).
//   • 274 — moving from one admin page to another → the live order-status
//     element stays present and keeps receiving alerts; the connection is NOT
//     dropped and no alert is missed (the subscription lives on the shell, not
//     the page).
//   • 274 — portal NOT open → no in-app alert (the subscription only exists
//     while the portal shell is mounted; see the "Portal Closed" story).
//
// SURFACE = the portal-wide live order-status element: the Sonner alert region
// (toast.custom, src/uis/sonner.tsx — same primitive as the Sprint 6
// payment-status toast and Sprint 7 refund-routing toast) + the connection-
// status pill (connecting | live | disconnected) in the portal top-bar. BOTH
// belong to the shell. Individual admin PAGE bodies are unchanged by this
// sprint → rendered as labelled placeholders; only the shell-level live element
// is fully implemented.
//
// Mock-only fixtures; local interaction harness only — no api/model/state/
// SignalR imports. Live pushes are simulated with timers + buttons.
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
// Admin portal nav model — the live element is on the SHELL, so it stays put
// across all of these pages.
// ---------------------------------------------------------------------------

interface AdminPage {
    key: string;
    label: string;
    icon: LucideIcon;
}

const ADMIN_PAGES: AdminPage[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'refunds', label: 'Refunds', icon: Receipt },
    { key: 'reports', label: 'Reports', icon: BarChart3 },
];

// ---------------------------------------------------------------------------
// New-order alert card — the toast body (274).
//
// Order NUMBER is the headline (it is what staff act on); the placed-at TIME and
// light triage context sit beneath. "View order" is the one action — a short
// pointer trip to the order. role/aria handled by Sonner's live region so the
// alert is announced when it appears, on whatever page is active.
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
// Because the Toaster lives on the shell, an alert dispatched here renders over
// whatever admin page is currently active.
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
// Live-feed connection pill — lives in the portal TOP-BAR (shell), so it shows
// the connection state on EVERY admin page (274's "live element remains present
// across navigation"). Three states: connecting (loading), live (default),
// disconnected (error).
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
// Admin portal SHELL — the persistent chrome that wraps EVERY admin page.
//
// This is where the live order-status element now lives (the amendment): the
// connection pill sits in the top-bar, and the alert Toaster is mounted at the
// shell root (see harnesses below). The nav switches the page BODY while the
// shell — pill + alert region + subscription — stays mounted. The active page
// body is a labelled placeholder (pages are unchanged by this sprint); only the
// shell-level live element is fully implemented.
// ---------------------------------------------------------------------------

function AdminPortalShell({
    feedStatus,
    activePage,
    onNavigate,
    onReconnect,
    children,
}: {
    feedStatus: FeedStatus;
    activePage: string;
    onNavigate?: (key: string) => void;
    onReconnect?: () => void;
    children?: React.ReactNode;
}) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {/* Portal top-bar — SHELL. Brand + nav are existing chrome; the live-feed pill
                (right) is this sprint's surface and is present on every page. */}
            <header className='sticky top-0 z-50 h-16 w-full border-b bg-background'>
                <div className='mx-auto flex h-full w-full max-w-7xl items-center px-6'>
                    <div className='flex items-center gap-2'>
                        <span className='text-lg font-semibold tracking-tight text-primary'>Notism</span>
                        <Badge
                            variant='secondary'
                            className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'
                        >
                            Admin
                        </Badge>
                    </div>

                    {/* Portal nav — switches the page BODY; the shell (and the live element) persists */}
                    <nav className='ml-6 flex items-center gap-1'>
                        {ADMIN_PAGES.map(page => {
                            const Icon = page.icon;
                            const active = page.key === activePage;
                            return (
                                <button
                                    key={page.key}
                                    type='button'
                                    aria-current={active ? 'page' : undefined}
                                    onClick={() => onNavigate?.(page.key)}
                                    className={[
                                        'inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors',
                                        active
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                                    ].join(' ')}
                                >
                                    <Icon className='h-4 w-4' aria-hidden />
                                    {page.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Right — live-feed pill (this sprint's shell-level surface) + chrome placeholders */}
                    <div className='ml-auto flex items-center gap-3'>
                        <LiveFeedPill status={feedStatus} onReconnect={onReconnect} />
                        <button
                            aria-label='Toggle theme'
                            className='flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground'
                        >
                            <Moon className='h-4 w-4' />
                        </button>
                        <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground'>
                            TM
                        </div>
                    </div>
                </div>
            </header>

            <main className='mx-auto w-full max-w-7xl px-6 py-8'>{children}</main>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page body — a labelled placeholder per admin page. Pages are UNCHANGED by
// this sprint; the point is that the SAME shell-level live element rides over
// any of them.
// ---------------------------------------------------------------------------

function AdminPageBody({ activePage, harness }: { activePage: string; harness?: React.ReactNode }) {
    const page = ADMIN_PAGES.find(p => p.key === activePage) ?? ADMIN_PAGES[0];
    const Icon = page.icon;
    return (
        <>
            <div className='mb-6 flex items-center gap-2.5'>
                <Icon className='h-5 w-5 text-muted-foreground' aria-hidden />
                <div>
                    <h1 className='text-2xl font-bold text-foreground'>{page.label}</h1>
                    <p className='mt-0.5 text-sm text-muted-foreground'>
                        Live new-order alerts arrive here in real time on every admin page.
                    </p>
                </div>
            </div>

            {harness}

            {/* Page content — placeholder; exists in current system, not changed by this sprint */}
            <div className='mt-6 flex h-[360px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                    {page.label.toLowerCase()} page body placeholder
                </span>
            </div>
        </>
    );
}

// ---------------------------------------------------------------------------
// Story-only control panel — simulates the live feed (timers + buttons stand in
// for the real shell-level subscription).
// ---------------------------------------------------------------------------

function FeedControls({
    onFireOne,
    onFireBurst,
    note,
}: {
    onFireOne: () => void;
    onFireBurst: () => void;
    note?: string;
}) {
    return (
        <div className='flex flex-wrap items-center gap-2 rounded-lg border border-dashed bg-muted/10 p-4'>
            <span className='mr-2 self-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                {note ?? 'story controls — simulate the live feed'}
            </span>
            <Button size='sm' variant='outline' onClick={onFireOne}>
                Place a new order
            </Button>
            <Button size='sm' variant='outline' onClick={onFireBurst}>
                Burst of 3 (quick succession)
            </Button>
            <Button size='sm' variant='ghost' onClick={() => toast.dismiss()}>
                Clear alerts
            </Button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Static toast renderer — for non-interactive states (Default / Concurrent),
// shows the alert card(s) in their on-screen position WITHOUT depending on the
// async toast queue, so the story renders the alert deterministically. The
// interactive stories use the real `toast` API + the shell-mounted Toaster.
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
// Portal harness — a persistent shell with a working page-switcher. The shell
// (pill + Toaster + the running counter that stands in for the live
// subscription) stays mounted as the active page body changes, demonstrating
// that navigation does NOT drop the connection or miss alerts (274). Firing an
// order on one page, switching pages, and seeing the alert persist proves the
// element is portal-wide.
// ---------------------------------------------------------------------------

function PortalHarness({ initialPage = 'dashboard' }: { initialPage?: string }) {
    const [activePage, setActivePage] = React.useState(initialPage);
    const counterRef = React.useRef(0);

    const handleViewOrder = (orderId: string) => toast.success(`Opening order ${orderId}`);

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
            <AdminPortalShell feedStatus='live' activePage={activePage} onNavigate={setActivePage}>
                <AdminPageBody
                    activePage={activePage}
                    harness={
                        <FeedControls
                            onFireOne={fireOne}
                            onFireBurst={fireBurst}
                            note='switch pages above — the live element + alerts persist (274)'
                        />
                    }
                />
            </AdminPortalShell>
            <Toaster />
        </>
    );
}

// ---------------------------------------------------------------------------
// Auto-arrive harness — drives "appears within a few seconds without
// refreshing" (274): a single alert is pushed ~2s after the portal renders,
// with no user action, over a non-dashboard page to underline that the element
// is portal-wide.
// ---------------------------------------------------------------------------

function AutoArriveHarness() {
    const handleViewOrder = (orderId: string) => toast.success(`Opening order ${orderId}`);

    React.useEffect(() => {
        const timer = window.setTimeout(() => pushNewOrderAlert(ORDER_ONE, handleViewOrder), 2000);
        return () => window.clearTimeout(timer);
    }, []);

    return (
        <>
            <AdminPortalShell feedStatus='live' activePage='orders'>
                <AdminPageBody
                    activePage='orders'
                    harness={
                        <div className='rounded-lg border border-dashed bg-muted/10 p-4'>
                            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                                no user action — a new-order alert arrives ~2s after load, on the Orders page (274)
                            </span>
                        </div>
                    }
                />
            </AdminPortalShell>
            <Toaster />
        </>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 8/Admin Live Order Feed',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — the admin portal is open (here on the Orders page), the live feed is
 * on (pill in the top-bar), and one new-order alert is shown bottom-right with
 * the order NUMBER and the TIME placed (274). The live element belongs to the
 * shell, so it rides over any page — shown here over a non-dashboard page.
 * Static render so the alert is always visible to the reviewer.
 */
export const Default: Story = {
    name: 'Default — Portal-Wide New-Order Alert (274)',
    render: () => (
        <>
            <AdminPortalShell feedStatus='live' activePage='orders'>
                <AdminPageBody activePage='orders' />
            </AdminPortalShell>
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
            <AdminPortalShell feedStatus='live' activePage='reports'>
                <AdminPageBody activePage='reports' />
            </AdminPortalShell>
            <StaticAlertStack orders={BURST} />
        </>
    ),
};

/**
 * Empty — the portal is open and the live feed is on, but no orders have come in
 * yet, so no alert is shown. The shell sits quietly, listening, on every page.
 */
export const Empty: Story = {
    name: 'Empty — Listening, No New Orders Yet',
    render: () => (
        <AdminPortalShell feedStatus='live' activePage='dashboard'>
            <AdminPageBody
                activePage='dashboard'
                harness={
                    <div className='flex items-center gap-2 rounded-lg border bg-muted/10 px-4 py-3 text-sm text-muted-foreground'>
                        <Bell className='h-4 w-4 text-muted-foreground' aria-hidden />
                        Waiting for new orders — alerts will appear here automatically, on any page.
                    </div>
                }
            />
        </AdminPortalShell>
    ),
};

/**
 * Loading — the portal shell has mounted and is establishing the live-orders
 * subscription. The top-bar pill shows "Connecting…"; no alerts can arrive until
 * the feed is live.
 */
export const Loading: Story = {
    name: 'Loading — Connecting To Live Orders',
    render: () => (
        <AdminPortalShell feedStatus='connecting' activePage='dashboard'>
            <AdminPageBody activePage='dashboard' />
        </AdminPortalShell>
    ),
};

/**
 * Error — the live-orders connection dropped. The top-bar pill turns destructive
 * with a Reconnect action; while disconnected, new orders won't surface until the
 * feed is restored (the failure mode behind 274's "within a few seconds").
 */
export const Error: Story = {
    name: 'Error — Live Feed Disconnected (Reconnect)',
    render: () => (
        <AdminPortalShell feedStatus='disconnected' activePage='dashboard' onReconnect={() => undefined}>
            <AdminPageBody activePage='dashboard' />
        </AdminPortalShell>
    ),
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
                    <AdminPortalShell feedStatus='live' activePage='orders'>
                        <AdminPageBody activePage='orders' />
                    </AdminPortalShell>
                    <SonnerToaster position='bottom-right' richColors />
                </>
            );
        }
        return <SuccessHarness />;
    },
};

/**
 * Portal Closed — when NO staff member has the admin portal open, the live
 * subscription does not exist, so NO in-app alert is shown for a placed order
 * (274). Represented by the admin sign-in screen: the portal shell (and its live
 * element) is not mounted, hence no top-bar pill and no alert.
 */
export const PortalClosed: Story = {
    name: 'Portal Closed — No Alert (274)',
    render: () => (
        <div className='flex min-h-screen items-center justify-center bg-muted/30 px-6'>
            <div className='w-full max-w-sm rounded-2xl border bg-background p-8 text-center shadow-sm'>
                <span className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                    <WifiOff className='h-5 w-5' aria-hidden />
                </span>
                <h1 className='text-lg font-semibold text-foreground'>Admin portal closed</h1>
                <p className='mt-2 text-sm text-muted-foreground'>
                    No staff member has the admin portal open, so the live order feed is not connected — orders placed
                    now raise no in-app alert until the portal is opened again.
                </p>
                <div className='mt-6 flex h-[44px] items-center justify-center rounded-lg border border-dashed bg-muted/20'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                        admin sign-in placeholder
                    </span>
                </div>
            </div>
        </div>
    ),
};

/**
 * Interactive — drive the live feed by hand AND switch admin pages: place an
 * order, fire a burst, then change pages via the top-bar nav. The shell, the
 * live-feed pill, and the alert region all persist across navigation, and no
 * alert is dropped — demonstrating the portal-wide, connection-persistent
 * behaviour (274).
 */
export const Interactive: Story = {
    name: 'Interactive — Persists Across Page Navigation',
    render: () => <PortalHarness />,
};

/**
 * Auto-arrive — no user action: a new-order alert arrives ~2 seconds after the
 * portal loads, on the Orders page (a non-dashboard page), demonstrating both
 * "appears within a few seconds without refreshing" and that the element is
 * portal-wide (274).
 */
export const AutoArrive: Story = {
    name: 'Interactive — Alert Auto-Arrives (~2s, Non-Dashboard Page)',
    render: () => <AutoArriveHarness />,
};
