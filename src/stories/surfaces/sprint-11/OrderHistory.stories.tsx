import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Beef,
    ChevronRight,
    CircleDot,
    ClipboardList,
    CookingPot,
    CheckCircle2,
    CupSoda,
    Heart,
    LayoutGrid,
    LifeBuoy,
    Package,
    Pizza,
    Salad,
    Sandwich,
    Search,
    ShoppingBag,
    Soup,
    StickyNote,
    Truck,
    UtensilsCrossed,
    XCircle,
    type LucideIcon,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';

// ---------------------------------------------------------------------------
// Order history (customer /orders) — conformed to DESIGN_THEME.md.
//
// Business behaviour is UNCHANGED (same order fields, four+ delivery statuses,
// infinite-scroll load-more, single-CTA empty state). Only the visuals conform:
//
//   • Two-tone: the order TOTAL is the only red on the screen (theme: red =
//     commerce/price). Nav chrome is monochrome black/white, status is colour-
//     coded but NEVER red — so no red competes with the price.
//   • List Row (§5): each order is a rounded card = circular thumb + order id
//     (bold heading) + meta + red total, one tap target for the whole card.
//   • Type (§3): order id = bold heading; total = accent-primary bold.
//   • Shape (§4): card radius 22px, circular 56–64px thumbs, soft shadow on the
//     floating shell/panel only, cards flat.
//   • States (§8): hover darkens the card; empty = exactly one CTA; load-more
//     on scroll preserved.
//
// Mock-only fixtures — no api/model/state imports.
// ---------------------------------------------------------------------------

const SOFT_SHADOW = 'shadow-[0_4px_20px_rgba(0,0,0,0.05)]';

type DeliveryStatus = 'orderPlaced' | 'preparing' | 'onTheWay' | 'delivered' | 'cancelled';

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
}

// ---------------------------------------------------------------------------
// Floating rounded toolbar — the global nav shell region. A white bar floating
// inside the light shell: brand left, nav centre (active = solid black pill,
// §5), search + Cart pill right. Deliberately monochrome so red stays reserved
// for the order total.
// ---------------------------------------------------------------------------

interface NavItem {
    label: string;
    icon: LucideIcon;
    active?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Menu', icon: LayoutGrid },
    { label: 'Orders', icon: ClipboardList, active: true },
    { label: 'Favorites', icon: Heart },
    { label: 'Help', icon: LifeBuoy },
];

function NavPill({ item }: { item: NavItem }) {
    const Icon = item.icon;
    if (item.active) {
        return (
            <span className='inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background'>
                <Icon className='h-4 w-4' aria-hidden />
                {item.label}
            </span>
        );
    }
    return (
        <span className='inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'>
            <Icon className='h-4 w-4' aria-hidden />
            {item.label}
        </span>
    );
}

function Toolbar() {
    return (
        <nav className='flex shrink-0 items-center justify-between gap-3 rounded-[1.5rem] border border-border/60 bg-background px-3 py-2 sm:px-4'>
            {/* Brand — mark + wordmark carry the accent RED as identity (theme §2); kept quiet in weight so the price red still reads loudest */}
            <div className='flex items-center gap-2 pl-1'>
                <UtensilsCrossed className='h-5 w-5 text-primary' aria-hidden />
                <span className='text-lg font-bold tracking-tight text-primary'>Notism</span>
            </div>

            {/* Centre nav — active takes a solid black pill (§5) */}
            <div className='hidden items-center gap-1 md:flex'>
                {NAV_ITEMS.map(item => (
                    <NavPill key={item.label} item={item} />
                ))}
            </div>

            {/* Search + Cart — Cart is a structural nav action, so black (§ two-tone) */}
            <div className='flex items-center gap-2'>
                <Button variant='ghost' size='icon-sm' aria-label='Search orders'>
                    <Search className='h-4 w-4' aria-hidden />
                </Button>
                <Button className='rounded-full px-4'>
                    <ShoppingBag className='h-4 w-4' aria-hidden />
                    Cart
                </Button>
            </div>
        </nav>
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
// Status roles — one consistent colour per delivery state (theme: status colour
// only for status; never colour alone → every pill carries the word + an icon).
// Never crimson: crimson is reserved for the order total. Cancelled reads as a
// neutral zinc pill, not red.
// ---------------------------------------------------------------------------

interface StatusRole {
    label: string;
    icon: LucideIcon;
    chip: string;
    dot: string;
}

const STATUS_ROLES: Record<DeliveryStatus, StatusRole> = {
    orderPlaced: {
        label: 'Order placed',
        icon: CircleDot,
        chip: 'border-slate-200 bg-slate-100 text-slate-700',
        dot: 'bg-slate-500',
    },
    preparing: {
        label: 'Preparing',
        icon: CookingPot,
        chip: 'border-amber-200 bg-amber-100 text-amber-800',
        dot: 'bg-amber-500',
    },
    onTheWay: {
        label: 'On the way',
        icon: Truck,
        chip: 'border-sky-200 bg-sky-100 text-sky-800',
        dot: 'bg-sky-500',
    },
    delivered: {
        label: 'Delivered',
        icon: CheckCircle2,
        chip: 'border-emerald-200 bg-emerald-100 text-emerald-800',
        dot: 'bg-emerald-600',
    },
    cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        chip: 'border-zinc-200 bg-zinc-100 text-zinc-600',
        dot: 'bg-zinc-400',
    },
};

function StatusPill({ status }: { status: DeliveryStatus }) {
    const role = STATUS_ROLES[status];
    const Icon = role.icon;
    return (
        <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${role.chip}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${role.dot}`} aria-hidden />
            <Icon className='h-3.5 w-3.5' aria-hidden />
            {role.label}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Fixtures — mixed statuses; ids/dates mirror the app's ORD-YYYYMMDD-NNNN +
// VND-total conventions. Each order carries a representative dish icon for its
// circular thumbnail.
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
    },
    {
        slugId: 'ORD-20260702-0988',
        createdAt: '2026-07-02T19:20:00',
        total: '95,000 ₫',
        thumb: Soup,
        deliveryStatus: 'preparing',
        itemCount: 1,
    },
    {
        slugId: 'ORD-20260701-0951',
        createdAt: '2026-07-01T13:47:00',
        total: '612,000 ₫',
        thumb: Beef,
        deliveryStatus: 'delivered',
        itemCount: 5,
        hasSurcharges: true,
    },
    {
        slugId: 'ORD-20260630-0902',
        createdAt: '2026-06-30T11:15:00',
        total: '148,000 ₫',
        thumb: Sandwich,
        deliveryStatus: 'orderPlaced',
        itemCount: 2,
    },
    {
        slugId: 'ORD-20260628-0844',
        createdAt: '2026-06-28T20:02:00',
        total: '204,000 ₫',
        thumb: Salad,
        deliveryStatus: 'cancelled',
        itemCount: 2,
        deliveryNotes: 'Extra napkins and a spare set of chopsticks.',
    },
    {
        slugId: 'ORD-20260626-0790',
        createdAt: '2026-06-26T18:31:00',
        total: '76,000 ₫',
        thumb: CupSoda,
        deliveryStatus: 'delivered',
        itemCount: 1,
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
// Order card — a List Row (§5): circular thumb + order id (bold heading) + meta
// + red total, all inside one rounded card that is a single tap target opening
// the order. The chevron is a visual affordance, not a second target. Flat card;
// hover darkens the surface + border (§8), no layout motion.
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
            className='group cursor-pointer flex-row items-start gap-4 rounded-[22px] border-border/70 p-4 shadow-none transition-colors outline-none hover:border-primary/30 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:p-5'
        >
            {/* Circular thumbnail (§5) */}
            <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted text-foreground/70 transition-colors group-hover:bg-background sm:h-16 sm:w-16'>
                <Thumb className='h-6 w-6 sm:h-7 sm:w-7' aria-hidden />
            </div>

            {/* Body */}
            <div className='flex min-w-0 flex-1 flex-col gap-2'>
                <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                        <h3 className='truncate text-xl font-bold tracking-tight text-foreground'>{order.slugId}</h3>
                        <p className='mt-0.5 text-xs text-muted-foreground'>{formatDate(order.createdAt)}</p>
                    </div>
                    <StatusPill status={order.deliveryStatus} />
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
// Order-history body — the white content panel: hairline + soft shadow, one
// gentle step above the light shell. The header is pinned; the card list scrolls
// within the shell beneath it (load-more on scroll preserved, single scroll
// region).
// ---------------------------------------------------------------------------

function OrderHistoryPage({
    orders,
    loadMore,
    count,
}: {
    orders: OrderCardData[];
    loadMore: LoadMoreState;
    count: number;
}) {
    const noOp = () => undefined;
    return (
        <Shell>
            <div
                className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-background ${SOFT_SHADOW}`}
            >
                {/* Pinned panel header */}
                <header className='shrink-0 border-b border-border/60 px-5 pt-6 pb-5 sm:px-8'>
                    <div className='flex items-center gap-3'>
                        <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>My orders</h1>
                        {count > 0 && (
                            <span className='rounded-full bg-muted px-3 py-0.5 text-sm font-semibold text-muted-foreground'>
                                {count} {count === 1 ? 'order' : 'orders'}
                            </span>
                        )}
                    </div>
                    <p className='mt-2 text-sm text-muted-foreground'>Find and reopen any past order.</p>
                </header>

                {/* Scrolling card list — the only scroll region in the shell */}
                <div className='min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-8 sm:px-6'>
                    <div className='mx-auto w-full max-w-2xl space-y-4'>
                        {orders.map(order => (
                            <OrderCard key={order.slugId} order={order} onOpen={noOp} />
                        ))}
                        <LoadMore state={loadMore} />
                    </div>
                </div>
            </div>
        </Shell>
    );
}

// ---------------------------------------------------------------------------
// Empty state — illustration + exactly ONE CTA (theme: no dead ends). The CTA
// leads back to the menu; it is a structural primary action (not a final/
// irreversible step), so it is black, not red.
// ---------------------------------------------------------------------------

function OrderHistoryEmpty() {
    return (
        <Shell>
            <div
                className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-background ${SOFT_SHADOW}`}
            >
                <header className='shrink-0 border-b border-border/60 px-5 pt-6 pb-5 sm:px-8'>
                    <h1 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>My orders</h1>
                    <p className='mt-2 text-sm text-muted-foreground'>Find and reopen any past order.</p>
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
 * card: circular dish thumb, order id as a bold heading, total in crimson (the
 * only red on the screen), delivery status in words + icon + a consistent per-
 * state colour. The whole card is one tap target that opens the order.
 */
export const Default: Story = {
    name: 'Default — Order Cards (Mixed Statuses)',
    render: () => <OrderHistoryPage orders={ORDERS} loadMore='idle' count={ORDERS.length} />,
};

/**
 * Loading more — the customer has scrolled to the foot of the list and the next
 * page is being fetched (infinite scroll, unchanged). The already-loaded cards
 * stay put; a quiet spinner row sits at the list foot.
 */
export const LoadingMore: Story = {
    name: 'Loading — Loading More On Scroll',
    render: () => <OrderHistoryPage orders={ORDERS} loadMore='loading' count={24} />,
};

/**
 * Empty — no orders yet. An illustration and a single, unambiguous black CTA
 * lead back to the menu (theme: exactly one call to action, no dead ends).
 */
export const Empty: Story = {
    name: 'Empty — No Orders Yet (Single CTA)',
    render: () => <OrderHistoryEmpty />,
};
