import type { Meta, StoryObj } from '@storybook/react-vite';
import { Home, LogIn, LogOut, Minus, Moon, Plus, Settings, ShoppingCart, Sun, User } from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import React, { useId, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------
//
// Self-contained VISUAL REFERENCE for the Apple-style consumer mobile bottom
// toolbar (Sprint 10, stories #289 / #290 / #291). It re-implements the toolbar
// with inventory components + design tokens ONLY — it never imports the real
// `src/layouts/client/components/client-toolbar-mobile.tsx`, the router, redux,
// i18n, or the theme context, so it renders standalone in Storybook.
//
// Differences from the shipping component, made purely so it renders framed:
//   • root uses `absolute bottom-0` inside a phone frame instead of
//     `fixed bottom-0 ... lg:hidden` (the frame stands in for the viewport;
//     the lg:hidden responsive rule is documented in the Responsive story).
//   • navigation is local state (onNavigate) rather than <NavLink>/<Link>.
//   • theme toggle flips a local `dark` class rather than the theme context.
//
// All colour, radius, and spacing come from theme tokens (bg-background,
// text-primary, border-border, rounded tokens, muted-foreground, …).

// ---------------------------------------------------------------------------
// Types & fixtures
// ---------------------------------------------------------------------------

type Section = 'home' | 'cart' | 'account' | null;

interface ClientUser {
    firstName: string;
    displayName: string;
    email: string;
    avatarUrl?: string;
}

const USER_DEFAULT: ClientUser = {
    firstName: 'Lan',
    displayName: 'Nguyen Thi Lan',
    email: 'lan.nguyen@example.com',
    avatarUrl: '',
};

const USER_LONG_NAME: ClientUser = {
    firstName: 'Bartholomew-Alexander',
    displayName: 'Bartholomew Alexander Christodoulou-Nguyen',
    email: 'bartholomew.christodoulou-nguyen@verylongexampleemail.com',
    avatarUrl: '',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cx(...parts: Array<string | false | null | undefined>): string {
    return parts.filter(Boolean).join(' ');
}

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();
}

// Motion tokens — theme Motion: 150–250ms ease-out, reduced-motion aware.
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const FADE = { duration: 0.2, ease: EASE_OUT };
// Apple-style sliding indicator: a soft, quick spring rather than a snap.
const PILL_SPRING = { type: 'spring' as const, stiffness: 420, damping: 34, mass: 0.7 };
const BADGE_SPRING = { type: 'spring' as const, stiffness: 620, damping: 20, mass: 0.6 };

// ---------------------------------------------------------------------------
// Toolbar item — icon + label, roomy 44×44 tap target, press feedback
// ---------------------------------------------------------------------------

interface ToolbarItemProps {
    label: string;
    active?: boolean;
    /** Shared layout id so the active pill glides between items. */
    pillId: string;
    onPress?: () => void;
    children: React.ReactNode; // the icon region
    ariaLabel?: string;
}

function ToolbarItem({ label, active = false, pillId, onPress, children, ariaLabel }: ToolbarItemProps) {
    return (
        <motion.button
            type='button'
            aria-label={ariaLabel ?? label}
            aria-current={active ? 'page' : undefined}
            onClick={onPress}
            whileTap={{ scale: 0.86 }}
            transition={FADE}
            className={cx(
                'relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1',
                'rounded-2xl px-1 pt-1.5 pb-1 outline-none',
                'focus-visible:ring-2 focus-visible:ring-ring/60',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            )}
        >
            {active && (
                <motion.span
                    layoutId={pillId}
                    transition={PILL_SPRING}
                    className='absolute inset-x-2 inset-y-1 -z-0 rounded-2xl bg-primary/10'
                    aria-hidden
                />
            )}
            <span className='relative z-10 flex flex-col items-center gap-1'>
                {children}
                <span className='text-[11px] font-medium leading-none tracking-[-0.01em]'>{label}</span>
            </span>
        </motion.button>
    );
}

// ---------------------------------------------------------------------------
// Cart badge — animates count changes (pop), caps at 99+
// ---------------------------------------------------------------------------

function CartBadge({ count }: { count: number }) {
    if (count <= 0) return null;
    const display = count > 99 ? '99+' : String(count);

    return (
        <span className='pointer-events-none absolute -right-2 -top-2'>
            <AnimatePresence mode='popLayout' initial={false}>
                <motion.span
                    key={display}
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.2, opacity: 0 }}
                    transition={BADGE_SPRING}
                    className={cx(
                        'flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1',
                        'bg-primary text-primary-foreground text-[10px] font-semibold leading-none',
                        'ring-2 ring-background'
                    )}
                >
                    {display}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

// ---------------------------------------------------------------------------
// Theme icon — sun/moon crossfade + rotate
// ---------------------------------------------------------------------------

function ThemeIcon({ isDark }: { isDark: boolean }) {
    return (
        <span className='relative flex h-6 w-6 items-center justify-center'>
            <AnimatePresence mode='wait' initial={false}>
                <motion.span
                    key={isDark ? 'sun' : 'moon'}
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={FADE}
                    className='absolute inset-0 flex items-center justify-center'
                >
                    {isDark ? (
                        <Sun className='h-6 w-6' strokeWidth={1.75} />
                    ) : (
                        <Moon className='h-6 w-6' strokeWidth={1.75} />
                    )}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

// ---------------------------------------------------------------------------
// The Apple-style toolbar (controlled / presentational)
// ---------------------------------------------------------------------------

interface AppleToolbarProps {
    user: ClientUser | null;
    cartCount: number;
    activeSection: Section;
    isDark: boolean;
    /** Extra bottom safe-area inset (iOS home indicator) in px, for the demo. */
    safeAreaPx?: number;
    onNavigate?: (section: Exclude<Section, null>) => void;
    onToggleTheme?: () => void;
}

function AppleToolbar({
    user,
    cartCount,
    activeSection,
    isDark,
    safeAreaPx = 0,
    onNavigate,
    onToggleTheme,
}: AppleToolbarProps) {
    // Unique per instance so the shared-layout pill never jumps between the
    // multiple toolbars rendered together on the autodocs page.
    const uid = useId();
    const pillId = `active-pill-${uid}`;

    return (
        <div className='absolute inset-x-0 bottom-0 z-50'>
            {/* Translucent, blurred Apple-style chrome. `lg:hidden` on the real
                component; omitted here so the framed reference always shows. */}
            <div
                className={cx(
                    'border-t border-border/60 bg-background/70',
                    'backdrop-blur-xl backdrop-saturate-150',
                    'shadow-[0_-1px_0_0_var(--color-border)]'
                )}
                style={{
                    // Content sits ABOVE the home-indicator safe-area inset.
                    paddingBottom: `max(env(safe-area-inset-bottom, 0px), ${safeAreaPx}px)`,
                }}
            >
                <div className='mx-auto flex h-16 max-w-md items-stretch justify-around gap-1 px-2'>
                    {/* Home → /foods */}
                    <ToolbarItem
                        label='Home'
                        ariaLabel='Home'
                        active={activeSection === 'home'}
                        pillId={pillId}
                        onPress={() => onNavigate?.('home')}
                    >
                        <Home className='h-6 w-6' strokeWidth={1.75} />
                    </ToolbarItem>

                    {/* Cart → /cart */}
                    <ToolbarItem
                        label='Cart'
                        ariaLabel={`Cart, ${cartCount} items`}
                        active={activeSection === 'cart'}
                        pillId={pillId}
                        onPress={() => onNavigate?.('cart')}
                    >
                        <span className='relative'>
                            <ShoppingCart className='h-6 w-6' strokeWidth={1.75} />
                            <CartBadge count={cartCount} />
                        </span>
                    </ToolbarItem>

                    {/* Theme toggle — an ACTION, never shows an active pill */}
                    <ToolbarItem label='Theme' ariaLabel='Toggle theme' pillId={pillId} onPress={onToggleTheme}>
                        <ThemeIcon isDark={isDark} />
                    </ToolbarItem>

                    {/* Account — dropdown when signed in, else Log in */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <motion.button
                                    type='button'
                                    aria-label='Account menu'
                                    aria-current={activeSection === 'account' ? 'page' : undefined}
                                    whileTap={{ scale: 0.86 }}
                                    transition={FADE}
                                    className={cx(
                                        'relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-1',
                                        'rounded-2xl px-1 pt-1.5 pb-1 outline-none',
                                        'focus-visible:ring-2 focus-visible:ring-ring/60',
                                        activeSection === 'account' ? 'text-primary' : 'text-muted-foreground'
                                    )}
                                >
                                    {activeSection === 'account' && (
                                        <motion.span
                                            layoutId={pillId}
                                            transition={PILL_SPRING}
                                            className='absolute inset-x-2 inset-y-1 -z-0 rounded-2xl bg-primary/10'
                                            aria-hidden
                                        />
                                    )}
                                    <span className='relative z-10 flex flex-col items-center gap-1'>
                                        <Avatar
                                            className={cx(
                                                'h-6 w-6 rounded-full ring-2 transition-colors',
                                                activeSection === 'account' ? 'ring-primary/40' : 'ring-transparent'
                                            )}
                                        >
                                            {user.avatarUrl && (
                                                <AvatarImage src={user.avatarUrl} alt={user.displayName} />
                                            )}
                                            <AvatarFallback className='bg-primary text-primary-foreground text-[9px] font-semibold'>
                                                {getInitials(user.displayName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className='max-w-[64px] truncate text-[11px] font-medium leading-none tracking-[-0.01em]'>
                                            {user.firstName}
                                        </span>
                                    </span>
                                </motion.button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' side='top' className='mb-2 w-56'>
                                <DropdownMenuLabel className='font-normal'>
                                    <p className='truncate text-sm font-medium'>{user.displayName}</p>
                                    <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className='mr-2 h-4 w-4' />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ShoppingCart className='mr-2 h-4 w-4' />
                                    Orders
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className='mr-2 h-4 w-4' />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant='destructive'>
                                    <LogOut className='mr-2 h-4 w-4' />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <ToolbarItem
                            label='Log in'
                            ariaLabel='Log in'
                            pillId={pillId}
                            onPress={() => onNavigate?.('account')}
                        >
                            <LogIn className='h-6 w-6' strokeWidth={1.75} />
                        </ToolbarItem>
                    )}
                </div>

                {/* iOS home indicator handle, shown only when a safe-area inset
                    is present, to prove content clears it. */}
                {safeAreaPx > 0 && (
                    <div
                        className='pointer-events-none absolute inset-x-0 flex justify-center'
                        style={{ bottom: Math.max(safeAreaPx / 2 - 2, 6) }}
                    >
                        <span className='h-1 w-32 rounded-full bg-foreground/25' aria-hidden />
                    </div>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Phone frame — a self-contained mobile viewport with placeholder chrome
// ---------------------------------------------------------------------------

const SECTION_TITLE: Record<Exclude<Section, null> | 'none', string> = {
    home: 'foods',
    cart: 'cart',
    account: 'account',
    none: 'unmatched route',
};

interface PhoneFrameProps {
    dark?: boolean;
    activeSection: Section;
    children: React.ReactNode; // the toolbar
    caption?: string;
}

function PhoneFrame({ dark = false, activeSection, children, caption }: PhoneFrameProps) {
    const bodyLabel = `${SECTION_TITLE[activeSection ?? 'none']} page content placeholder`;

    return (
        <div className={cx('flex min-h-[100dvh] items-center justify-center bg-muted/40 p-6', dark && 'dark')}>
            <div className='relative h-[780px] w-full max-w-[390px] overflow-hidden rounded-[2.75rem] border-[10px] border-foreground/85 bg-background shadow-2xl'>
                {/* Sticky top-bar placeholder (existing chrome, not this surface) */}
                <div className='sticky top-0 z-40 flex h-14 items-center justify-center border-b border-dashed border-border bg-background/80 backdrop-blur'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                        app top bar placeholder
                    </span>
                </div>

                {/* Body — the only non-toolbar region, kept as a muted placeholder */}
                <div className='h-[calc(780px-3.5rem)] overflow-y-auto px-4 pb-28 pt-4'>
                    {caption && (
                        <p className='mb-3 text-center text-[11px] font-medium text-muted-foreground'>{caption}</p>
                    )}
                    <div className='flex h-[520px] items-center justify-center rounded-2xl border border-dashed bg-muted/20'>
                        <span className='px-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                            {bodyLabel}
                        </span>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Static story wrapper
// ---------------------------------------------------------------------------

interface StaticStoryProps {
    user?: ClientUser | null;
    cartCount?: number;
    activeSection?: Section;
    dark?: boolean;
    safeAreaPx?: number;
    reducedMotion?: 'user' | 'always';
    caption?: string;
}

function StaticStory({
    user = USER_DEFAULT,
    cartCount = 3,
    activeSection = 'home',
    dark = false,
    safeAreaPx = 0,
    reducedMotion = 'user',
    caption,
}: StaticStoryProps) {
    return (
        <MotionConfig reducedMotion={reducedMotion} transition={FADE}>
            <PhoneFrame dark={dark} activeSection={activeSection} caption={caption}>
                <AppleToolbar
                    user={user}
                    cartCount={cartCount}
                    activeSection={activeSection}
                    isDark={dark}
                    safeAreaPx={safeAreaPx}
                />
            </PhoneFrame>
        </MotionConfig>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — press feedback, sliding indicator, badge + theme motion
// ---------------------------------------------------------------------------

function InteractiveStory({ reducedMotion = 'user' }: { reducedMotion?: 'user' | 'always' }) {
    const [active, setActive] = useState<Section>('home');
    const [dark, setDark] = useState(false);
    const [cart, setCart] = useState(3);

    return (
        <MotionConfig reducedMotion={reducedMotion} transition={FADE}>
            <div className={cx('flex min-h-[100dvh] items-center justify-center bg-muted/40 p-6', dark && 'dark')}>
                <div className='flex flex-col items-center gap-4'>
                    {/* Reviewer controls — not part of the surface */}
                    <div className='flex flex-wrap items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background/60 p-2'>
                        <span className='px-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60'>
                            demo controls
                        </span>
                        <button
                            type='button'
                            onClick={() => setCart(c => Math.max(0, c - 1))}
                            className='flex h-7 w-7 items-center justify-center rounded-md border bg-background text-muted-foreground'
                            aria-label='Decrease cart count'
                        >
                            <Minus className='h-3.5 w-3.5' />
                        </button>
                        <span className='min-w-8 text-center text-xs font-medium tabular-nums'>{cart}</span>
                        <button
                            type='button'
                            onClick={() => setCart(c => c + 1)}
                            className='flex h-7 w-7 items-center justify-center rounded-md border bg-background text-muted-foreground'
                            aria-label='Increase cart count'
                        >
                            <Plus className='h-3.5 w-3.5' />
                        </button>
                        <button
                            type='button'
                            onClick={() => setCart(120)}
                            className='rounded-md border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground'
                        >
                            99+
                        </button>
                    </div>

                    <div className='relative h-[780px] w-full max-w-[390px] overflow-hidden rounded-[2.75rem] border-[10px] border-foreground/85 bg-background shadow-2xl'>
                        <div className='sticky top-0 z-40 flex h-14 items-center justify-center border-b border-dashed border-border bg-background/80 backdrop-blur'>
                            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                                app top bar placeholder
                            </span>
                        </div>
                        <div className='h-[calc(780px-3.5rem)] overflow-y-auto px-4 pb-28 pt-4'>
                            <p className='mb-3 text-center text-[11px] font-medium text-muted-foreground'>
                                Tap Home / Cart / Account to watch the indicator glide. Theme never selects.
                            </p>
                            <div className='flex h-[520px] items-center justify-center rounded-2xl border border-dashed bg-muted/20'>
                                <span className='px-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                                    {SECTION_TITLE[active ?? 'none']} page content placeholder
                                </span>
                            </div>
                        </div>

                        <AppleToolbar
                            user={USER_DEFAULT}
                            cartCount={cart}
                            activeSection={active}
                            isDark={dark}
                            safeAreaPx={0}
                            onNavigate={setActive}
                            onToggleTheme={() => setDark(d => !d)}
                        />
                    </div>
                </div>
            </div>
        </MotionConfig>
    );
}

// ---------------------------------------------------------------------------
// Responsive story — documents the lg:hidden mobile-only rule
// ---------------------------------------------------------------------------

function ResponsiveStory() {
    return (
        <MotionConfig reducedMotion='user' transition={FADE}>
            <div className='flex min-h-[100dvh] flex-col items-center justify-center gap-8 bg-muted/40 p-8 lg:flex-row'>
                {/* < lg: the bottom toolbar is present */}
                <div className='flex flex-col items-center gap-2'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60'>
                        below lg — toolbar visible
                    </span>
                    <div className='relative h-[420px] w-[300px] overflow-hidden rounded-[2rem] border-[8px] border-foreground/85 bg-background shadow-xl'>
                        <div className='flex h-[300px] items-center justify-center'>
                            <span className='px-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                                foods page content placeholder
                            </span>
                        </div>
                        <AppleToolbar user={USER_DEFAULT} cartCount={3} activeSection='home' isDark={false} />
                    </div>
                </div>

                {/* ≥ lg: the real component adds `lg:hidden`, so the bottom bar is
                    gone and the desktop top-bar takes over (a separate surface). */}
                <div className='flex flex-col items-center gap-2'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60'>
                        lg and wider — toolbar hidden
                    </span>
                    <div className='relative flex h-[420px] w-[300px] items-end justify-center overflow-hidden rounded-[2rem] border-[8px] border-foreground/85 bg-background shadow-xl'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <span className='px-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                                desktop uses top bar — bottom toolbar hidden (lg:hidden)
                            </span>
                        </div>
                        <div className='mb-4 rounded-full border border-dashed border-border px-3 py-1'>
                            <span className='font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40'>
                                no bottom toolbar
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </MotionConfig>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 10/Client Toolbar (Mobile)',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** #289 — Apple-style restyle: translucent/blurred bar, Home active by default. */
export const Default: Story = {
    name: 'Default — Apple-Style Bar (Home Active)',
    render: () => <StaticStory activeSection='home' cartCount={3} />,
};

/** #290 — On the foods/menu (home) route, only Home shows active state. */
export const HomeActive: Story = {
    name: 'Home Active — Menu / Foods Route',
    render: () => <StaticStory activeSection='home' caption='Route: /foods — Home selected, nothing else.' />,
};

/** #290 — On the cart route, active state is on Cart. */
export const CartActive: Story = {
    name: 'Cart Active — Cart Route',
    render: () => <StaticStory activeSection='cart' caption='Route: /cart — Cart selected.' />,
};

/** #290 — Profile / orders / settings routes reflect on the Account item. */
export const AccountActive: Story = {
    name: 'Account Active — Profile / Orders / Settings',
    render: () => <StaticStory activeSection='account' caption='Route: /settings/profile — Account selected.' />,
};

/** #290 — Route matches no destination: no item shows active state. */
export const NoActiveSection: Story = {
    name: 'No Active — Unmatched Route',
    render: () => <StaticStory activeSection={null} caption='Route matches no destination — no item selected.' />,
};

/** #289 — Logged out: Account slot becomes a Log in item; no dropdown. */
export const LoggedOut: Story = {
    name: 'Logged Out — Log In Item',
    render: () => <StaticStory user={null} activeSection='home' cartCount={0} />,
};

/** Edge — long first name truncates cleanly, no overflow. */
export const LongName: Story = {
    name: 'Long Account Name — No Overflow',
    render: () => <StaticStory user={USER_LONG_NAME} activeSection='account' cartCount={5} />,
};

/** Edge — cart badge caps at 99+. */
export const CartBadge99Plus: Story = {
    name: 'Cart Badge — 99+',
    render: () => <StaticStory activeSection='home' cartCount={128} />,
};

/** #289 — Dark theme: translucent bar over dark tokens. */
export const DarkTheme: Story = {
    name: 'Dark Theme',
    render: () => <StaticStory dark activeSection='cart' cartCount={3} />,
};

/** #289 — iOS home-indicator safe-area inset present; content clears it. */
export const SafeAreaInset: Story = {
    name: 'Safe-Area Inset — Home Indicator',
    render: () => (
        <StaticStory
            activeSection='home'
            safeAreaPx={34}
            caption='34px bottom inset — items clear the home indicator.'
        />
    ),
};

/** #291 — Live: press feedback, sliding indicator, badge + theme motion. */
export const InteractiveMotion: Story = {
    name: 'Interactive — Press, Slide, Badge & Theme Motion',
    render: () => <InteractiveStory />,
};

/** #291 — Same interactions with OS reduce-motion forced on (fades only, no motion). */
export const ReducedMotion: Story = {
    name: 'Interactive — Reduced Motion (OS Preference)',
    render: () => <InteractiveStory reducedMotion='always' />,
};

/** #289 — Mobile-only: visible below lg, hidden at lg and wider. */
export const Responsive: Story = {
    name: 'Responsive — Hidden At lg And Wider',
    render: () => <ResponsiveStory />,
};
