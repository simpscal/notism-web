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
//   • the layout is FULL-BLEED / edge-to-edge on the app's neutral canvas
//     (bg-muted) — no frame backdrop, no enclosing floating card/shell; content
//     flows directly on the canvas, never inside a rounded panel;
//   • a FLOATING rounded toolbar (the shared NavBar) is the ONE raised element:
//     detached, inset from the layout edges, carrying its own radius + a single
//     soft shadow, pinned above the full-bleed content (brand left · nav-tab pill
//     row center where the active item is a BLACK pill with a white icon+label ·
//     actions right: search + language + theme + avatar + a crimson Cart
//     affordance);
//   • two-tone hierarchy: BLACK carries structural/contextual controls (nav tabs);
//     CRIMSON is reserved for prices and the Cart CTA;
//   • beneath the pinned toolbar a FULL-BLEED content zone scrolls independently;
//     there is no persistent order sidebar and no order drawer. The shell fills
//     the viewport — only the content zone scrolls, no page scroll;
//   • the Cart affordance is a ROUTE LINK to the existing /cart (CartReview)
//     surface — it no longer opens a sidebar or drawer. Desktop shows a crimson
//     Cart pill; mobile shows a condensed crimson cart button. A small item-count
//     badge sits on both (a lightweight count constant, not a full order model).
//
// Elevation is soft + minimal: the floating rounded toolbar is the only raised
// element (one soft low-spread shadow); the edge-to-edge content and any cards
// within it use hairlines and little/no shadow. Exactly one gentle elevation
// step for the chrome — no heavy rings or hard drop-shadows.
//
// Page BODIES are unchanged by this sprint → the content zone is a labelled,
// muted placeholder; only the shell chrome (toolbar) is implemented here.
//
// Mock-only fixtures. No api / model / store / SignalR imports.
// ---------------------------------------------------------------------------

// One soft shadow — the only elevation in the shell, reserved for the floating
// rounded toolbar. No heavy rings.
const SOFT_SHADOW = 'shadow-[0_4px_20px_rgba(0,0,0,0.05)]';

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
// App canvas — FULL-BLEED. No frame backdrop, no enclosing floating shell. A
// single edge-to-edge column on the app's neutral canvas (bg-muted): the pinned
// floating toolbar at top over an independently scrolling content zone. The
// toolbar is the only raised element; the content flows directly on the canvas,
// never inside a rounded shell. Fixed to the viewport height so only the content
// zone scrolls (no page scroll).
// ---------------------------------------------------------------------------

function AppCanvas({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={['flex h-screen w-full flex-col overflow-hidden bg-muted', className].filter(Boolean).join(' ')}
        >
            {children}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Content zone — page bodies are UNCHANGED this sprint → a labelled, muted
// placeholder that runs FULL-BLEED / edge-to-edge on the app canvas (no
// enclosing white panel or floating shell). The header sits directly on the
// canvas; the placeholder block fills the remaining height.
// ---------------------------------------------------------------------------

function ContentZonePlaceholder() {
    return (
        <>
            <div className='mb-6'>
                <p className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>Menu</p>
                <h1 className='mt-1 text-2xl font-bold tracking-tight text-foreground'>What are you craving?</h1>
            </div>
            <div className='flex min-h-[36rem] flex-1 items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/30'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    menu content zone placeholder
                </span>
            </div>
        </>
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
// large-radius rounded white bar that FLOATS over the full-bleed content, inset
// from the layout edges via its wrapping row and carrying its own radius + one
// soft shadow (never edge-to-edge). Brand slot left · nav-items region center
// (the active tab is a real navigation selection — a black pill via NavBarItem's
// aria-current, never a Button in a selected style) · actions slot right (search
// + language + theme + avatar + the crimson Cart affordance). On mobile it
// condenses to brand + a crimson cart-route button (still a floating bar).
// ---------------------------------------------------------------------------

function ShellTopbar({ activeNav }: { activeNav: string }) {
    return (
        <NavBar className={['shrink-0', SOFT_SHADOW].join(' ')}>
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
// The shell — a full-bleed column on the app's neutral canvas. The floating
// rounded toolbar (the shared NavBar) is pinned at top, inset from the edges via
// its wrapping row. Beneath it, an edge-to-edge content zone scrolls
// independently — the content flows directly on the canvas, not inside a rounded
// shell or white panel. The toolbar condenses responsively (Storybook viewport
// drives the breakpoint) so the desktop + mobile behaviour is real. No
// page-level scrollbar — only the content zone scrolls. No order sidebar/drawer.
// ---------------------------------------------------------------------------

function ConsumerAppShell({ activeNav = 'home' }: { activeNav?: string }) {
    return (
        <AppCanvas>
            {/* Pinned floating toolbar — inset from the layout edges, outside the scroll zone */}
            <div className='shrink-0 px-4 pt-4 lg:px-6 lg:pt-6'>
                <ShellTopbar activeNav={activeNav} />
            </div>

            {/* Independently scrolling, edge-to-edge content zone — no enclosing shell */}
            <main className='flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 sm:py-6'>
                <ContentZonePlaceholder />
            </main>
        </AppCanvas>
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
 * Default — the consumer shell on desktop: a full-bleed, edge-to-edge layout on
 * the app's neutral canvas — no frame backdrop, no enclosing floating shell. The
 * shared NavBar floats as a detached rounded toolbar, inset from the layout edges
 * with its own radius + one soft shadow (brand · centered nav-tab pills with a
 * black active pill · search + language + theme + avatar + a crimson Cart pill),
 * pinned above an independently scrolling, edge-to-edge content zone. There is no
 * persistent order sidebar — the Cart pill routes to /cart (CartReview).
 */
export const Default: Story = {
    name: 'Default — Desktop Shell, Full-Bleed Content',
    render: () => <ConsumerAppShell activeNav='home' />,
};

/**
 * Mobile — the full-bleed shell condenses: the floating rounded toolbar narrows
 * to brand + a crimson cart button that routes to /cart, still inset with its own
 * radius + soft shadow over the edge-to-edge content zone, which scrolls
 * independently. No order drawer.
 */
export const Mobile: Story = {
    name: 'Mobile — Condensed Toolbar, Full-Bleed Content',
    parameters: { viewport: { defaultViewport: 'mobile1' } },
    render: () => <ConsumerAppShell activeNav='home' />,
};
