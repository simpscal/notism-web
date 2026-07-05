import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ArrowUpDown,
    LayoutDashboard,
    Moon,
    Package,
    Receipt,
    Tags,
    UtensilsCrossed,
    Users,
    WifiOff,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import Spinner from '@/components/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

// ---------------------------------------------------------------------------
// Surface — AdminAppShell (Sprint 11), route: wraps all /admin routes.
//
// RESTYLE ONLY. Business functionality is unchanged from src/layouts/admin/ —
// same nav model (Dashboard, Orders, Refunds, Foods, Categories, Users), same
// portal-wide live new-order feed indicator in the toolbar, same table-oriented
// content region, NO order sidebar (admin, not consumer). What changes is the
// VISUAL LANGUAGE — a soft, minimal elevation matched to the reference:
//
//   • Elevation — one gentle step per level: a dark ambient frame → a large-radius
//     light shell → a white content panel (hairline) → white cards / table
//     container (hairline). A single soft shadow rides the floating panels only;
//     no heavy rings.
//   • Floating toolbar — the admin top nav is a large-radius rounded bar that
//     FLOATS inside the shell with margin all around (never edge-to-edge),
//     white. Brand left; admin nav centre; live new-order feed + account right.
//     The ACTIVE nav item is a solid black pill with white text + a leading icon
//     (theme §5); idle items stay quiet and darken on hover. This surface owns
//     the canonical admin toolbar. On mobile it stays a condensed floating bar.
//   • Scrolling — the shell fills the viewport; the table content zone scrolls
//     independently while the toolbar stays pinned; no double page scrollbars.
//   • Color roles — crimson reserved for prices/totals + urgency (the live feed);
//     one loudest red per screen. Active nav is black, not red. Status is shown
//     in words + a consistent colour, never colour alone.
//
// Mock-only fixtures; no api / model / store / i18n / layout-source imports.
// The shell chrome is re-composed inline from @/components/* (mirroring the
// Sprint-8 AdminLiveOrderFeed story convention) so the story is self-contained.
// The admin PAGE body is a labelled, table-oriented placeholder content region —
// pages are not part of this restyle.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Nav model — mirrors src/layouts/admin/components/admin-toolbar-desktop.tsx
// ---------------------------------------------------------------------------

interface AdminNavItem {
    key: string;
    label: string;
    icon: LucideIcon;
}

const NAV_ITEMS: AdminNavItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'orders', label: 'Orders', icon: Package },
    { key: 'refunds', label: 'Refunds', icon: Receipt },
    { key: 'foods', label: 'Foods', icon: UtensilsCrossed },
    { key: 'categories', label: 'Categories', icon: Tags },
    { key: 'users', label: 'Users', icon: Users },
];

// Mobile bottom bar mirrors the source's condensed shortcut set.
const MOBILE_NAV_ITEMS: AdminNavItem[] = NAV_ITEMS.slice(0, 4);

// ---------------------------------------------------------------------------
// Live new-order feed pill — the portal-wide element from story #274, kept in
// the restyled top-bar so it stays visible on every admin route. Restyled to
// the theme's fully-rounded, hairline chip language (idle = muted hairline,
// live = success, disconnected = destructive).
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
// Shell — the layered elevation base per DESIGN_THEME.md:
//   dark charcoal ambient frame (subtle low-contrast line-art motif, decorative,
//   never interactive, behind everything) → large-radius light-gray shell (soft
//   shadow) → white content panel → white table container. Content lives on the
//   raised light shell, never on the raw dark frame. The light shell fills the
//   frame and lays out a pinned toolbar above an independently scrolling content
//   zone (theme: Layout Patterns / Spacing & Density / Iconography & Imagery).
// ---------------------------------------------------------------------------

// One soft shadow, reserved for floating panels only (theme §4). No heavy rings.
const SOFT_SHADOW = 'shadow-[0_4px_20px_rgba(0,0,0,0.05)]';

function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className='relative h-screen w-full overflow-hidden bg-frame p-2 sm:p-3'>
            {/* Decorative line-art motif — dot grid, very low contrast, never interactive */}
            <div
                aria-hidden
                className='pointer-events-none absolute inset-0 opacity-[0.05]'
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.9) 1px, transparent 0)',
                    backgroundSize: '26px 26px',
                }}
            />

            {/* Light shell — large radius; raised over the dark ambient frame, holds a
                pinned toolbar over an independently scrolling content zone. */}
            <div
                className={[
                    'relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[2rem] bg-muted',
                    SOFT_SHADOW,
                ].join(' ')}
            >
                {children}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Nav item — icon + label pill on the floating toolbar (theme §5 Navigation
// Tabs). Active = solid black pill, white text, leading icon; idle = quiet
// control that darkens on hover. Crimson stays reserved for prices + urgency.
// ---------------------------------------------------------------------------

function NavItem({ item, active, onSelect }: { item: AdminNavItem; active: boolean; onSelect?: () => void }) {
    const Icon = item.icon;
    return (
        <button
            type='button'
            aria-current={active ? 'page' : undefined}
            onClick={onSelect}
            className={[
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                active
                    ? 'bg-background text-primary shadow-sm ring-1 ring-black/5'
                    : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
            ].join(' ')}
        >
            <Icon className='h-4 w-4' aria-hidden />
            {item.label}
        </button>
    );
}

// ---------------------------------------------------------------------------
// Desktop toolbar — a large-radius rounded bar floating inside the shell with
// margin all around (never edge-to-edge). Brand + Admin badge (left), icon+label
// nav (centre), live-feed indicator + circular controls (right). Stays pinned
// above the scrolling content zone. This is the canonical admin toolbar.
// ---------------------------------------------------------------------------

function DesktopTopBar({
    activePage,
    onNavigate,
    feedStatus,
    onReconnect,
}: {
    activePage: string;
    onNavigate?: (key: string) => void;
    feedStatus: FeedStatus;
    onReconnect?: () => void;
}) {
    return (
        <header
            className={[
                'z-30 m-3 mb-1.5 hidden h-16 shrink-0 items-center rounded-[1.5rem] border border-border/60 bg-background px-4 lg:flex',
                SOFT_SHADOW,
            ].join(' ')}
        >
            {/* Left — brand */}
            <div className='flex flex-1 items-center gap-2 pl-1'>
                <span className='text-lg font-semibold tracking-tight text-primary'>Notism</span>
                <Badge variant='secondary' className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'>
                    Admin
                </Badge>
            </div>

            {/* Centre — nav (idle quiet; active = solid black pill + white text) */}
            <nav className='flex items-center gap-1 rounded-full bg-muted/60 p-1'>
                {NAV_ITEMS.map(item => (
                    <NavItem
                        key={item.key}
                        item={item}
                        active={item.key === activePage}
                        onSelect={() => onNavigate?.(item.key)}
                    />
                ))}
            </nav>

            {/* Right — live feed + controls */}
            <div className='flex flex-1 items-center justify-end gap-3'>
                <LiveFeedPill status={feedStatus} onReconnect={onReconnect} />
                <button
                    aria-label='Toggle theme'
                    className='flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'
                >
                    <Moon className='h-4 w-4' />
                </button>
                <div className='flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background'>
                    TM
                </div>
            </div>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Mobile chrome — a condensed floating rounded toolbar (brand + live-feed
// indicator, kept visible on every route) pinned at top, and a floating rounded
// bottom bar of icon+label nav shortcuts + avatar. Both float with margin, never
// full-bleed. Active shortcut takes the crimson accent.
// ---------------------------------------------------------------------------

function MobileTopStrip({ feedStatus }: { feedStatus: FeedStatus }) {
    return (
        <header
            className={[
                'z-30 m-2 mb-1 flex h-14 shrink-0 items-center justify-between rounded-[1.25rem] border border-border/60 bg-background px-4 lg:hidden',
                SOFT_SHADOW,
            ].join(' ')}
        >
            <div className='flex items-center gap-2'>
                <span className='text-base font-semibold tracking-tight text-primary'>Notism</span>
                <Badge variant='secondary' className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'>
                    Admin
                </Badge>
            </div>
            <LiveFeedPill status={feedStatus} />
        </header>
    );
}

function MobileBottomBar({ activePage, onNavigate }: { activePage: string; onNavigate?: (key: string) => void }) {
    return (
        <div
            className={[
                'z-30 m-2 mt-1 flex h-16 shrink-0 items-center justify-around rounded-[1.25rem] border border-border/60 bg-background px-2 lg:hidden',
                SOFT_SHADOW,
            ].join(' ')}
        >
            {MOBILE_NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const active = item.key === activePage;
                return (
                    <button
                        key={item.key}
                        type='button'
                        aria-current={active ? 'page' : undefined}
                        onClick={() => onNavigate?.(item.key)}
                        className={[
                            'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-2xl px-2 transition-colors',
                            active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                        ].join(' ')}
                    >
                        <span
                            className={[
                                'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                                active ? 'bg-background text-primary shadow-sm ring-1 ring-black/5' : '',
                            ].join(' ')}
                        >
                            <Icon className='h-5 w-5' aria-hidden />
                        </span>
                        <span className='text-[10px] font-medium'>{item.label}</span>
                    </button>
                );
            })}
            <div className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-2'>
                <span className='flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background'>
                    TM
                </span>
                <span className='text-[10px] font-medium text-muted-foreground'>You</span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Content region — table-oriented working zone (Admin orders pattern: status
// column present, sortable by state + time). NO order sidebar. This stands in
// for the admin page bodies that the shell wraps; it is the placeholder content
// region asked for by the requirement, rendered table-shaped so the shell reads
// as a real admin working surface. Prices/total are crimson per theme.
// ---------------------------------------------------------------------------

interface AdminOrderRow {
    number: string;
    customer: string;
    placedAt: string;
    items: number;
    total: string;
    state: 'pending' | 'preparing' | 'out-for-delivery' | 'delivered';
}

const ORDER_ROWS: AdminOrderRow[] = [
    {
        number: 'ORD-20260704-1042',
        customer: 'Mai Tran',
        placedAt: '04 Jul 2026, 12:04',
        items: 3,
        total: '285,000 ₫',
        state: 'pending',
    },
    {
        number: 'ORD-20260704-1041',
        customer: 'Long Pham',
        placedAt: '04 Jul 2026, 12:01',
        items: 1,
        total: '95,000 ₫',
        state: 'preparing',
    },
    {
        number: 'ORD-20260704-1039',
        customer: 'Ha Nguyen',
        placedAt: '04 Jul 2026, 11:54',
        items: 5,
        total: '612,000 ₫',
        state: 'out-for-delivery',
    },
    {
        number: 'ORD-20260704-1036',
        customer: 'Tuan Vo',
        placedAt: '04 Jul 2026, 11:47',
        items: 2,
        total: '168,000 ₫',
        state: 'delivered',
    },
    {
        number: 'ORD-20260704-1033',
        customer: 'Linh Dao',
        placedAt: '04 Jul 2026, 11:32',
        items: 4,
        total: '431,000 ₫',
        state: 'delivered',
    },
];

// Status = word + one consistent colour (theme §8), drawn only from the palette's
// semantic tokens (warning / info / success / ink). Crimson is never a status.
const STATE_META: Record<AdminOrderRow['state'], { label: string; dot: string; text: string }> = {
    pending: { label: 'Pending', dot: 'bg-warning', text: 'text-warning' },
    preparing: { label: 'Preparing', dot: 'bg-info', text: 'text-info' },
    'out-for-delivery': { label: 'Out for delivery', dot: 'bg-foreground', text: 'text-foreground' },
    delivered: { label: 'Delivered', dot: 'bg-success', text: 'text-success' },
};

function OrderStateBadge({ state }: { state: AdminOrderRow['state'] }) {
    const meta = STATE_META[state];
    return (
        <span className='inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium'>
            <span className={['h-2 w-2 rounded-full', meta.dot].join(' ')} aria-hidden />
            <span className={meta.text}>{meta.label}</span>
        </span>
    );
}

function SortHead({ children }: { children: React.ReactNode }) {
    return (
        <TableHead>
            <span className='inline-flex items-center gap-1 text-muted-foreground'>
                {children}
                <ArrowUpDown className='h-3.5 w-3.5 opacity-50' aria-hidden />
            </span>
        </TableHead>
    );
}

function OrdersContentRegion({ rows = ORDER_ROWS }: { rows?: AdminOrderRow[] }) {
    return (
        <>
            {/* Page header */}
            <div className='mb-6 flex items-end justify-between gap-4'>
                <div>
                    <p className='text-[11px] font-medium uppercase tracking-widest text-muted-foreground'>
                        Admin content region
                    </p>
                    <h1 className='mt-1 text-2xl font-bold tracking-tight text-foreground'>Orders</h1>
                    <p className='mt-0.5 text-sm text-muted-foreground'>
                        Table-oriented working layout — sortable by state and time. No order sidebar.
                    </p>
                </div>
                <div className='hidden items-center gap-2 sm:flex'>
                    <span className='rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground'>
                        {rows.length} orders today
                    </span>
                </div>
            </div>

            {/* Orders table — white container, hairline, little/no shadow (level 3) */}
            <div className='rounded-2xl border bg-card p-1.5'>
                {rows.length === 0 ? (
                    <div className='flex h-[280px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/20 text-center'>
                        <Package className='h-6 w-6 text-muted-foreground/50' aria-hidden />
                        <p className='text-sm font-medium text-foreground'>No orders yet today</p>
                        <p className='max-w-xs text-xs text-muted-foreground'>
                            New orders arrive live in the top-bar feed — they will list here as they come in.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className='hover:bg-transparent'>
                                <SortHead>Order</SortHead>
                                <TableHead className='text-muted-foreground'>Customer</TableHead>
                                <SortHead>Placed</SortHead>
                                <TableHead className='text-right text-muted-foreground'>Items</TableHead>
                                <TableHead className='text-right text-muted-foreground'>Total</TableHead>
                                <SortHead>Status</SortHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map(row => (
                                <TableRow key={row.number}>
                                    <TableCell className='font-mono text-sm font-semibold tracking-tight text-foreground'>
                                        {row.number}
                                    </TableCell>
                                    <TableCell className='text-foreground'>{row.customer}</TableCell>
                                    <TableCell className='text-muted-foreground'>{row.placedAt}</TableCell>
                                    <TableCell className='text-right text-muted-foreground'>{row.items}</TableCell>
                                    {/* Price emphasis — crimson per theme */}
                                    <TableCell className='text-right font-semibold text-primary'>{row.total}</TableCell>
                                    <TableCell>
                                        <OrderStateBadge state={row.state} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
}

// ---------------------------------------------------------------------------
// The shell — a large-radius light-gray shell fills the viewport and pins the
// floating toolbar above an independently scrolling content zone; the white
// content panel holds the table. Desktop and mobile chrome are both composed
// here so the responsive behaviour is real (Storybook viewport drives the
// breakpoint). No page-level scrollbar — only the content zone scrolls.
// ---------------------------------------------------------------------------

function AdminAppShell({
    activePage = 'orders',
    feedStatus = 'live',
    onReconnect,
    rows,
}: {
    activePage?: string;
    feedStatus?: FeedStatus;
    onReconnect?: () => void;
    rows?: AdminOrderRow[];
}) {
    const [page, setPage] = React.useState(activePage);

    return (
        <Shell>
            {/* Pinned toolbars — outside the scroll zone */}
            <DesktopTopBar activePage={page} onNavigate={setPage} feedStatus={feedStatus} onReconnect={onReconnect} />
            <MobileTopStrip feedStatus={feedStatus} />

            {/* Independently scrolling content zone */}
            <main className='min-h-0 flex-1 overflow-y-auto px-3 pb-3 sm:px-4 lg:pt-1.5'>
                {/* White content panel — hairline only, no shadow (level 3) */}
                <div className='rounded-[1.5rem] border border-border/60 bg-background p-4 sm:p-6'>
                    <OrdersContentRegion rows={rows} />
                </div>
            </main>

            <MobileBottomBar activePage={page} onNavigate={setPage} />
        </Shell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Admin App Shell',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — the restyled admin shell on desktop: a dark ambient frame (decorative
 * line-art motif) sits behind a light shell that holds a white floating rounded
 * toolbar pinned above an independently scrolling white content panel. The toolbar
 * nav pairs an icon with a label per item; the active item (Orders) is a solid
 * black pill with white text. The live new-order feed indicator rides the toolbar,
 * and the content region is table-oriented with a status column — no order sidebar.
 */
export const Default: Story = {
    name: 'Default — Desktop Admin Shell (Orders active)',
    render: () => <AdminAppShell activePage='orders' feedStatus='live' />,
};

/**
 * Live feed present — the same shell with the Dashboard nav item active,
 * underlining that the live new-order feed pill rides the shell across every
 * admin route while the black active pill moves to whichever nav item is active.
 */
export const LiveFeedPresent: Story = {
    name: 'Default — Live Feed Present (Dashboard active)',
    render: () => <AdminAppShell activePage='dashboard' feedStatus='live' />,
};

/**
 * Loading — the shell has mounted and is establishing the live-orders
 * subscription; the top-bar feed pill shows "Connecting…". The rest of the shell
 * (nav + table content region) is fully usable.
 */
export const Loading: Story = {
    name: 'Loading — Connecting To Live Orders',
    render: () => <AdminAppShell activePage='orders' feedStatus='connecting' />,
};

/**
 * Error — the live-orders connection dropped; the feed pill turns destructive
 * with a Reconnect action. The failure is confined to the pill — the admin shell
 * and its table content region stay on-theme and operable.
 */
export const Error: Story = {
    name: 'Error — Live Feed Disconnected',
    render: () => <AdminAppShell activePage='orders' feedStatus='disconnected' onReconnect={() => undefined} />,
};

/**
 * Empty — the shell is open and listening, but no orders have come in yet, so the
 * table content region shows its empty state. The live feed pill stays on,
 * waiting.
 */
export const Empty: Story = {
    name: 'Empty — No Orders Yet',
    render: () => <AdminAppShell activePage='orders' feedStatus='live' rows={[]} />,
};

/**
 * Mobile — the shell condenses to a sticky top strip (brand + live-feed pill,
 * kept visible) and a fixed bottom nav of icon+label shortcuts with a solid black
 * badge on the active item. The table content region remains the working layout;
 * still no order sidebar.
 */
export const Mobile: Story = {
    name: 'Mobile — Condensed Admin Shell',
    parameters: {
        viewport: { defaultViewport: 'mobile1' },
    },
    render: () => <AdminAppShell activePage='orders' feedStatus='live' />,
};
