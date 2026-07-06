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

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import Spinner from '@/components/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';

// ---------------------------------------------------------------------------
// Surface — AdminAppShell (Sprint 11), route: wraps all /admin routes.
//
// The admin chrome is unified on the shared, domain-blind NavBar
// (variant="admin"): a bordered ink-active bar carrying the brand, the admin
// nav, and the portal-wide live new-order feed + account controls. Navigation
// selection is a real navigation selection — NavBarItem's aria-current, an ink
// pill for the current route — never a Button in a selected style. No filter or
// segmented control lives in this shell, so the audit for selected-state
// Buttons resolves to nav selection alone.
//
// Elevation (derived from the codebase's shell language, mirrored from the
// consumer shell): a dark charcoal ambient frame (decorative line-art, never
// interactive) sits behind ONE large-radius light-gray shell; the shell pins
// the NavBar above an independently scrolling white content panel that holds a
// table-oriented working zone. NO order sidebar — this is admin, not consumer.
//
// Color roles: crimson reserved for prices/totals + urgency (the live feed);
// active nav is ink (bg-selected), not red; status is shown in words + a
// consistent colour, never colour alone.
//
// Mock-only fixtures; no api / model / store / i18n / layout-source imports.
// The admin PAGE body is a table-oriented placeholder content region — pages
// are not part of this restyle.
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
// Live new-order feed pill — the portal-wide element kept in the top-bar so it
// stays visible on every admin route. Fully-rounded, hairline chip language
// (idle = muted hairline, live = success, disconnected = destructive).
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
// Shell — the layered elevation base: a dark charcoal ambient frame (subtle
// low-contrast dot-grid motif, decorative, never interactive, behind
// everything) → a large-radius light-gray shell (one soft shadow) → a white
// content panel (hairline). The light shell fills the frame and lays out the
// pinned NavBar above an independently scrolling content zone. Content lives on
// the raised light shell, never on the raw dark frame.
// ---------------------------------------------------------------------------

// One soft shadow, reserved for the floating shell only. No heavy rings.
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
                pinned NavBar over an independently scrolling content zone. The rounded
                overflow clips the flat NavBar's top corners to the shell radius. */}
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
// Desktop toolbar — the shared, domain-blind NavBar (admin variant): a flat
// bordered bar pinned at the top of the shell. Brand + Admin badge (left, via
// NavBarBrand) · admin nav (centre, via NavBarNav/NavBarItem — the active route
// is a real navigation selection expressed by aria-current, rendered as the ink
// active pill the admin variant provides, never a Button in a selected style) ·
// live-feed indicator + account controls (right, via NavBarActions). Stays
// pinned above the scrolling content zone.
// ---------------------------------------------------------------------------

function AdminTopBar({
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
        <NavBar variant='admin' className='z-30 hidden h-16 shrink-0 px-4 lg:flex'>
            {/* Left — brand */}
            <NavBarBrand className='pl-1'>
                <span className='text-lg font-semibold tracking-tight text-primary'>Notism</span>
                <Badge variant='secondary' className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'>
                    Admin
                </Badge>
            </NavBarBrand>

            {/* Centre — admin nav (idle quiet; active route = ink pill via aria-current) */}
            <NavBarNav className='flex-1 justify-center'>
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavBarItem
                            key={item.key}
                            active={item.key === activePage}
                            onClick={() => onNavigate?.(item.key)}
                        >
                            <Icon className='size-4' aria-hidden />
                            {item.label}
                        </NavBarItem>
                    );
                })}
            </NavBarNav>

            {/* Right — live feed + controls */}
            <NavBarActions className='gap-3'>
                <LiveFeedPill status={feedStatus} onReconnect={onReconnect} />
                <Button variant='ghost' size='icon-sm' aria-label='Toggle theme'>
                    <Moon />
                </Button>
                <Avatar className='size-9'>
                    <AvatarFallback className='bg-selected text-xs font-semibold text-selected-foreground'>
                        TM
                    </AvatarFallback>
                </Avatar>
            </NavBarActions>
        </NavBar>
    );
}

// ---------------------------------------------------------------------------
// Mobile chrome — a condensed top strip (brand + live-feed indicator, kept
// visible on every route) pinned at top, and a bottom bar of icon+label nav
// shortcuts + avatar. Both flat within the shell. The active shortcut is a real
// navigation selection (aria-current) with the ink accent.
// ---------------------------------------------------------------------------

function MobileTopStrip({ feedStatus }: { feedStatus: FeedStatus }) {
    return (
        <header className='z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 lg:hidden'>
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
        <div className='z-30 flex h-16 shrink-0 items-center justify-around border-t border-border bg-card px-2 lg:hidden'>
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
                                active ? 'bg-selected text-selected-foreground' : '',
                            ].join(' ')}
                        >
                            <Icon className='h-5 w-5' aria-hidden />
                        </span>
                        <span className='text-[10px] font-medium'>{item.label}</span>
                    </button>
                );
            })}
            <div className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-2'>
                <span className='flex h-8 w-8 items-center justify-center rounded-full bg-selected text-[10px] font-semibold text-selected-foreground'>
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
// region rendered table-shaped so the shell reads as a real admin working
// surface. Prices/total are crimson per the shell's colour roles.
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

// Status = word + one consistent colour, drawn only from the palette's semantic
// tokens (warning / info / success / ink). Crimson is never a status.
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

            {/* Orders table — white container, hairline, little/no shadow */}
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
                                    {/* Price emphasis — crimson */}
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
// NavBar (desktop) / condensed strips (mobile) above an independently scrolling
// content zone; the white content panel holds the table. Desktop and mobile
// chrome are both composed here so the responsive behaviour is real (Storybook
// viewport drives the breakpoint). No page-level scrollbar — only the content
// zone scrolls.
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
            {/* Pinned chrome — outside the scroll zone */}
            <AdminTopBar activePage={page} onNavigate={setPage} feedStatus={feedStatus} onReconnect={onReconnect} />
            <MobileTopStrip feedStatus={feedStatus} />

            {/* Independently scrolling content zone */}
            <main className='min-h-0 flex-1 overflow-y-auto p-3 sm:p-4'>
                {/* White content panel — hairline only, no shadow */}
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
 * Default — the admin shell on desktop: a dark ambient frame (decorative
 * line-art) sits behind a light shell that pins the shared NavBar (admin
 * variant) above an independently scrolling white content panel. The nav pairs
 * an icon with a label per item; the active route (Orders) is the ink active
 * pill expressed via aria-current — a real navigation selection, not a Button.
 * The live new-order feed indicator rides the NavBar, and the content region is
 * table-oriented with a status column — no order sidebar.
 */
export const Default: Story = {
    name: 'Default — Desktop Admin Shell (Orders active)',
    render: () => <AdminAppShell activePage='orders' feedStatus='live' />,
};

/**
 * Live feed present — the same shell with the Dashboard nav item active,
 * underlining that the live new-order feed pill rides the NavBar across every
 * admin route while the ink active pill moves to whichever nav item is current.
 */
export const LiveFeedPresent: Story = {
    name: 'Default — Live Feed Present (Dashboard active)',
    render: () => <AdminAppShell activePage='dashboard' feedStatus='live' />,
};

/**
 * Loading — the shell has mounted and is establishing the live-orders
 * subscription; the NavBar feed pill shows "Connecting…". The rest of the shell
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
 * Mobile — the shell condenses to a top strip (brand + live-feed pill, kept
 * visible) and a bottom nav of icon+label shortcuts with an ink badge on the
 * active item (aria-current). The table content region remains the working
 * layout; still no order sidebar.
 */
export const Mobile: Story = {
    name: 'Mobile — Condensed Admin Shell',
    parameters: {
        viewport: { defaultViewport: 'mobile1' },
    },
    render: () => <AdminAppShell activePage='orders' feedStatus='live' />,
};
