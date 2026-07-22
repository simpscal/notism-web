import type { Meta, StoryObj } from '@storybook/react-vite';
import { Menu, UtensilsCrossed, X } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/uis/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/uis/sheet';

// ---------------------------------------------------------------------------
// Shared placeholder block
// ---------------------------------------------------------------------------

function Placeholder({ label, height = 'h-48' }: { label: string; height?: string }) {
    return (
        <div className={`flex ${height} items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/20`}>
            <div className='h-px w-6 bg-muted-foreground/30' />
            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>{label}</span>
            <div className='h-px w-6 bg-muted-foreground/30' />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LandingToolbarProps {
    isAuthenticated?: boolean;
}

const NAV_LINKS = [
    { label: 'Menu', href: '#' },
    { label: 'How it works', href: '#' },
    { label: 'FAQ', href: '#' },
];

// ---------------------------------------------------------------------------
// Desktop Landing Toolbar
// ---------------------------------------------------------------------------

function LandingToolbarDesktop({ isAuthenticated = false }: LandingToolbarProps) {
    return (
        <header className='sticky top-0 z-50 h-16 w-full border-b bg-background/90 backdrop-blur'>
            <div className='mx-auto flex h-full max-w-7xl items-center px-6'>
                {/* Left — brand */}
                <div className='flex flex-1 items-center'>
                    <span className='text-lg font-semibold text-primary tracking-tight'>Notism</span>
                </div>

                {/* Center — nav */}
                <nav className='flex items-center gap-1'>
                    {NAV_LINKS.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            className='rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground'
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Right — CTA */}
                <div className='flex flex-1 items-center justify-end gap-2'>
                    {isAuthenticated ? (
                        <Button size='sm' className='rounded-full'>
                            <UtensilsCrossed className='mr-1.5 h-4 w-4' />
                            Browse menu
                        </Button>
                    ) : (
                        <>
                            <Button variant='ghost' size='sm' className='rounded-full'>
                                Sign up
                            </Button>
                            <Button size='sm' className='rounded-full'>
                                Log in
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Mobile Landing Toolbar (bottom bar)
// ---------------------------------------------------------------------------

function LandingToolbarMobile({ isAuthenticated = false }: LandingToolbarProps) {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <>
            {/* Nav sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side='left' className='w-72 px-0'>
                    <SheetHeader className='px-4 pb-2'>
                        <SheetTitle className='text-primary font-semibold tracking-tight text-lg'>Notism</SheetTitle>
                    </SheetHeader>

                    <nav className='flex flex-col gap-1 px-2 mt-2'>
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setSheetOpen(false)}
                                className='flex items-center gap-3 rounded-full px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground'
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    <div className='mt-4 border-t px-4 pt-4 space-y-2'>
                        {isAuthenticated ? (
                            <Button className='w-full rounded-full gap-2'>
                                <UtensilsCrossed className='h-4 w-4' />
                                Browse menu
                            </Button>
                        ) : (
                            <>
                                <Button variant='outline' className='w-full rounded-full'>
                                    Sign up
                                </Button>
                                <Button className='w-full rounded-full'>Log in</Button>
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Fixed bottom bar */}
            <div className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t bg-background/90 backdrop-blur px-4'>
                {/* Brand */}
                <span className='text-base font-semibold text-primary tracking-tight'>Notism</span>

                {/* Right — CTA + hamburger */}
                <div className='flex items-center gap-2'>
                    {isAuthenticated ? (
                        <Button size='sm' className='rounded-full'>
                            <UtensilsCrossed className='mr-1.5 h-4 w-4' />
                            Browse
                        </Button>
                    ) : (
                        <Button size='sm' className='rounded-full'>
                            Log in
                        </Button>
                    )}

                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <button
                                aria-label='Open navigation menu'
                                className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground'
                            >
                                {sheetOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                            </button>
                        </SheetTrigger>
                    </Sheet>
                </div>
            </div>
        </>
    );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

function DesktopPageShell({ toolbar, children }: { toolbar: React.ReactNode; children?: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {toolbar}
            <main className='mx-auto max-w-7xl px-6 py-10 space-y-4'>
                {children ?? (
                    <>
                        <Placeholder label='hero section' height='h-64' />
                        <Placeholder label='features section' height='h-48' />
                        <Placeholder label='cta section' height='h-32' />
                    </>
                )}
            </main>
        </div>
    );
}

function MobilePageShell({ toolbar, children }: { toolbar: React.ReactNode; children?: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto', position: 'relative' }}>
            <main className='px-4 py-6 pb-20 space-y-4'>
                {children ?? (
                    <>
                        <Placeholder label='hero section' height='h-48' />
                        <Placeholder label='features section' height='h-40' />
                        <Placeholder label='cta section' height='h-28' />
                    </>
                )}
            </main>
            {toolbar}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story components
// ---------------------------------------------------------------------------

function DesktopGuestStory() {
    return <DesktopPageShell toolbar={<LandingToolbarDesktop isAuthenticated={false} />} />;
}

function DesktopAuthenticatedStory() {
    return <DesktopPageShell toolbar={<LandingToolbarDesktop isAuthenticated={true} />} />;
}

function MobileGuestStory() {
    return <MobilePageShell toolbar={<LandingToolbarMobile isAuthenticated={false} />} />;
}

function MobileAuthenticatedStory() {
    return <MobilePageShell toolbar={<LandingToolbarMobile isAuthenticated={true} />} />;
}

const SCROLL_PLACEHOLDERS = ['hero section', 'features section', 'how it works', 'testimonials', 'faq', 'cta section'];

function MobileScrollBehaviourStory() {
    return (
        <MobilePageShell toolbar={<LandingToolbarMobile isAuthenticated={false} />}>
            {SCROLL_PLACEHOLDERS.map(label => (
                <Placeholder key={label} label={label} height='h-40' />
            ))}
        </MobilePageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 2/Landing Toolbar',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopGuest: Story = {
    name: 'Desktop — Guest (Sign up + Log in)',
    render: () => <DesktopGuestStory />,
};

export const DesktopAuthenticated: Story = {
    name: 'Desktop — Authenticated (Browse CTA)',
    render: () => <DesktopAuthenticatedStory />,
};

export const MobileGuest: Story = {
    name: 'Mobile — Guest, Bottom Bar',
    render: () => <MobileGuestStory />,
};

export const MobileAuthenticated: Story = {
    name: 'Mobile — Authenticated, Browse CTA',
    render: () => <MobileAuthenticatedStory />,
};

export const MobileScrollBehaviour: Story = {
    name: 'Mobile — Scroll Behaviour (Bar Stays Fixed)',
    render: () => <MobileScrollBehaviourStory />,
};
