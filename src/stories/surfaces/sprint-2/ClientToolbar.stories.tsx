import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Globe,
    Home,
    LogIn,
    LogOut,
    Menu,
    Moon,
    Settings,
    ShoppingCart,
    Sun,
    User,
    UtensilsCrossed,
} from 'lucide-react';
import React, { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Button } from '@/components/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';
import { Separator } from '@/components/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet';

// ---------------------------------------------------------------------------
// Types & fixtures
// ---------------------------------------------------------------------------

interface ClientUser {
    displayName: string;
    email: string;
    avatarUrl?: string;
}

const USER_DEFAULT: ClientUser = {
    displayName: 'Nguyen Thi Lan',
    email: 'lan.nguyen@example.com',
    avatarUrl: '',
};

const USER_LONG_NAME: ClientUser = {
    displayName: 'Bartholomew Alexander Christodoulou-Nguyen',
    email: 'bartholomew.christodoulou-nguyen@verylongexampleemail.com',
    avatarUrl: '',
};

const NAV_LINKS = [
    { label: 'Home', href: '#', icon: Home, active: true },
    { label: 'Menu', href: '#', icon: UtensilsCrossed, active: false },
    { label: 'Orders', href: '#', icon: ShoppingCart, active: false },
];

const CART_COUNT = 3;

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
    return name
        .split(' ')
        .slice(0, 2)
        .map(w => w[0])
        .join('')
        .toUpperCase();
}

// ---------------------------------------------------------------------------
// Desktop Client Toolbar
// ---------------------------------------------------------------------------

interface ClientToolbarDesktopProps {
    user: ClientUser | null;
    cartCount: number;
    dark?: boolean;
}

function ClientToolbarDesktop({ user, cartCount }: ClientToolbarDesktopProps) {
    const [darkMode, setDarkMode] = useState(false);
    const [lang, setLang] = useState<'EN' | 'VI'>('EN');

    return (
        <header className='sticky top-0 z-50 h-16 w-full border-b bg-background'>
            <div className='mx-auto flex h-full max-w-7xl items-center px-6'>
                {/* Left — brand */}
                <div className='flex flex-1 items-center'>
                    <span className='text-primary font-semibold tracking-tight text-lg'>Notism</span>
                </div>

                {/* Center — Nav links */}
                <nav className='flex items-center gap-1'>
                    {NAV_LINKS.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={[
                                'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                                link.active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                            ].join(' ')}
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Right — controls */}
                <div className='flex flex-1 items-center justify-end gap-2'>
                    {/* Cart */}
                    <button
                        aria-label={`Cart, ${cartCount} items`}
                        className='relative flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors'
                    >
                        <ShoppingCart className='h-5 w-5' />
                        {cartCount > 0 && (
                            <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold'>
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Language toggle */}
                    <button
                        aria-label={`Language: ${lang}`}
                        onClick={() => setLang(l => (l === 'EN' ? 'VI' : 'EN'))}
                        className='flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors'
                    >
                        <Globe className='h-4 w-4' />
                        <span>{lang}</span>
                    </button>

                    {/* Theme toggle */}
                    <button
                        aria-label='Toggle theme'
                        onClick={() => setDarkMode(d => !d)}
                        className='flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors'
                    >
                        {darkMode ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
                    </button>

                    {/* User / Login */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    aria-label='User menu'
                                    className='flex items-center gap-2 rounded-full px-2 py-1 hover:bg-accent/50 transition-colors'
                                >
                                    <Avatar className='h-9 w-9 rounded-full'>
                                        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                                        <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                                            {getInitials(user.displayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className='max-w-[140px] truncate text-sm font-medium text-foreground hidden lg:block'>
                                        {user.displayName}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-56'>
                                <DropdownMenuLabel className='font-normal'>
                                    <p className='text-sm font-medium truncate'>{user.displayName}</p>
                                    <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className='mr-2 h-4 w-4' />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <ShoppingCart className='mr-2 h-4 w-4' />
                                    My orders
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className='mr-2 h-4 w-4' />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem variant='destructive'>
                                    <LogOut className='mr-2 h-4 w-4' />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button size='sm' className='gap-2'>
                            <LogIn className='h-4 w-4' />
                            Login
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Mobile Client Bottom Bar
// ---------------------------------------------------------------------------

interface ClientToolbarMobileProps {
    user: ClientUser | null;
    cartCount: number;
}

function ClientToolbarMobile({ user, cartCount }: ClientToolbarMobileProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <>
            {/* Drawer for nav */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side='left' className='w-72 px-0'>
                    <SheetHeader className='px-4 pb-2'>
                        <SheetTitle className='text-primary font-semibold tracking-tight text-lg'>Notism</SheetTitle>
                    </SheetHeader>

                    {user && (
                        <div className='flex items-center gap-3 border-t border-b px-4 py-4 mb-2'>
                            <Avatar className='h-9 w-9 rounded-full shrink-0'>
                                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                                <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                                    {getInitials(user.displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className='min-w-0'>
                                <p className='text-sm font-medium truncate'>{user.displayName}</p>
                                <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                            </div>
                        </div>
                    )}

                    <nav className='flex flex-col gap-1 px-2'>
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setSheetOpen(false)}
                                className={[
                                    'flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors',
                                    link.active
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                                ].join(' ')}
                            >
                                <link.icon className='h-5 w-5 shrink-0' />
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className='mt-auto px-2 pb-4'>
                        <Separator className='mb-4' />
                        {user ? (
                            <button className='flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors'>
                                <LogOut className='h-5 w-5 shrink-0' />
                                Sign out
                            </button>
                        ) : (
                            <Button className='w-full gap-2'>
                                <LogIn className='h-4 w-4' />
                                Login
                            </Button>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Fixed bottom bar */}
            <div className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-2'>
                {/* Menu/hamburger */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <button
                            aria-label='Open navigation menu'
                            className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Menu className='h-6 w-6' />
                            <span className='text-[10px] font-medium'>Menu</span>
                        </button>
                    </SheetTrigger>
                </Sheet>

                {/* Home */}
                <a
                    href='#'
                    aria-label='Home'
                    className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-primary transition-colors'
                >
                    <Home className='h-6 w-6' />
                    <span className='text-[10px] font-medium'>Home</span>
                </a>

                {/* Cart */}
                <button
                    aria-label={`Cart, ${cartCount} items`}
                    className='relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-foreground transition-colors'
                >
                    <div className='relative'>
                        <ShoppingCart className='h-6 w-6' />
                        {cartCount > 0 && (
                            <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-semibold'>
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span className='text-[10px] font-medium'>Cart</span>
                </button>

                {/* Theme toggle */}
                <button
                    aria-label='Toggle theme'
                    onClick={() => setDarkMode(d => !d)}
                    className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-foreground transition-colors'
                >
                    {darkMode ? <Sun className='h-6 w-6' /> : <Moon className='h-6 w-6' />}
                    <span className='text-[10px] font-medium'>Theme</span>
                </button>

                {/* Avatar / Login */}
                {user ? (
                    <button
                        aria-label='User menu'
                        className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 transition-colors'
                    >
                        <Avatar className='h-8 w-8 rounded-full'>
                            {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                            <AvatarFallback className='bg-primary text-primary-foreground text-[10px] font-semibold'>
                                {getInitials(user.displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <span className='max-w-[52px] truncate text-[10px] font-medium text-muted-foreground'>
                            {user.displayName.split(' ')[0]}
                        </span>
                    </button>
                ) : (
                    <button
                        aria-label='Login'
                        className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-primary transition-colors'
                    >
                        <LogIn className='h-6 w-6' />
                        <span className='text-[10px] font-medium'>Login</span>
                    </button>
                )}
            </div>
        </>
    );
}

// ---------------------------------------------------------------------------
// Page shells
// ---------------------------------------------------------------------------

/** Desktop shell — scrollable body, toolbar is sticky top-0 */
function DesktopPageShell({ toolbar, children }: { toolbar: React.ReactNode; children?: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {toolbar}
            <main className='mx-auto max-w-7xl px-6 py-10'>
                {children ?? (
                    <div className='flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                        <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                            page content placeholder
                        </span>
                    </div>
                )}
            </main>
        </div>
    );
}

/** Mobile shell — scrollable body, bar is fixed bottom-0; pb-16 so content clears bar */
function MobilePageShell({ toolbar, children }: { toolbar: React.ReactNode; children?: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto', position: 'relative' }}>
            <main className='px-4 py-6 pb-20'>
                {children ?? (
                    <div className='flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                        <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                            page content placeholder
                        </span>
                    </div>
                )}
            </main>
            {toolbar}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story: Desktop — logged in
// ---------------------------------------------------------------------------

function DesktopStory() {
    return <DesktopPageShell toolbar={<ClientToolbarDesktop user={USER_DEFAULT} cartCount={CART_COUNT} />} />;
}

// ---------------------------------------------------------------------------
// Story: Desktop — logged out
// ---------------------------------------------------------------------------

function DesktopLoggedOutStory() {
    return <DesktopPageShell toolbar={<ClientToolbarDesktop user={null} cartCount={0} />} />;
}

// ---------------------------------------------------------------------------
// Story: Mobile — logged in
// ---------------------------------------------------------------------------

function MobileStory() {
    return <MobilePageShell toolbar={<ClientToolbarMobile user={USER_DEFAULT} cartCount={CART_COUNT} />} />;
}

// ---------------------------------------------------------------------------
// Story: Mobile — long display name
// ---------------------------------------------------------------------------

function MobileLongNameStory() {
    return <MobilePageShell toolbar={<ClientToolbarMobile user={USER_LONG_NAME} cartCount={CART_COUNT} />} />;
}

// ---------------------------------------------------------------------------
// Story: Mobile scroll behaviour — long content, bar stays pinned
// ---------------------------------------------------------------------------

const FILLER_ITEMS = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: `Menu Item ${i + 1}`,
    price: `${(80 + i * 15).toLocaleString()} ₫`,
}));

function MobileScrollBehaviourStory() {
    return (
        <MobilePageShell toolbar={<ClientToolbarMobile user={USER_DEFAULT} cartCount={CART_COUNT} />}>
            <h2 className='mb-4 text-lg font-semibold text-foreground'>Our Menu</h2>
            <p className='mb-6 text-sm text-muted-foreground'>
                Scroll down to verify the bottom navigation bar stays fixed at the bottom of the viewport at all times.
            </p>
            <div className='space-y-3'>
                {FILLER_ITEMS.map(item => (
                    <div
                        key={item.id}
                        className='flex items-center justify-between rounded-xl border bg-card px-4 py-4'
                    >
                        <div className='flex items-center gap-3'>
                            <div className='h-10 w-10 rounded-lg bg-muted flex items-center justify-center'>
                                <UtensilsCrossed className='h-5 w-5 text-muted-foreground/60' />
                            </div>
                            <span className='text-sm font-medium'>{item.name}</span>
                        </div>
                        <span className='text-sm font-semibold text-primary'>{item.price}</span>
                    </div>
                ))}
            </div>
        </MobilePageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 2/Client Toolbar',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
    name: 'Desktop — Logged In',
    render: () => <DesktopStory />,
};

export const DesktopLoggedOut: Story = {
    name: 'Desktop — Logged Out (Login CTA)',
    render: () => <DesktopLoggedOutStory />,
};

export const Mobile: Story = {
    name: 'Mobile — Bottom Bar, Logged In',
    render: () => <MobileStory />,
};

export const MobileLongName: Story = {
    name: 'Mobile — Long Display Name (No Overflow)',
    render: () => <MobileLongNameStory />,
};

export const MobileScrollBehaviour: Story = {
    name: 'Mobile — Scroll Behaviour (Bar Stays Fixed)',
    render: () => <MobileScrollBehaviourStory />,
};
