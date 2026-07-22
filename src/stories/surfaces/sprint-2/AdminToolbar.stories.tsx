import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ChefHat,
    FolderOpen,
    LayoutDashboard,
    LogIn,
    LogOut,
    Menu,
    Moon,
    Settings,
    ShoppingBag,
    Sun,
    User,
    Users,
} from 'lucide-react';
import React, { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/uis/avatar';
import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/uis/dropdown-menu';
import { Separator } from '@/uis/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/uis/sheet';

// ---------------------------------------------------------------------------
// Types & fixtures
// ---------------------------------------------------------------------------

interface AdminUser {
    displayName: string;
    email: string;
    role: string;
    avatarUrl?: string;
}

const USER_DEFAULT: AdminUser = {
    displayName: 'Tran Van Minh',
    email: 'minh.tran@notism-admin.com',
    role: 'Super Admin',
    avatarUrl: '',
};

const USER_LONG_NAME: AdminUser = {
    displayName: 'Konstantinos Papadimitriou-Stavropoulos',
    email: 'konstantinos.papadimitriou@verylongadmindomain.enterprise.example.com',
    role: 'Restaurant Operations Manager & Head Coordinator',
    avatarUrl: '',
};

const NAV_LINKS = [
    { label: 'Dashboard', href: '#', icon: LayoutDashboard, active: true },
    { label: 'Orders', href: '#', icon: ShoppingBag, active: false },
    { label: 'Foods', href: '#', icon: ChefHat, active: false },
    { label: 'Categories', href: '#', icon: FolderOpen, active: false },
    { label: 'Users', href: '#', icon: Users, active: false },
];

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
// Desktop Admin Toolbar
// ---------------------------------------------------------------------------

interface AdminToolbarDesktopProps {
    user: AdminUser | null;
}

function AdminToolbarDesktop({ user }: AdminToolbarDesktopProps) {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <header className='sticky top-0 z-50 h-16 w-full border-b bg-background'>
            <div className='mx-auto flex h-full max-w-7xl items-center px-6'>
                {/* Left — brand */}
                <div className='flex flex-1 items-center gap-2'>
                    <span className='text-primary font-semibold tracking-tight text-lg'>Notism</span>
                    <Badge
                        variant='secondary'
                        className='text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0'
                    >
                        Admin
                    </Badge>
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
                                    aria-label='Admin user menu'
                                    className='flex items-center gap-2 rounded-full px-2 py-1 hover:bg-accent/50 transition-colors'
                                >
                                    <Avatar className='h-9 w-9 rounded-full'>
                                        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                                        <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                                            {getInitials(user.displayName)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className='hidden lg:block text-left min-w-0 max-w-[160px]'>
                                        <p className='text-sm font-medium truncate leading-none mb-0.5'>
                                            {user.displayName}
                                        </p>
                                        <p className='text-[10px] text-muted-foreground truncate leading-none'>
                                            {user.role}
                                        </p>
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-60'>
                                <DropdownMenuLabel className='font-normal'>
                                    <p className='text-sm font-medium truncate'>{user.displayName}</p>
                                    <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                                    <p className='mt-0.5 text-xs text-primary font-medium truncate'>{user.role}</p>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <User className='mr-2 h-4 w-4' />
                                    My profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className='mr-2 h-4 w-4' />
                                    System settings
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
// Mobile Admin Bottom Bar
// ---------------------------------------------------------------------------

interface AdminToolbarMobileProps {
    user: AdminUser | null;
}

function AdminToolbarMobile({ user }: AdminToolbarMobileProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    return (
        <>
            {/* Drawer for nav */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side='left' className='w-72 px-0'>
                    <SheetHeader className='px-4 pb-2'>
                        <div className='flex items-center gap-2'>
                            <SheetTitle className='text-primary font-semibold tracking-tight text-lg'>
                                Notism
                            </SheetTitle>
                            <Badge
                                variant='secondary'
                                className='text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0'
                            >
                                Admin
                            </Badge>
                        </div>
                    </SheetHeader>

                    {user && (
                        <div className='flex items-start gap-3 border-t border-b px-4 py-4 mb-2'>
                            <Avatar className='h-9 w-9 rounded-full shrink-0 mt-0.5'>
                                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName} />}
                                <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                                    {getInitials(user.displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className='min-w-0'>
                                <p className='text-sm font-medium truncate'>{user.displayName}</p>
                                <p className='text-xs text-muted-foreground truncate'>{user.email}</p>
                                <p className='mt-0.5 text-xs text-primary font-medium truncate'>{user.role}</p>
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
                {/* Hamburger / nav */}
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <button
                            aria-label='Open admin navigation'
                            className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-foreground transition-colors'
                        >
                            <Menu className='h-6 w-6' />
                            <span className='text-[10px] font-medium'>Nav</span>
                        </button>
                    </SheetTrigger>
                </Sheet>

                {/* Dashboard shortcut */}
                <a
                    href='#'
                    aria-label='Dashboard'
                    className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-primary transition-colors'
                >
                    <LayoutDashboard className='h-6 w-6' />
                    <span className='text-[10px] font-medium'>Dashboard</span>
                </a>

                {/* Orders shortcut */}
                <a
                    href='#'
                    aria-label='Orders'
                    className='flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-md px-1 text-muted-foreground hover:text-foreground transition-colors'
                >
                    <ShoppingBag className='h-6 w-6' />
                    <span className='text-[10px] font-medium'>Orders</span>
                </a>

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
                        aria-label='Admin user menu'
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

/** Desktop shell — scrollable body, toolbar sticky top-0 */
function DesktopPageShell({ toolbar, children }: { toolbar: React.ReactNode; children?: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {toolbar}
            <main className='mx-auto max-w-7xl px-6 py-10'>
                {children ?? (
                    <div className='flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                        <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                            admin page content placeholder
                        </span>
                    </div>
                )}
            </main>
        </div>
    );
}

/** Mobile shell — scrollable body, bar fixed bottom-0; pb-20 so content clears bar */
function MobilePageShell({ toolbar, children }: { toolbar: React.ReactNode; children?: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto', position: 'relative' }}>
            <main className='px-4 py-6 pb-20'>
                {children ?? (
                    <div className='flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                        <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                            admin page content placeholder
                        </span>
                    </div>
                )}
            </main>
            {toolbar}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story components
// ---------------------------------------------------------------------------

function DesktopStory() {
    return <DesktopPageShell toolbar={<AdminToolbarDesktop user={USER_DEFAULT} />} />;
}

function DesktopLoggedOutStory() {
    return <DesktopPageShell toolbar={<AdminToolbarDesktop user={null} />} />;
}

function MobileStory() {
    return <MobilePageShell toolbar={<AdminToolbarMobile user={USER_DEFAULT} />} />;
}

function MobileLongNameStory() {
    return <MobilePageShell toolbar={<AdminToolbarMobile user={USER_LONG_NAME} />} />;
}

const ADMIN_TABLE_ROWS = Array.from({ length: 14 }, (_, i) => ({
    id: `ORD-${1000 + i}`,
    customer: `Customer ${i + 1}`,
    total: `${(95 + i * 22).toLocaleString()} ₫`,
    status: i % 3 === 0 ? 'Pending' : i % 3 === 1 ? 'Processing' : 'Delivered',
}));

function MobileScrollBehaviourStory() {
    return (
        <MobilePageShell toolbar={<AdminToolbarMobile user={USER_DEFAULT} />}>
            <h2 className='mb-4 text-lg font-semibold text-foreground'>Recent Orders</h2>
            <p className='mb-6 text-sm text-muted-foreground'>
                Scroll down to verify the admin bottom bar remains fixed at the bottom of the viewport while scrolling.
            </p>
            <div className='space-y-2'>
                {ADMIN_TABLE_ROWS.map(row => (
                    <div key={row.id} className='flex items-center justify-between rounded-xl border bg-card px-4 py-3'>
                        <div>
                            <p className='text-sm font-semibold text-foreground'>{row.id}</p>
                            <p className='text-xs text-muted-foreground'>{row.customer}</p>
                        </div>
                        <div className='text-right'>
                            <p className='text-sm font-semibold text-primary'>{row.total}</p>
                            <p
                                className={[
                                    'text-xs font-medium',
                                    row.status === 'Pending'
                                        ? 'text-warning'
                                        : row.status === 'Processing'
                                          ? 'text-info'
                                          : 'text-success',
                                ].join(' ')}
                            >
                                {row.status}
                            </p>
                        </div>
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
    title: 'Surfaces/Sprint 2/Admin Toolbar',
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
    name: 'Mobile — Long Username & Role (No Overflow)',
    render: () => <MobileLongNameStory />,
};

export const MobileScrollBehaviour: Story = {
    name: 'Mobile — Scroll Behaviour (Bar Stays Fixed)',
    render: () => <MobileScrollBehaviourStory />,
};
