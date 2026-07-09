import type { Meta, StoryObj } from '@storybook/react-vite';
import { Globe, Home, Moon, Search, ShoppingBag } from 'lucide-react';
import type { ReactNode } from 'react';

import { Avatar, AvatarFallback } from '@/components/avatar';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';

// ---------------------------------------------------------------------------
// Implementation reference — Sprint 11 (consumer app shell restyle).
//
// Restyles the EXISTING consumer layout (src/layouts/client: topbar + content
// zone) to the design system. Business functionality is UNCHANGED — same nav
// (Home, Orders), same brand, same controls (search, language, theme, account).
// Only the visual + UX treatment changes, and this sprint the persistent order
// panel is removed from the shell entirely:
//
//   • dark ambient FRAME (charcoal, no controls) sits behind ONE large rounded
//     light-gray SHELL that floats over it;
//   • a FLOATING rounded toolbar sits inside the shell with margin on all sides
//     (brand left · nav-tab pill row center where the active item is a BLACK pill
//     with a white icon+label · actions right: search + language + theme + avatar
//     + a crimson Cart affordance);
//   • two-tone hierarchy: BLACK carries structural/contextual controls (nav tabs);
//     CRIMSON is reserved for prices and the Cart CTA;
//   • the shell holds the toolbar + a FULL-WIDTH content zone — there is no
//     persistent order sidebar and no order drawer. The toolbar stays pinned
//     while the content zone scrolls independently; the shell fills the viewport,
//     no page scroll;
//   • the Cart affordance is a ROUTE LINK to the existing /cart (CartReview)
//     surface — it no longer opens a sidebar or drawer. Desktop shows a crimson
//     Cart pill; mobile shows a condensed crimson cart button. A small item-count
//     badge sits on both (a lightweight count constant, not a full order model).
//
// Elevation is soft + minimal: ambient dark frame → one large-radius light-gray
// shell (soft low-spread shadow) → white content panel (large radius, hairline,
// faint shadow) → white cards (hairline, little/no shadow). Exactly one gentle
// elevation step per level — no heavy rings or hard drop-shadows.
//
// Page BODIES are unchanged by this sprint → the content zone is a labelled,
// muted placeholder; only the shell chrome (frame + toolbar) is implemented here.
//
// Mock-only fixtures. No api / model / store / SignalR imports.
// ---------------------------------------------------------------------------

// Lightweight cart badge count (mock only — the shell no longer carries the full
// order model; the Cart affordance routes to /cart where the real cart lives).
const CART_ITEM_COUNT = 3;

// ---------------------------------------------------------------------------
// Consumer nav model — preserved from the existing client toolbar
// (Home, Orders). The active item takes the black active pill (theme).
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
// Ambient frame — the dark charcoal backdrop. Never carries controls or content;
// always sits BEHIND the light shell. Fixed to the viewport height so the shell
// can fill it and its inner content zone scrolls independently (no page scroll).
// ---------------------------------------------------------------------------

function AmbientFrame({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={['relative flex h-screen w-full overflow-hidden bg-muted', className].filter(Boolean).join(' ')}
        >
            <div className='relative z-10 flex min-h-0 w-full flex-1 items-stretch'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Content zone — page bodies are UNCHANGED this sprint → a labelled, muted
// placeholder on a white panel (large radius, hairline, faint shadow). It now
// fills the FULL WIDTH of the shell (no right sidebar) and scrolls independently
// within the shell (overflow-y-auto).
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
// Cart pill — the desktop crimson Cart affordance on the right of the toolbar.
// It is a ROUTE LINK to /cart (CartReview); it no longer anchors a sidebar. The
// small badge shows the lightweight item count.
// ---------------------------------------------------------------------------

function CartPill({ count }: { count: number }) {
    return (
        <a
            href='/cart'
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
        </a>
    );
}

// ---------------------------------------------------------------------------
// Mobile cart button — the condensed toolbar's crimson cart affordance. Like the
// desktop pill it is a ROUTE LINK to /cart (no drawer), with the item-count badge
// as the only red accent per the two-tone hierarchy.
// ---------------------------------------------------------------------------

function MobileCartButton({ count }: { count: number }) {
    return (
        <a
            href='/cart'
            aria-label={`Cart, ${count} items`}
            className='relative inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90'
        >
            <ShoppingBag className='size-5' aria-hidden />
            {count > 0 && (
                <span className='absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-primary-foreground text-[10px] font-bold text-primary'>
                    {count}
                </span>
            )}
        </a>
    );
}

// ---------------------------------------------------------------------------
// Floating toolbar — the shared, domain-blind NavBar (consumer variant): a
// large-radius rounded white bar that FLOATS inside the shell (the shell padding
// gives it margin on all sides; never edge-to-edge). Brand slot left · nav-items
// region center (the active tab is a real navigation selection — a black pill via
// NavBarItem's aria-current, never a Button in a selected style) · actions slot
// right (search + language + theme + avatar + the crimson Cart affordance). On
// mobile it condenses to brand + a crimson cart-route button (still a floating
// bar).
// ---------------------------------------------------------------------------

function ShellTopbar({ activeNav }: { activeNav: string }) {
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

                {/* Cart affordance routes to /cart on both viewports (no drawer/sidebar). */}
                <div className='hidden lg:block'>
                    <CartPill count={CART_ITEM_COUNT} />
                </div>
                <div className='lg:hidden'>
                    <MobileCartButton count={CART_ITEM_COUNT} />
                </div>
            </NavBarActions>
        </NavBar>
    );
}

// ---------------------------------------------------------------------------
// Desktop shell — one large-radius light-gray shell floats over the dark frame
// (soft shadow). It holds the floating toolbar + a FULL-WIDTH content zone (no
// persistent order sidebar); the content zone scrolls independently while the
// toolbar stays pinned.
// ---------------------------------------------------------------------------

function DesktopShell({ activeNav = 'home' }: { activeNav?: string }) {
    return (
        <AmbientFrame>
            <div className='flex h-full w-full flex-col gap-3 bg-muted p-3 lg:gap-4 lg:p-4'>
                <ShellTopbar activeNav={activeNav} />
                <div className='flex min-h-0 flex-1'>
                    <ContentZonePlaceholder />
                </div>
            </div>
        </AmbientFrame>
    );
}

// ---------------------------------------------------------------------------
// Mobile shell — the shell narrows; the toolbar stays a rounded floating bar
// condensed to brand + a crimson cart-route button. The content zone fills the
// full width and scrolls independently. No drawer.
// ---------------------------------------------------------------------------

function MobileShell({ activeNav = 'home' }: { activeNav?: string }) {
    return (
        <AmbientFrame className='justify-center'>
            <div className='flex h-full w-full max-w-[26rem] flex-col gap-3 bg-muted p-3'>
                <ShellTopbar activeNav={activeNav} />
                <div className='flex min-h-0 flex-1'>
                    <ContentZonePlaceholder />
                </div>
            </div>
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
 * dark ambient frame. A floating rounded toolbar (brand · centered nav-tab pills
 * with a black active pill · search + language + theme + avatar + a crimson Cart
 * pill) stays pinned; the FULL-WIDTH content zone scrolls independently. There is
 * no persistent order sidebar — the Cart pill routes to /cart (CartReview).
 */
export const Default: Story = {
    name: 'Default — Desktop Shell, Full-Width Content',
    render: () => <DesktopShell activeNav='home' />,
};

/**
 * Mobile — the toolbar stays a rounded floating bar condensed to brand + a crimson
 * cart button that routes to /cart. The content zone fills the full width and
 * scrolls independently. No order drawer.
 */
export const Mobile: Story = {
    name: 'Mobile — Condensed Toolbar, Full-Width Content',
    parameters: { viewport: { defaultViewport: 'mobile1' } },
    render: () => <MobileShell activeNav='home' />,
};
