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
// ONE responsive shell. The primary nav toolbar rides the TOP on desktop (lg+)
// as the shared, domain-blind NavBar — a rounded bar carrying the brand, the
// admin nav, and the portal-wide live new-order feed + account controls — and
// relocates to the BOTTOM of the viewport on mobile (below lg) as the bottom
// nav bar. On mobile the only top chrome that remains is a condensed strip
// carrying non-nav context (brand + live-feed) — the nav itself lives at the
// bottom, within thumb reach. There is no separate "mobile" story: every story
// renders this single responsive shell and reads correctly at both breakpoints
// (the Storybook viewport drives which chrome is shown).
//
// Navigation selection is a real navigation selection — NavBarItem's
// aria-current / the bottom bar's aria-current, the active-route pill for the
// current route — never a Button in a selected style. No filter or segmented
// control lives in this shell, so the audit for selected-state Buttons resolves
// to nav selection alone.
//
// Elevation (the Sprint-11 restyle): NO dark ambient frame, NO enclosing
// floating light-gray shell. The layout is FULL-BLEED / edge-to-edge — content
// fills the entire layout on the app's neutral canvas, never floating inside a
// card or frame. On desktop the top toolbar (NavBar) is the ONE floating
// element: a detached, rounded bar inset from the layout edges, carrying its own
// radius + a single soft shadow, riding above the full-bleed content. Mobile
// chrome speaks the same language — the condensed top strip (non-nav context)
// and the bottom NAV bar are floating rounded bars (inset, own radius + soft
// shadow) over the full-bleed layout, not flat edge-pinned strips. The content
// is a table-oriented working zone that scrolls independently between the pinned
// chrome; on mobile it reserves space for the bottom nav bar so the two never
// overlap. NO order sidebar — this is admin, not consumer.
//
// Color roles: crimson reserved for prices/totals + urgency (the live feed) and
// the active toolbar nav highlight (the one "you are here" mark per bar, via the
// NavBar's aria-current pill); status is shown in words + a consistent semantic
// colour, never colour alone.
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
// Layout base — FULL-BLEED. No dark ambient frame, no enclosing floating shell.
// A single edge-to-edge column on the app's neutral canvas (bg-muted): pinned
// floating chrome at top (and, on mobile, at the bottom) over an independently
// scrolling content zone. The floating chrome is the only raised element; the
// content flows directly on the canvas, never inside a rounded shell.
// ---------------------------------------------------------------------------

// One soft shadow — the only elevation in the shell, reserved for the floating
// rounded chrome (toolbar / mobile strips). No heavy rings.
const SOFT_SHADOW = 'shadow-[0_4px_20px_rgba(0,0,0,0.05)]';

function AppCanvas({ children }: { children: React.ReactNode }) {
    return <div className='flex h-screen w-full flex-col overflow-hidden bg-muted'>{children}</div>;
}

// ---------------------------------------------------------------------------
// Desktop toolbar — the shared, domain-blind NavBar: a FLOATING, rounded bar,
// detached and inset from the layout edges (a margin around it), carrying its
// own radius + one soft shadow, riding above the full-bleed content. It is the
// only floating rounded element in the desktop shell. Brand + Admin badge (left,
// via NavBarBrand) · admin nav (centre, via NavBarNav/NavBarItem — the active
// route is a real navigation selection expressed by aria-current, rendered as
// the NavBar's active pill with the crimson accent, never a Button in a selected
// style) · live-feed indicator + account controls (right, via NavBarActions).
// The inset margin comes from the wrapping layout row; the NavBar keeps its own
// pill radius. Stays pinned above the scrolling content zone.
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
        <NavBar className={['z-30 hidden h-16 shrink-0 px-4 lg:flex', SOFT_SHADOW].join(' ')}>
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
// Mobile chrome — floating rounded bars speaking the same language as the
// desktop toolbar. The primary nav relocates HERE on mobile: the bottom bar of
// icon+label nav shortcuts + avatar IS the mobile toolbar, pinned within thumb
// reach at the base of the viewport (the desktop NavBar is hidden below lg). The
// top strip that remains carries only non-nav context — brand + live-feed
// indicator, kept visible on every route — never the nav itself. Both are
// detached, inset from the layout edges, with their own radius + one soft shadow
// (no flat edge-pinned strips) — riding over the full-bleed content. The active
// shortcut is a real navigation selection (aria-current) with the ink accent.
// The inset margin comes from the wrapping layout rows.
// ---------------------------------------------------------------------------

function MobileTopStrip({ feedStatus }: { feedStatus: FeedStatus }) {
    return (
        <header
            className={[
                'z-30 flex h-14 shrink-0 items-center justify-between rounded-full border border-border bg-card px-4 lg:hidden',
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
                'z-30 flex h-16 shrink-0 items-center justify-around rounded-full border border-border bg-card px-2 lg:hidden',
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
// region rendered table-shaped so the full-bleed layout reads as a real admin
// working surface. Prices/total are crimson per the shell's colour roles.
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
// The shell — ONE responsive full-bleed column on the app's neutral canvas.
// Top chrome is pinned at the top, inset from the edges via its wrapping row: on
// desktop the primary NavBar toolbar, on mobile only the condensed non-nav top
// strip. On mobile the primary nav toolbar is pinned at the BASE instead — the
// floating bottom nav bar. Between them, an edge-to-edge content zone scrolls
// independently — the table content flows directly on the canvas, not inside a
// rounded shell or white panel. Because the bottom nav bar is a flex sibling of
// the scroll zone (not an overlay), the content column reserves its own space
// and the bottom bar never overlaps it on mobile. Desktop and mobile chrome are
// both composed here so the responsive behaviour is real (the Storybook viewport
// drives the breakpoint) — every story renders this single shell. No page-level
// scrollbar — only the content zone scrolls.
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
        <AppCanvas>
            {/* Pinned floating chrome — inset from the layout edges, outside the scroll zone */}
            <div className='hidden shrink-0 px-4 pt-4 lg:block lg:px-6 lg:pt-6'>
                <AdminTopBar activePage={page} onNavigate={setPage} feedStatus={feedStatus} onReconnect={onReconnect} />
            </div>
            <div className='shrink-0 px-3 pt-3 lg:hidden'>
                <MobileTopStrip feedStatus={feedStatus} />
            </div>

            {/* Independently scrolling, edge-to-edge content zone — no enclosing shell */}
            <main className='min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6'>
                <OrdersContentRegion rows={rows} />
            </main>

            <div className='shrink-0 px-3 pb-3 lg:hidden'>
                <MobileBottomBar activePage={page} onNavigate={setPage} />
            </div>
        </AppCanvas>
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
 * Default — the single responsive admin shell: a full-bleed, edge-to-edge layout
 * on the app's neutral canvas — no dark ambient frame, no enclosing floating
 * shell. On desktop (lg+) the shared NavBar floats as a detached rounded toolbar
 * pinned at the TOP; below lg the primary nav relocates to the floating BOTTOM
 * bar (with only a condensed brand + live-feed strip left at the top). Resize the
 * Storybook viewport to see the toolbar move top ↔ bottom. Either way the nav
 * pairs an icon with a label per item; the active route (Orders) takes the
 * crimson accent as the active pill expressed via aria-current — a real
 * navigation selection, not a Button. The live new-order feed indicator rides the
 * top chrome, and the content region is table-oriented with a status column — no
 * order sidebar.
 */
export const Default: Story = {
    name: 'Default — Admin Shell (Orders active)',
    render: () => <AdminAppShell activePage='orders' feedStatus='live' />,
};

/**
 * Live feed present — the same full-bleed shell with the Dashboard nav item
 * active, underlining that the live new-order feed pill rides the floating
 * toolbar across every admin route while the crimson active pill moves to
 * whichever nav item is current.
 */
export const LiveFeedPresent: Story = {
    name: 'Default — Live Feed Present (Dashboard active)',
    render: () => <AdminAppShell activePage='dashboard' feedStatus='live' />,
};

/**
 * Loading — the shell has mounted and is establishing the live-orders
 * subscription; the toolbar feed pill shows "Connecting…". The rest of the shell
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
