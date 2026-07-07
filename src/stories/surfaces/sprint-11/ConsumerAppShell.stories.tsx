import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Globe,
    Home,
    Minus,
    Moon,
    Plus,
    Search,
    ShoppingBag,
    ShoppingCart,
    Ticket,
    Trash2,
    UtensilsCrossed,
    X,
} from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { Button } from '@/components/button';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { ScrollArea } from '@/components/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/sheet';

// ---------------------------------------------------------------------------
// Implementation reference — Sprint 11 (consumer app shell restyle).
//
// Restyles the EXISTING consumer layout (src/layouts/client: topbar + content
// zone) to DESIGN_THEME.md. Business functionality is UNCHANGED — same nav
// (Home, Orders), same brand, same controls (search, language, theme, account),
// same cart/order contents. Only the visual + UX treatment changes:
//
//   • dark ambient FRAME (charcoal + decorative line-art motif, no controls)
//     sits behind ONE large rounded light-gray SHELL that floats over it;
//   • a FLOATING rounded toolbar sits inside the shell with margin on all sides
//     (brand left · nav-tab pill row center where the active item is a BLACK pill
//     with a white icon+label · actions right: search + a black Cart pill);
//   • two-tone hierarchy: BLACK carries every structural/contextual action (nav
//     tabs, quantity steppers, Cart pill); CRIMSON is reserved for prices and the
//     SINGLE final commit — the order sidebar's Confirm CTA is the only loud red;
//   • the shell holds the toolbar + content zone + a persistent ORDER SIDEBAR;
//     the content zone and the order sidebar each scroll INDEPENDENTLY while the
//     toolbar stays pinned — the shell fills the viewport, no page scroll;
//   • the order sidebar is a Summary Panel: title + count → line items → dashed
//     divider → promo row → discount/delivery breakdown → bold crimson total →
//     one crimson Confirm CTA pinned at the bottom;
//   • on mobile the toolbar stays a rounded floating bar (condensed: brand +
//     black order button) and the sidebar collapses into a drawer;
//   • empty order → the sidebar shows an empty state with one CTA (no dead end).
//
// Elevation is soft + minimal: ambient dark frame → one large-radius light-gray
// shell (soft low-spread shadow) → white content & sidebar panels (large radius,
// hairline, faint shadow) → white cards (hairline, little/no shadow). Exactly
// one gentle elevation step per level — no heavy rings or hard drop-shadows.
//
// Page BODIES are unchanged by this sprint → the content zone is a labelled,
// muted placeholder; only the shell chrome (frame + toolbar + order sidebar /
// drawer) is fully implemented here.
//
// Mock-only fixtures + local state. No api / model / store / SignalR imports.
// ---------------------------------------------------------------------------

// Soft low-spread shadow for the single floating shell (one gentle step off the
// dark frame). Panels/toolbar use shadow-sm; cards use hairline borders only.
const SHELL_SHADOW = 'shadow-[0_20px_60px_-26px_rgba(0,0,0,0.45)]';

// Mock order-level discount, mirrored in the Summary Panel breakdown (theme:
// negative values render crimson + prefixed, delivery "Free" renders green).
const DISCOUNT_RATE = 0.1;

// ---------------------------------------------------------------------------
// Domain shapes (mock only — mirrors the cart line shape, not real models)
// ---------------------------------------------------------------------------

interface OrderLine {
    id: string;
    name: string;
    /** Unit price in đồng. */
    unitPrice: number;
    quantity: number;
    /** Short note shown under the name (size / build). */
    note?: string;
}

const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`;

// ---------------------------------------------------------------------------
// Fixtures — order lines mirror the app's cart contents.
// ---------------------------------------------------------------------------

const ORDER_LINES: OrderLine[] = [
    { id: 'line-1', name: 'Margherita pizza', unitPrice: 145_000, quantity: 1, note: 'Large' },
    { id: 'line-2', name: 'Truffle fries', unitPrice: 85_000, quantity: 2, note: 'With aioli' },
    { id: 'line-3', name: 'Iced oat latte', unitPrice: 45_000, quantity: 1 },
    { id: 'line-4', name: 'Grilled chicken bowl', unitPrice: 120_000, quantity: 1, note: 'Extra sauce' },
    { id: 'line-5', name: 'Mango sticky rice', unitPrice: 60_000, quantity: 2 },
];

const orderSubtotal = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
const orderCount = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + l.quantity, 0);

// ---------------------------------------------------------------------------
// Consumer nav model — preserved from the existing client toolbar
// (Home, Orders). The active item takes the crimson accent (theme).
// ---------------------------------------------------------------------------

interface NavItem {
    key: string;
    label: string;
    icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'orders', label: 'Orders', icon: ShoppingBag },
];

// ---------------------------------------------------------------------------
// Ambient frame — the dark charcoal backdrop with a low-contrast, purely
// decorative line-art motif. Never carries controls or content; always sits
// BEHIND the light shell. Fixed to the viewport height so the shell can fill it
// and its inner zones scroll independently (no page scroll).
// ---------------------------------------------------------------------------

function AmbientLineArt() {
    return (
        <svg
            aria-hidden
            className='pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]'
            preserveAspectRatio='xMidYMid slice'
        >
            <defs>
                <pattern id='consumer-shell-motif' width='180' height='180' patternUnits='userSpaceOnUse'>
                    <circle cx='40' cy='40' r='26' fill='none' stroke='currentColor' strokeWidth='1.5' />
                    <path d='M40 14v52M14 40h52' stroke='currentColor' strokeWidth='1.5' />
                    <path
                        d='M120 120c22 0 34-14 34-32M120 120c-20 0-34-12-34-30M120 120v34'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                    />
                </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#consumer-shell-motif)' />
        </svg>
    );
}

function AmbientFrame({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div
            className={['relative flex h-screen w-full overflow-hidden bg-frame p-3 sm:p-4 lg:p-6', className]
                .filter(Boolean)
                .join(' ')}
        >
            <AmbientLineArt />
            <div className='relative z-10 flex min-h-0 w-full flex-1 items-stretch'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Order-line row — a white CARD (hairline border, no shadow): circular
// thumbnail, name + note, crimson line price, black (selection) stepper.
// Item-level controls are black; destructive Remove sits apart from the primary
// order action (theme: action hierarchy).
// ---------------------------------------------------------------------------

function OrderLineRow({ line }: { line: OrderLine }) {
    return (
        <div className='flex items-start gap-3 rounded-2xl border border-border bg-card p-3'>
            <span className='flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                <UtensilsCrossed className='size-5' aria-hidden />
            </span>
            <div className='min-w-0 flex-1'>
                <div className='flex items-start justify-between gap-2'>
                    <p className='truncate text-sm font-semibold text-foreground'>{line.name}</p>
                    <p className='shrink-0 text-sm font-semibold text-primary'>
                        {formatVnd(line.unitPrice * line.quantity)}
                    </p>
                </div>
                {line.note && <p className='mt-0.5 text-xs text-muted-foreground'>{line.note}</p>}
                <div className='mt-2 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Button size='icon-xs' aria-label={`Decrease ${line.name}`}>
                            <Minus />
                        </Button>
                        <span className='min-w-4 text-center text-sm font-medium tabular-nums text-foreground'>
                            {line.quantity}
                        </span>
                        <Button size='icon-xs' aria-label={`Increase ${line.name}`}>
                            <Plus />
                        </Button>
                    </div>
                    <button
                        type='button'
                        aria-label={`Remove ${line.name}`}
                        className='rounded-full p-1.5 text-muted-foreground/70 transition-colors hover:bg-destructive/10 hover:text-destructive'
                    >
                        <Trash2 className='size-4' aria-hidden />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Order panel — the shared body of the persistent sidebar AND the mobile
// drawer. Header + footer stay pinned; only the item list scrolls independently
// (theme: Summary Panel always shows the breakdown + Confirm). Bold running
// total in crimson, ONE crimson final commit (Confirm order). Empty →
// illustration + one (black, structural) CTA, no dead end.
// ---------------------------------------------------------------------------

function OrderPanelHeader({ count }: { count: number }) {
    return (
        <div className='flex shrink-0 items-center justify-between'>
            <h2 className='text-lg font-semibold tracking-tight text-foreground'>My order</h2>
            {count > 0 && (
                <span className='text-xs font-medium text-muted-foreground'>
                    {count} {count === 1 ? 'item' : 'items'}
                </span>
            )}
        </div>
    );
}

function OrderPanelBody({ lines }: { lines: OrderLine[] }) {
    if (lines.length === 0) {
        return (
            <div className='flex flex-1 flex-col items-center justify-center px-2 py-10 text-center'>
                <span className='mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                    <ShoppingBag className='size-7' aria-hidden />
                </span>
                <p className='text-base font-semibold text-foreground'>Your order is empty</p>
                <p className='mt-1 max-w-[15rem] text-sm text-muted-foreground'>
                    Add a dish from the menu and it will show up here.
                </p>
                <Button className='mt-5 rounded-full'>Browse the menu</Button>
            </div>
        );
    }

    return (
        <ScrollArea className='-mr-2 min-h-0 flex-1 pr-2'>
            <div className='flex flex-col gap-3'>
                {lines.map(line => (
                    <OrderLineRow key={line.id} line={line} />
                ))}
            </div>
        </ScrollArea>
    );
}

function OrderPanelFooter({ lines }: { lines: OrderLine[] }) {
    if (lines.length === 0) return null;
    const subtotal = orderSubtotal(lines);
    const total = subtotal - Math.round(subtotal * DISCOUNT_RATE);
    return (
        <div className='shrink-0 space-y-4'>
            {/* Dashed divider closes the line-item list (theme: Summary Panel). */}
            <div className='border-t border-dashed border-border' />

            {/* Promo row → an applied-code Promo/Tag pill with a dismiss ×. */}
            <div className='flex items-center justify-between'>
                <span className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>
                    Promocode
                </span>
                <span className='inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground'>
                    <Ticket className='size-3.5 text-muted-foreground' aria-hidden />
                    bato
                    <button
                        type='button'
                        aria-label='Remove promo code bato'
                        className='-mr-0.5 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground'
                    >
                        <X className='size-3' aria-hidden />
                    </button>
                </span>
            </div>

            {/* Breakdown rows: discount is negative (crimson, prefixed −), delivery
                is free (green). Neither competes with the final CTA. */}
            <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                    <span className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>
                        Discount
                    </span>
                    <span className='text-sm font-semibold tabular-nums text-primary'>-10%</span>
                </div>
                <div className='flex items-center justify-between'>
                    <span className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>
                        Delivery
                    </span>
                    <span className='text-sm font-semibold text-success'>Free</span>
                </div>
            </div>

            {/* Bold running total in crimson. */}
            <div className='flex items-center justify-between border-t border-border pt-3'>
                <span className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>Total</span>
                <span className='text-xl font-bold tabular-nums text-primary'>{formatVnd(total)}</span>
            </div>

            {/* The one crimson final commit for this viewport (theme: Final CTA). */}
            <Button size='lg' className='w-full rounded-full'>
                Confirm order
            </Button>
        </div>
    );
}

function OrderPanel({ lines }: { lines: OrderLine[] }) {
    return (
        <div className='flex h-full min-h-0 flex-col gap-4'>
            <OrderPanelHeader count={orderCount(lines)} />
            <OrderPanelBody lines={lines} />
            <OrderPanelFooter lines={lines} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Content zone — page bodies are UNCHANGED this sprint → a labelled, muted
// placeholder on a white panel (large radius, hairline, faint shadow). It
// scrolls independently within the shell (overflow-y-auto).
// ---------------------------------------------------------------------------

function ContentZonePlaceholder() {
    return (
        <section className='flex min-h-0 flex-1 flex-col overflow-y-auto rounded-[1.5rem] border border-border bg-card p-6 shadow-sm'>
            <div className='mb-6'>
                <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>Menu</p>
                <h1 className='mt-1 text-2xl font-bold tracking-tight text-foreground'>What are you craving?</h1>
            </div>
            <div className='flex min-h-[36rem] flex-1 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/30'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    menu content zone placeholder
                </span>
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Cart pill — a BLACK structural affordance on the right of the toolbar (theme:
// cart access = structural, so it shares the black nav language; the only allowed
// red here is the small cart-count badge per §2). On desktop it anchors the
// persistent order sidebar; on mobile the order button (below) plays that role.
// ---------------------------------------------------------------------------

function CartPill({ count }: { count: number }) {
    return (
        <button
            type='button'
            aria-label={`Cart, ${count} items`}
            className='inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
        >
            <ShoppingBag className='size-4' aria-hidden />
            Cart
            {count > 0 && (
                <span className='flex size-5 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px] font-bold text-primary-foreground'>
                    {count}
                </span>
            )}
        </button>
    );
}

// ---------------------------------------------------------------------------
// Floating toolbar — the shared, domain-blind NavBar (consumer variant): a
// large-radius rounded white bar that FLOATS inside the shell (the shell padding
// gives it margin on all sides; never edge-to-edge). Brand slot left · nav-items
// region center (the active tab is a real navigation selection — a white pill w/
// crimson icon+label via NavBarItem's aria-current, never a Button in a selected
// style) · actions slot right (search + preserved controls + black Cart pill).
// On mobile it condenses to brand + the order button (still a floating bar).
// ---------------------------------------------------------------------------

function ShellTopbar({
    activeNav,
    lines,
    orderButton,
}: {
    activeNav: string;
    lines: OrderLine[];
    orderButton?: React.ReactNode;
}) {
    return (
        <NavBar className='shrink-0'>
            <NavBarBrand>
                <span className='pl-1 text-lg font-extrabold tracking-tight text-primary lg:pl-2'>Notism</span>
            </NavBarBrand>

            <NavBarNav className='hidden flex-1 justify-center lg:flex'>
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavBarItem key={item.key} active={item.key === activeNav}>
                            <Icon className='size-4' aria-hidden />
                            {item.label}
                        </NavBarItem>
                    );
                })}
            </NavBarNav>

            <NavBarActions>
                <button
                    type='button'
                    aria-label='Search'
                    className='hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex'
                >
                    <Search className='size-4' aria-hidden />
                </button>
                <button
                    type='button'
                    aria-label='Language: EN'
                    className='hidden h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex'
                >
                    <Globe className='size-4' aria-hidden />
                    EN
                </button>
                <button
                    type='button'
                    aria-label='Toggle theme'
                    className='hidden size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex'
                >
                    <Moon className='size-4' aria-hidden />
                </button>
                <Avatar className='hidden size-9 lg:block'>
                    <AvatarFallback className='bg-selected text-xs font-semibold text-selected-foreground'>
                        TM
                    </AvatarFallback>
                </Avatar>

                {/* Desktop = black Cart pill (the toolbar's cart CTA); mobile = order button drawer trigger. */}
                <div className='hidden lg:block'>
                    <CartPill count={orderCount(lines)} />
                </div>
                <div className='lg:hidden'>{orderButton}</div>
            </NavBarActions>
        </NavBar>
    );
}

// ---------------------------------------------------------------------------
// Mobile order trigger — the condensed toolbar's BLACK structural order button
// (opens the drawer); keeps the running total reachable (theme: never hide cost),
// with the only red being the small cart-count badge per §2.
// ---------------------------------------------------------------------------

function MobileOrderTrigger({ lines, onOpen }: { lines: OrderLine[]; onOpen: () => void }) {
    const count = orderCount(lines);
    return (
        <button
            type='button'
            onClick={onOpen}
            aria-label={`Open order, ${count} items`}
            className='inline-flex h-10 items-center gap-2 rounded-full bg-selected px-3.5 text-selected-foreground shadow-sm transition-colors hover:bg-selected/90'
        >
            <span className='relative'>
                <ShoppingCart className='size-5' aria-hidden />
                {count > 0 && (
                    <span className='absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-selected text-[10px] font-bold text-selected-foreground'>
                        {count}
                    </span>
                )}
            </span>
            <span className='text-sm font-semibold tabular-nums'>{formatVnd(orderSubtotal(lines))}</span>
        </button>
    );
}

// ---------------------------------------------------------------------------
// Desktop shell — one large-radius light-gray shell floats over the dark frame
// (soft shadow). It holds the floating toolbar + content zone + persistent
// order sidebar; the content zone and sidebar each scroll independently while
// the toolbar stays pinned.
// ---------------------------------------------------------------------------

function DesktopShell({ lines, activeNav = 'home' }: { lines: OrderLine[]; activeNav?: string }) {
    return (
        <AmbientFrame>
            <div
                className={`flex h-full w-full flex-col gap-3 rounded-[1.75rem] bg-muted p-3 lg:gap-4 lg:rounded-[2rem] lg:p-4 ${SHELL_SHADOW}`}
            >
                <ShellTopbar activeNav={activeNav} lines={lines} />
                <div className='flex min-h-0 flex-1 gap-3 lg:gap-4'>
                    <ContentZonePlaceholder />
                    <aside className='hidden w-[22rem] shrink-0 flex-col overflow-hidden rounded-[1.5rem] border border-border bg-card p-5 shadow-sm lg:flex'>
                        <OrderPanel lines={lines} />
                    </aside>
                </div>
            </div>
        </AmbientFrame>
    );
}

// ---------------------------------------------------------------------------
// Mobile shell — the shell narrows; the toolbar stays a rounded floating bar
// (brand + crimson order button) and the order sidebar collapses into a drawer
// opened from that button. Honours prefers-reduced-motion (opacity / instant).
// ---------------------------------------------------------------------------

function MobileShell({ lines, initialOpen = false }: { lines: OrderLine[]; initialOpen?: boolean }) {
    const [open, setOpen] = React.useState(initialOpen);
    return (
        <AmbientFrame className='justify-center'>
            <div
                className={`flex h-full w-full max-w-[26rem] flex-col gap-3 rounded-[1.75rem] bg-muted p-3 ${SHELL_SHADOW}`}
            >
                <ShellTopbar
                    activeNav='home'
                    lines={lines}
                    orderButton={<MobileOrderTrigger lines={lines} onOpen={() => setOpen(true)} />}
                />
                <div className='flex min-h-0 flex-1'>
                    <ContentZonePlaceholder />
                </div>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent
                    side='right'
                    className='w-[88vw] gap-0 p-5 motion-reduce:transition-none motion-reduce:animate-none sm:max-w-sm'
                >
                    <SheetHeader className='p-0'>
                        <SheetTitle className='text-lg font-semibold tracking-tight text-foreground'>
                            My order
                        </SheetTitle>
                    </SheetHeader>
                    <div className='mt-4 flex min-h-0 flex-1 flex-col'>
                        <OrderPanel lines={lines} />
                    </div>
                </SheetContent>
            </Sheet>
        </AmbientFrame>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Consumer App Shell',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — desktop shell: one large-radius light-gray shell floats over the
 * dark ambient frame (decorative line-art only). A floating rounded toolbar
 * (brand · centered nav-tab pills with a black active pill · search + a black
 * Cart pill) stays pinned; the content zone and the persistent order Summary
 * Panel each scroll independently. The sidebar shows running items, a promo pill,
 * discount/delivery breakdown, the bold crimson total, and the one crimson
 * final commit (Confirm order).
 */
export const Default: Story = {
    name: 'Default — Desktop Shell With Order Sidebar',
    render: () => <DesktopShell lines={ORDER_LINES} activeNav='home' />,
};

/**
 * Empty order — the persistent sidebar shows an empty state with exactly one
 * CTA (Browse the menu). No dead end; the shell chrome is otherwise identical.
 */
export const EmptyOrder: Story = {
    name: 'Empty — Sidebar Empty State (One CTA)',
    render: () => <DesktopShell lines={[]} activeNav='home' />,
};

/**
 * Mobile — drawer closed. The toolbar stays a rounded floating bar condensed to
 * brand + a black order button that keeps the running total reachable. The
 * content zone scrolls independently. Tapping the order button opens the drawer.
 */
export const MobileDrawerClosed: Story = {
    name: 'Mobile — Drawer Closed (Total On Toolbar)',
    parameters: { viewport: { defaultViewport: 'mobile1' } },
    render: () => <MobileShell lines={ORDER_LINES} initialOpen={false} />,
};

/**
 * Mobile — drawer open. The order Summary Panel surfaces in a drawer opened
 * from the toolbar's black order button: running items, promo pill, breakdown,
 * bold crimson total, single crimson Confirm order. Honours prefers-reduced-motion.
 */
export const MobileDrawerOpen: Story = {
    name: 'Mobile — Drawer Open (Running Order)',
    parameters: { viewport: { defaultViewport: 'mobile1' } },
    render: () => <MobileShell lines={ORDER_LINES} initialOpen />,
};

/**
 * Mobile empty — drawer open on an empty order: the same one-CTA empty state,
 * reachable from the toolbar's crimson order button.
 */
export const MobileDrawerEmpty: Story = {
    name: 'Mobile — Drawer Open (Empty Order)',
    parameters: { viewport: { defaultViewport: 'mobile1' } },
    render: () => <MobileShell lines={[]} initialOpen />,
};
