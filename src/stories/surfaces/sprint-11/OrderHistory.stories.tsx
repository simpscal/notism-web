import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Beef,
    CheckCircle2,
    ChevronRight,
    ClipboardList,
    CookingPot,
    CupSoda,
    Home,
    Package,
    Pizza,
    Salad,
    Search,
    ShoppingBag,
    Soup,
    StickyNote,
    Truck,
    XCircle,
    type LucideIcon,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import Timeline from '@/components/timeline';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface: OrderHistory (customer /orders) — theme-wide kit pass.
//
// SAME business behaviour as before (past orders, four+ delivery statuses,
// infinite-scroll load-more, single-CTA empty state). This pass adopts the
// shared kit for three regions that were previously bespoke:
//
//   • Top nav → the shared, domain-blind NavBar (consumer variant): a floating
//     rounded bar pinned inside the shell. The active tab ("Orders") is a REAL
//     navigation selection (NavBarItem aria-current — white pill + primary
//     accent), never a Button in a selected style. (Consistent with the Consumer
//     App Shell + Order Tracking toolbars.)
//   • Status filter → a single-select ToggleGroup (variant="segmented"): the
//     "choose one from many" filter row (All / In progress / Delivered /
//     Cancelled) is the kit's selection primitive, not a row of selected-state
//     Buttons.
//   • Per-order delivery progression → the shared Timeline primitive. Each order
//     card carries the placed → preparing → on the way → delivered progression
//     (reached steps accented + timestamped, the current step highlighted,
//     upcoming steps quiet) — the chronological progression that was previously
//     collapsed into a single flat status pill in a Card/Separator row.
//
// Theme (DESIGN_THEME.md applied):
//   • Two-tone: the order TOTAL is the loudest red on the screen (red = price).
//     Nav chrome + selection are ink; status is colour-coded but never red.
//   • List Row (§5): each order = circular thumb + order id (bold heading) + meta
//     + red total, one tap target opening the order.
//   • Shape (§4): large card radius, circular 56–64px thumbs, soft shadow on the
//     floating shell/panel only; cards flat.
//   • States (§8): hover darkens the card; empty = exactly one CTA; load-more on
//     scroll preserved.
//
// Mock-only fixtures — no api/model/state imports.
// ---------------------------------------------------------------------------

const SOFT_SHADOW = 'shadow-[0_4px_20px_rgba(0,0,0,0.05)]';

type DeliveryStatus = 'orderPlaced' | 'preparing' | 'onTheWay' | 'delivered' | 'cancelled';
type ProgressKey = 'orderPlaced' | 'preparing' | 'onTheWay' | 'delivered';

interface OrderCardData {
    /** Customer-facing order id — the card heading. */
    slugId: string;
    /** ISO timestamp; rendered as a human date under the heading. */
    createdAt: string;
    /** Pre-formatted VND total — the single crimson price emphasis. */
    total: string;
    /** A representative dish icon shown inside the circular thumbnail. */
    thumb: LucideIcon;
    deliveryStatus: DeliveryStatus;
    itemCount: number;
    hasSurcharges?: boolean;
    deliveryNotes?: string;
    /** Timestamps for each reached delivery step — drives the per-order Timeline. */
    timing: Partial<Record<ProgressKey, string>>;
}

// ---------------------------------------------------------------------------
// Floating top nav — the shared, domain-blind NavBar (consumer variant). Brand
// left · nav-items region center (the active tab is a real navigation selection
// via NavBarItem aria-current, never a Button in a selected style) · actions
// right (search + a Cart CTA). Deliberately monochrome so red stays reserved for
// the order total.
// ---------------------------------------------------------------------------

const NAV_ITEMS: { key: string; label: string; icon: LucideIcon; active?: boolean }[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'orders', label: 'Orders', icon: ClipboardList, active: true },
];

function Toolbar() {
    return (
        <NavBar className='shrink-0'>
            <NavBarBrand>
                <span className='pl-1 text-lg font-extrabold tracking-tight text-primary lg:pl-2'>Notism</span>
            </NavBarBrand>

            <NavBarNav className='hidden flex-1 justify-center md:flex'>
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavBarItem key={item.key} active={item.active}>
                            <Icon className='size-4' aria-hidden />
                            {item.label}
                        </NavBarItem>
                    );
                })}
            </NavBarNav>

            <NavBarActions>
                <Button variant='ghost' size='icon-sm' className='text-muted-foreground' aria-label='Search orders'>
                    <Search className='size-4' aria-hidden />
                </Button>
                <Button className='rounded-full'>
                    <ShoppingBag className='size-4' aria-hidden />
                    Cart
                </Button>
            </NavBarActions>
        </NavBar>
    );
}

// ---------------------------------------------------------------------------
// Page shell — the soft elevation staircase. Dark ambient frame fills the
// viewport; a single large-radius light shell floats inside it with a soft
// shadow. The floating toolbar is pinned; `children` scrolls beneath it.
// ---------------------------------------------------------------------------

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen flex-col bg-frame p-3 sm:p-5'>
            <div
                className={`mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col gap-3 overflow-hidden rounded-[2rem] bg-muted p-2.5 sm:gap-4 sm:rounded-[2.25rem] sm:p-3.5 ${SOFT_SHADOW}`}
            >
                <Toolbar />
                {children}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Status model — one word + icon + consistent tone per delivery state (status is
// never conveyed by colour alone → every badge carries the word + an icon).
// Never crimson: crimson is reserved for the order total. Cancelled reads as a
// neutral pill, not red.
// ---------------------------------------------------------------------------

interface StatusMeta {
    label: string;
    icon: LucideIcon;
    /** Soft chip tone for the status badge. */
    badge: string;
}

const STATUS_META: Record<DeliveryStatus, StatusMeta> = {
    orderPlaced: { label: 'Order placed', icon: ClipboardList, badge: 'border-border bg-muted text-foreground' },
    preparing: { label: 'Preparing', icon: CookingPot, badge: 'border-warning/25 bg-warning/10 text-warning' },
    onTheWay: { label: 'On the way', icon: Truck, badge: 'border-info/25 bg-info/10 text-info' },
    delivered: { label: 'Delivered', icon: CheckCircle2, badge: 'border-success/25 bg-success/10 text-success' },
    cancelled: { label: 'Cancelled', icon: XCircle, badge: 'border-border bg-muted text-muted-foreground' },
};

function StatusBadge({ status }: { status: DeliveryStatus }) {
    const meta = STATUS_META[status];
    const Icon = meta.icon;
    return (
        <Badge variant='outline' className={`shrink-0 gap-1.5 rounded-full px-2.5 py-1 ${meta.badge}`}>
            <Icon className='h-3.5 w-3.5' aria-hidden />
            {meta.label}
        </Badge>
    );
}

// ---------------------------------------------------------------------------
// Per-order delivery progression — the shared Timeline primitive. The four
// delivery steps (placed → preparing → on the way → delivered): reached steps
// are accented + timestamped, the current step highlighted, upcoming steps quiet
// ("Up next"). Cancelled orders show only the steps that were reached before
// cancellation; unreached steps stay quiet.
// ---------------------------------------------------------------------------

const PROGRESS_STEPS: { key: ProgressKey; label: string; icon: LucideIcon }[] = [
    { key: 'orderPlaced', label: 'Order placed', icon: ClipboardList },
    { key: 'preparing', label: 'Preparing', icon: CookingPot },
    { key: 'onTheWay', label: 'On the way', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

function buildTimelineItems(order: OrderCardData) {
    const isCancelled = order.deliveryStatus === 'cancelled';
    const current = isCancelled ? -1 : PROGRESS_STEPS.findIndex(s => s.key === order.deliveryStatus);
    return PROGRESS_STEPS.map((step, index) => ({
        title: step.label,
        icon: step.icon,
        isCompleted: isCancelled ? Boolean(order.timing[step.key]) : index < current,
        isCurrent: index === current,
        completedAt: order.timing[step.key] ?? null,
        description: !isCancelled && index > current ? 'Up next' : undefined,
    }));
}

function DeliveryProgress({ order }: { order: OrderCardData }) {
    return (
        <div className='rounded-2xl border border-border/70 bg-muted/30 p-4'>
            <p className='mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground'>
                Delivery progress
            </p>
            <Timeline items={buildTimelineItems(order)} />
            {order.deliveryStatus === 'cancelled' && (
                <p className='mt-1 flex items-center gap-1.5 text-sm text-muted-foreground'>
                    <XCircle className='h-3.5 w-3.5 shrink-0' aria-hidden />
                    This order was cancelled before delivery.
                </p>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Fixtures — mixed statuses; ids/dates mirror the app's ORD-YYYYMMDD-NNNN +
// VND-total conventions. Each order carries a representative dish icon and the
// timestamps of every delivery step it has reached.
// ---------------------------------------------------------------------------

const ORDERS: OrderCardData[] = [
    {
        slugId: 'ORD-20260703-1042',
        createdAt: '2026-07-03T12:04:00',
        total: '285,000 ₫',
        thumb: Pizza,
        deliveryStatus: 'onTheWay',
        itemCount: 3,
        deliveryNotes: 'Leave at the door, please — flat 4B.',
        timing: {
            orderPlaced: '2026-07-03T12:04:00',
            preparing: '2026-07-03T12:12:00',
            onTheWay: '2026-07-03T12:38:00',
        },
    },
    {
        slugId: 'ORD-20260702-0988',
        createdAt: '2026-07-02T19:20:00',
        total: '95,000 ₫',
        thumb: Soup,
        deliveryStatus: 'preparing',
        itemCount: 1,
        timing: {
            orderPlaced: '2026-07-02T19:20:00',
            preparing: '2026-07-02T19:27:00',
        },
    },
    {
        slugId: 'ORD-20260701-0951',
        createdAt: '2026-07-01T13:47:00',
        total: '612,000 ₫',
        thumb: Beef,
        deliveryStatus: 'delivered',
        itemCount: 5,
        hasSurcharges: true,
        timing: {
            orderPlaced: '2026-07-01T13:47:00',
            preparing: '2026-07-01T13:55:00',
            onTheWay: '2026-07-01T14:18:00',
            delivered: '2026-07-01T14:43:00',
        },
    },
    {
        slugId: 'ORD-20260628-0844',
        createdAt: '2026-06-28T20:02:00',
        total: '204,000 ₫',
        thumb: Salad,
        deliveryStatus: 'cancelled',
        itemCount: 2,
        deliveryNotes: 'Extra napkins and a spare set of chopsticks.',
        timing: {
            orderPlaced: '2026-06-28T20:02:00',
            preparing: '2026-06-28T20:09:00',
        },
    },
    {
        slugId: 'ORD-20260626-0790',
        createdAt: '2026-06-26T18:31:00',
        total: '76,000 ₫',
        thumb: CupSoda,
        deliveryStatus: 'delivered',
        itemCount: 1,
        timing: {
            orderPlaced: '2026-06-26T18:31:00',
            preparing: '2026-06-26T18:36:00',
            onTheWay: '2026-06-26T18:54:00',
            delivered: '2026-06-26T19:11:00',
        },
    },
];

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// ---------------------------------------------------------------------------
// Status filter — a single-select ToggleGroup (variant="segmented"): the kit's
// "choose one from many" selection primitive, NOT a row of selected-state
// Buttons. Selecting a status narrows the list.
// ---------------------------------------------------------------------------

type FilterKey = 'all' | 'active' | 'delivered' | 'cancelled';

const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'In progress' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
];

const ACTIVE_STATUSES: DeliveryStatus[] = ['orderPlaced', 'preparing', 'onTheWay'];

function matchesFilter(order: OrderCardData, filter: FilterKey): boolean {
    if (filter === 'all') return true;
    if (filter === 'active') return ACTIVE_STATUSES.includes(order.deliveryStatus);
    return order.deliveryStatus === filter;
}

function StatusFilter({ value, onChange }: { value: FilterKey; onChange: (value: FilterKey) => void }) {
    return (
        <ToggleGroup
            type='single'
            variant='segmented'
            value={value}
            onValueChange={next => {
                if (next) onChange(next as FilterKey);
            }}
            className='w-full max-w-full flex-wrap justify-start sm:w-auto'
            aria-label='Filter orders by status'
        >
            {FILTERS.map(filter => (
                <ToggleGroupItem key={filter.key} value={filter.key} className='px-4'>
                    {filter.label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
}

// ---------------------------------------------------------------------------
// Order card — a List Row (§5): circular thumb + order id (bold heading) + meta
// + red total, inside one rounded card that is a single tap target opening the
// order. The delivery progression is the shared Timeline, shown beside the meta
// on desktop and stacked on mobile. Flat card; hover darkens surface + border.
// ---------------------------------------------------------------------------

function OrderCard({ order, onOpen }: { order: OrderCardData; onOpen: (slugId: string) => void }) {
    const Thumb = order.thumb;
    const handleOpen = () => onOpen(order.slugId);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
        }
    };
    return (
        <Card
            role='button'
            tabIndex={0}
            aria-label={`Open order ${order.slugId}`}
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            className='group cursor-pointer gap-0 rounded-[22px] border-border/70 p-4 shadow-none transition-colors outline-none hover:border-primary/30 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-5'
        >
            <div className='grid gap-4 md:grid-cols-[minmax(0,1fr)_18rem] md:gap-6'>
                {/* Left column — the List Row: thumb + heading + meta + red total. */}
                <div className='flex items-start gap-4'>
                    <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/70 transition-colors group-hover:bg-background sm:h-16 sm:w-16'>
                        <Thumb className='h-6 w-6 sm:h-7 sm:w-7' aria-hidden />
                    </div>

                    <div className='flex min-w-0 flex-1 flex-col gap-2'>
                        <div className='flex items-start justify-between gap-3'>
                            <div className='min-w-0'>
                                <h3 className='truncate text-xl font-bold tracking-tight text-foreground'>
                                    {order.slugId}
                                </h3>
                                <p className='mt-0.5 text-xs text-muted-foreground'>{formatDate(order.createdAt)}</p>
                            </div>
                            <StatusBadge status={order.deliveryStatus} />
                        </div>

                        <p className='text-sm text-muted-foreground'>
                            {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                            {order.hasSurcharges ? ' · Includes customisation surcharges' : ''}
                        </p>

                        {order.deliveryNotes && (
                            <div className='flex items-start gap-1.5 text-sm text-muted-foreground'>
                                <StickyNote className='mt-0.5 h-3.5 w-3.5 shrink-0' aria-hidden />
                                <span>{order.deliveryNotes}</span>
                            </div>
                        )}

                        <Separator className='my-1' />

                        <div className='flex items-end justify-between'>
                            <div className='space-y-0.5'>
                                <p className='text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground'>
                                    Total
                                </p>
                                <p className='text-xl font-bold tracking-tight text-primary'>{order.total}</p>
                            </div>
                            <span className='inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground'>
                                View order
                                <ChevronRight
                                    className='h-4 w-4 transition-transform group-hover:translate-x-0.5'
                                    aria-hidden
                                />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right column — the shared Timeline: this order's delivery progression. */}
                <DeliveryProgress order={order} />
            </div>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Load-more sentinel — mirrors src/pages/orders OrdersLoadMore. The list loads
// more on scroll; this row is where the fetch state surfaces at the list foot.
// ---------------------------------------------------------------------------

type LoadMoreState = 'loading' | 'end' | 'idle';

function LoadMore({ state }: { state: LoadMoreState }) {
    if (state === 'loading') {
        return (
            <div className='mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                <Spinner size='sm' />
                <span>Loading more orders…</span>
            </div>
        );
    }
    if (state === 'end') {
        return (
            <p className='mt-8 text-center text-sm text-muted-foreground'>
                You&rsquo;ve reached the end of your orders
            </p>
        );
    }
    return null;
}

// ---------------------------------------------------------------------------
// Filtered-empty — a filter matched nothing. A quiet in-list message (no dead
// end); the filter can be cleared without leaving the page.
// ---------------------------------------------------------------------------

function NoMatches({ label }: { label: string }) {
    return (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 px-6 py-14 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                <Package className='h-7 w-7 text-muted-foreground' aria-hidden />
            </div>
            <p className='text-base font-semibold text-foreground'>No {label.toLowerCase()} orders</p>
            <p className='mt-1 max-w-xs text-sm text-muted-foreground'>
                Try a different filter to see more of your order history.
            </p>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Order-history body — the white content panel: hairline + soft shadow, one
// gentle step above the light shell. Header + status filter are pinned; the card
// list scrolls within the shell beneath them (load-more on scroll preserved,
// single scroll region).
// ---------------------------------------------------------------------------

function OrderHistoryPage({
    orders,
    loadMore,
    initialFilter = 'all',
}: {
    orders: OrderCardData[];
    loadMore: LoadMoreState;
    initialFilter?: FilterKey;
}) {
    const [filter, setFilter] = React.useState<FilterKey>(initialFilter);
    const noOp = () => undefined;

    const visible = orders.filter(order => matchesFilter(order, filter));
    const activeFilter = FILTERS.find(f => f.key === filter);

    return (
        <Shell>
            <div
                className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-background ${SOFT_SHADOW}`}
            >
                {/* Pinned panel header + status filter */}
                <header className='shrink-0 border-b border-border/60 px-5 pt-6 pb-5 sm:px-8'>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>My orders</h1>
                        {orders.length > 0 && (
                            <span className='rounded-full bg-muted px-3 py-0.5 text-sm font-semibold text-muted-foreground'>
                                {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                            </span>
                        )}
                    </div>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        Track a delivery in progress or reopen any past order.
                    </p>
                    <div className='mt-4'>
                        <StatusFilter value={filter} onChange={setFilter} />
                    </div>
                </header>

                {/* Scrolling card list — the only scroll region in the shell */}
                <div className='min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8 sm:px-6'>
                    <div className='mx-auto w-full max-w-3xl space-y-4'>
                        {visible.length > 0 ? (
                            <>
                                {visible.map(order => (
                                    <OrderCard key={order.slugId} order={order} onOpen={noOp} />
                                ))}
                                <LoadMore state={loadMore} />
                            </>
                        ) : (
                            <NoMatches label={activeFilter?.label ?? 'matching'} />
                        )}
                    </div>
                </div>
            </div>
        </Shell>
    );
}

// ---------------------------------------------------------------------------
// Empty state — illustration + exactly ONE CTA (no dead ends). The CTA leads
// back to the menu; it is a structural primary action (not a final/irreversible
// step), so it is ink, not red.
// ---------------------------------------------------------------------------

function OrderHistoryEmpty() {
    return (
        <Shell>
            <div
                className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-background ${SOFT_SHADOW}`}
            >
                <header className='shrink-0 border-b border-border/60 px-5 pt-6 pb-5 sm:px-8'>
                    <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>My orders</h1>
                    <p className='mt-2 text-sm text-muted-foreground'>
                        Track a delivery in progress or reopen any past order.
                    </p>
                </header>

                <div className='flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-16 text-center'>
                    <div className='mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-muted'>
                        <Package className='h-10 w-10 text-muted-foreground' aria-hidden />
                    </div>
                    <h2 className='mb-2 text-2xl font-bold text-foreground'>No orders yet</h2>
                    <p className='mb-6 max-w-xs text-sm text-muted-foreground'>
                        Start shopping to see your orders here.
                    </p>
                    <Button
                        size='lg'
                        className='bg-selected text-selected-foreground hover:bg-selected/90 rounded-full px-8'
                    >
                        Browse menu
                    </Button>
                </div>
            </div>
        </Shell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Order History',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — a list of past orders with MIXED statuses. Each order is a List Row
 * card (circular dish thumb, order id as a bold heading, total in crimson) beside
 * the shared Timeline showing that order's delivery progression. The status
 * filter above the list is a single-select segmented ToggleGroup. The whole card
 * is one tap target that opens the order.
 */
export const Default: Story = {
    name: 'Default — Orders With Delivery Timeline',
    render: () => <OrderHistoryPage orders={ORDERS} loadMore='idle' />,
};

/**
 * Partial — a status filter is applied. The segmented ToggleGroup narrows the
 * history to in-progress orders; each still shows its live delivery progression
 * on the shared Timeline. Selecting another chip re-filters without leaving the
 * page.
 */
export const Filtered: Story = {
    name: 'Partial — Filtered To In Progress',
    render: () => <OrderHistoryPage orders={ORDERS} loadMore='idle' initialFilter='active' />,
};

/**
 * Loading more — the customer has scrolled to the foot of the list and the next
 * page is being fetched (infinite scroll, unchanged). The already-loaded cards
 * stay put; a quiet spinner row sits at the list foot.
 */
export const LoadingMore: Story = {
    name: 'Loading — Loading More On Scroll',
    render: () => <OrderHistoryPage orders={ORDERS} loadMore='loading' />,
};

/**
 * Empty — no orders yet. An illustration and a single, unambiguous ink CTA lead
 * back to the menu (exactly one call to action, no dead ends).
 */
export const Empty: Story = {
    name: 'Empty — No Orders Yet (Single CTA)',
    render: () => <OrderHistoryEmpty />,
};
