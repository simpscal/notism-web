import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ArrowRight,
    Clock3,
    Flame,
    Leaf,
    Menu as MenuIcon,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    UtensilsCrossed,
} from 'lucide-react';
import React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/accordion';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { Separator } from '@/components/separator';

// ---------------------------------------------------------------------------
// SURFACE — Landing ("/") restyled to DESIGN_THEME.md (sprint 11, story: landing).
//
// Business functionality is UNCHANGED from src/pages/landing/*. The same
// sections, the same copy, the same flow (marketing landing → sign-up / browse
// foods → ordering) are preserved. Only the VISUALS + UX are re-skinned to the
// theme:
//   • Appetizing, image-forward, food-as-hero — real top-down food photography
//     fills the hero and every card; never flat enterprise/marketing boilerplate.
//   • FULL-BLEED / edge-to-edge — content flows directly on the app's neutral
//     canvas (bg-muted) with sensible page padding. No dark ambient frame, no
//     enclosing floating rounded shell; the pinned toolbar is the one floating
//     rounded element riding above the full-width content.
//   • Heavy, consistent rounding as a signature (pills fully round, cards
//     large-radius, icon buttons circular).
//   • Exactly ONE crimson order-level primary on the page — the hero
//     "Start ordering" CTA that leads into the ordering flow. Every other action
//     (nav, final CTA) is black/idle so no second crimson competes for the tap.
//     Price emphasis is crimson (theme: every price is crimson).
//
// Self-contained: composes ONLY @/components/* + mock fixtures. No react-router,
// no i18n calls, no feature/api/state imports. Copy mirrors the current
// landing's en.json strings verbatim so content is preserved.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mock fixtures — food photography (top-down, image-forward per theme) + copy
// carried over unchanged from the live landing.
// ---------------------------------------------------------------------------

const IMG = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const HERO_DISH = IMG('1546069901-ba9599a7e63c', 1100); // top-down grain & greens bowl

interface MenuPreviewItem {
    name: string;
    note: string;
    price: string;
    image: string;
    tag?: { label: string; icon: React.ComponentType<{ className?: string }> };
}

const MENU_PREVIEW: MenuPreviewItem[] = [
    {
        name: 'Chicken bowl',
        note: '2x spice · extra sauce',
        price: '95,000 ₫',
        image: IMG('1512621776951-a57141f2eefd', 240),
        tag: { label: 'Popular', icon: Flame },
    },
    {
        name: 'Veggie wrap',
        note: 'no onions · add avocado',
        price: '78,000 ₫',
        image: IMG('1490645935967-10de6ba17061', 240),
        tag: { label: 'Fresh', icon: Leaf },
    },
];

const FEATURES = [
    {
        icon: UtensilsCrossed,
        title: 'Curated menu',
        description: 'Carefully selected dishes from the best restaurants',
    },
    { icon: Search, title: 'Smart ordering', description: 'Intuitive menu browsing and customization options' },
    { icon: ShieldCheck, title: 'Secure checkout', description: 'Safe and encrypted payment processing' },
    { icon: Truck, title: 'Track delivery', description: 'Real-time order and delivery tracking' },
] as const;

const FEATURE_IMAGES = [
    IMG('1565299624946-b28f40a0ae38', 480), // pizza
    IMG('1567620905732-2d1ec7ab7445', 480), // pancakes / sweet
    IMG('1568901346375-23c9450c58cd', 480), // burger
    IMG('1540189549336-e6e99c3679fe', 480), // salad
] as const;

const TRUST_POINTS = [
    { icon: ShieldCheck, label: 'Payment security', detail: 'Encrypted, PCI-compliant checkout' },
    { icon: Truck, label: 'Fast delivery', detail: 'Live tracking from kitchen to door' },
    { icon: Star, label: 'Loved by diners', detail: '4.9 average across 12k+ orders' },
] as const;

const FAQ = [
    {
        question: 'How do I start an order?',
        answer: 'Browse our Foods section, select items you like, customize them, and proceed to checkout.',
    },
    {
        question: 'Is payment processing secure?',
        answer: 'Yes, we use industry-standard encryption to protect all payment information.',
    },
    {
        question: 'Can I track my delivery?',
        answer: "Yes, you can track your order in real-time from the moment it's confirmed.",
    },
] as const;

const NAV_LINKS = ['Menu', 'How it works', 'FAQ'] as const;

// ---------------------------------------------------------------------------
// Panel — the middle elevation step. The light-gray shell holds WHITE section
// panels: a single hairline + a faint shadow, large radius. Cards then nest on
// the panel with a hairline and little/no shadow. One gentle step per level.
// ---------------------------------------------------------------------------

function Panel({ className = '', children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={['rounded-3xl border border-border/70 bg-card shadow-sm', className].join(' ')}>{children}</div>
    );
}

// ---------------------------------------------------------------------------
// Top nav — the shared consumer NavBar so the landing chrome matches the rest of
// the client. It is the one floating rounded element: a detached bar inset from
// the canvas edges (margin all around, never full-bleed) that stays pinned as the
// full-width content scrolls beneath it. Brand slot (left), a
// single-select nav region (center), and a trailing actions slot (right). The
// current nav item is expressed as a real navigation selection via NavBarItem
// `active` (aria-current) — never a Button in a selected style. Auth actions stay
// idle (ghost / black), NOT red: the page's single red primary is the hero CTA.
// ---------------------------------------------------------------------------

function TopNav() {
    return (
        <div className='sticky top-3 z-30 px-4 pt-4 sm:px-6'>
            <NavBar className='mx-auto max-w-6xl bg-card/90 backdrop-blur-md'>
                <NavBarBrand>
                    <span className='flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                        <UtensilsCrossed className='size-4' />
                    </span>
                    <span className='text-lg font-semibold tracking-tight text-primary'>Notism</span>
                </NavBarBrand>

                <NavBarNav className='hidden flex-1 justify-center md:flex'>
                    {NAV_LINKS.map((label, i) => (
                        <NavBarItem key={label} asChild active={i === 0}>
                            <a href='#'>{label}</a>
                        </NavBarItem>
                    ))}
                </NavBarNav>

                <NavBarActions>
                    <Button
                        variant='ghost'
                        size='icon-sm'
                        aria-label='Search'
                        className='hidden text-muted-foreground sm:inline-flex'
                    >
                        <Search className='size-4' />
                    </Button>
                    <Button variant='ghost' size='sm' className='hidden rounded-full sm:inline-flex'>
                        Log in
                    </Button>
                    <Button size='sm' className='rounded-full'>
                        Sign up
                    </Button>
                </NavBarActions>
            </NavBar>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Hero — food-as-hero. Large top-down dish image + the ONE crimson primary
// ("Start ordering" → the ordering flow). A live-menu preview card overlaps the
// image for depth; prices in the preview are crimson (theme: every price crimson).
// ---------------------------------------------------------------------------

function Hero() {
    return (
        <section className='px-4 pt-6 sm:px-6'>
            <Panel className='relative mx-auto max-w-6xl overflow-hidden px-6 pb-12 pt-10 sm:px-10 sm:pb-14 sm:pt-12'>
                {/* soft neutral glow behind the hero — decorative chrome, never red */}
                <div
                    aria-hidden
                    className='pointer-events-none absolute -right-24 -top-24 -z-10 size-[32rem] rounded-full bg-foreground/[0.03] blur-3xl'
                />
                <div className='grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]'>
                    <div className='space-y-6'>
                        <Badge variant='secondary' className='gap-2 rounded-full py-1.5 pl-2 pr-3.5'>
                            <span className='flex size-5 items-center justify-center rounded-full bg-foreground/10'>
                                <Sparkles className='size-3 text-foreground' />
                            </span>
                            <span className='text-xs font-medium'>Fresh meals, fast checkout</span>
                        </Badge>

                        <h1 className='text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
                            Order fresh food
                            <br />
                            in&nbsp;minutes
                        </h1>

                        <p className='max-w-md text-base leading-relaxed text-muted-foreground'>
                            Browse menus, customize your order, and track delivery in real time.
                        </p>

                        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                            {/* THE single crimson order-level primary for the whole page. */}
                            <Button size='lg' className='h-12 rounded-full px-7 text-base shadow-sm'>
                                Start ordering
                                <ArrowRight className='size-4' />
                            </Button>
                            <Button variant='outline' size='lg' className='h-12 rounded-full px-6 text-base'>
                                Explore foods
                            </Button>
                        </div>

                        <div className='flex flex-wrap items-center gap-x-6 gap-y-2 pt-1'>
                            <span className='inline-flex items-center gap-2 text-sm text-muted-foreground'>
                                <ShieldCheck className='size-4 text-foreground' />
                                <span className='font-medium text-foreground'>Secure checkout</span>
                            </span>
                            <span className='inline-flex items-center gap-2 text-sm text-muted-foreground'>
                                <Truck className='size-4 text-foreground' />
                                <span className='font-medium text-foreground'>Fast delivery</span>
                            </span>
                        </div>
                    </div>

                    {/* Food-as-hero image with an overlapping live-menu preview card */}
                    <div className='relative mx-auto w-full max-w-md'>
                        <div className='overflow-hidden rounded-3xl border border-border/60 shadow-sm'>
                            <img
                                src={HERO_DISH}
                                alt='Fresh grain and greens bowl, top down'
                                className='aspect-[4/5] w-full object-cover'
                            />
                        </div>

                        <Card className='absolute -bottom-6 -left-4 w-64 gap-0 rounded-3xl border-border/60 p-3 shadow-sm sm:-left-8'>
                            <div className='flex items-center justify-between rounded-2xl bg-secondary px-3 py-2'>
                                <span className='inline-flex items-center gap-2 text-xs font-medium'>
                                    <span className='size-2 rounded-full bg-success' />
                                    Live menu
                                </span>
                                <span className='text-xs text-muted-foreground'>Now</span>
                            </div>
                            <div className='mt-3 space-y-2'>
                                {MENU_PREVIEW.map(item => (
                                    <div key={item.name} className='flex items-center gap-3 rounded-2xl border p-2'>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className='size-11 shrink-0 rounded-full object-cover'
                                        />
                                        <div className='min-w-0 flex-1'>
                                            <div className='truncate text-sm font-semibold text-foreground'>
                                                {item.name}
                                            </div>
                                            <div className='truncate text-xs text-muted-foreground'>{item.note}</div>
                                        </div>
                                        <span className='text-sm font-semibold text-primary'>{item.price}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </Panel>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Trust — "Built for trust". Re-skinned as an image-forward, rounded card (was
// the OrderCheckoutTrustBar block); content preserved.
// ---------------------------------------------------------------------------

function TrustSection() {
    return (
        <section className='px-4 py-4 sm:px-6'>
            <div className='mx-auto max-w-6xl'>
                <Card className='overflow-hidden rounded-3xl border-border/60 p-0'>
                    <div className='grid gap-0 lg:grid-cols-[1.1fr_1fr]'>
                        <div className='space-y-4 p-7 sm:p-9'>
                            <p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                                Why Notism
                            </p>
                            <h2 className='text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
                                Built for trust
                            </h2>
                            <p className='max-w-md text-sm leading-relaxed text-muted-foreground'>
                                Payment security, fast delivery, and real customer confidence.
                            </p>
                            <Separator />
                            <div className='space-y-3'>
                                {TRUST_POINTS.map(point => {
                                    const Icon = point.icon;
                                    return (
                                        <div key={point.label} className='flex items-center gap-3'>
                                            <span className='flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground'>
                                                <Icon className='size-5' />
                                            </span>
                                            <div>
                                                <div className='text-sm font-semibold text-foreground'>
                                                    {point.label}
                                                </div>
                                                <div className='text-xs text-muted-foreground'>{point.detail}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className='text-xs text-muted-foreground'>
                                Tip: you can head to Foods anytime and start an order flow from there.
                            </p>
                        </div>

                        <div className='relative min-h-56'>
                            <img
                                src={IMG('1504674900247-0877df9cc836', 900)}
                                alt='Assorted fresh dishes served on a table, top down'
                                className='absolute inset-0 size-full object-cover'
                            />
                            <div className='absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 shadow-sm backdrop-blur'>
                                <Star className='size-4 fill-foreground text-foreground' />
                                <span className='text-sm font-semibold text-foreground'>4.9</span>
                                <span className='text-xs text-muted-foreground'>· 12k+ orders</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Features — image-forward cards (theme: card grid, food-as-hero); the four
// feature titles/descriptions are unchanged from the live landing.
// ---------------------------------------------------------------------------

function FeaturesSection() {
    return (
        <section className='px-4 py-4 sm:px-6'>
            <Panel className='mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-12'>
                <div className='mx-auto max-w-xl text-center'>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
                        How it works
                    </p>
                    <h2 className='mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
                        Everything you need to order
                    </h2>
                    <p className='mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground'>
                        A clean flow from browsing to checkout, designed to be fast and easy.
                    </p>
                </div>

                <div className='mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                    {FEATURES.map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={feature.title}
                                className='group gap-0 overflow-hidden rounded-3xl border-border/60 p-0 shadow-none transition-shadow hover:shadow-sm'
                            >
                                <div className='relative'>
                                    <img
                                        src={FEATURE_IMAGES[i]}
                                        alt={feature.title}
                                        className='aspect-[4/3] w-full object-cover'
                                    />
                                    <span className='absolute left-3 top-3 flex size-10 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur'>
                                        <Icon className='size-5' />
                                    </span>
                                </div>
                                <div className='space-y-1 p-5'>
                                    <div className='text-sm font-semibold text-foreground'>{feature.title}</div>
                                    <p className='text-xs leading-relaxed text-muted-foreground'>
                                        {feature.description}
                                    </p>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </Panel>
        </section>
    );
}

// ---------------------------------------------------------------------------
// FAQ — Accordion (inventory), same three Q&As as the live landing.
// ---------------------------------------------------------------------------

function FaqSection() {
    return (
        <section className='px-4 py-8 sm:px-6'>
            <div className='mx-auto max-w-3xl'>
                <div className='text-center'>
                    <p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>FAQ</p>
                    <h2 className='mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl'>
                        Frequently asked questions
                    </h2>
                    <p className='mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground'>
                        Quick answers about ordering, delivery, and checkout.
                    </p>
                </div>

                <Card className='mt-8 rounded-3xl border-border/60 px-6 py-2'>
                    <Accordion type='single' collapsible defaultValue='item-0' className='w-full'>
                        {FAQ.map((item, i) => (
                            <AccordionItem key={item.question} value={`item-${i}`}>
                                <AccordionTrigger className='text-left text-sm font-semibold'>
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className='text-sm text-muted-foreground'>
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </Card>
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Final CTA — "Ready to order?". Food-forward banner. The action here is BLACK
// (selected), not crimson: the page keeps exactly one crimson primary (the hero
// "Start ordering"), so nothing competes for the tap. Content preserved.
// ---------------------------------------------------------------------------

function FinalCta() {
    return (
        <section className='px-4 py-8 sm:px-6'>
            <div className='mx-auto max-w-6xl'>
                <Card className='relative overflow-hidden rounded-3xl border-0 p-0'>
                    <img
                        src={IMG('1565958011703-44f9829ba187', 1400)}
                        alt='Burger and sides, top down'
                        className='absolute inset-0 size-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/70 to-neutral-950/30' />
                    <div className='relative flex flex-col gap-6 p-8 sm:p-12 md:flex-row md:items-center md:justify-between'>
                        <div className='space-y-2'>
                            <h2 className='text-2xl font-semibold tracking-tight text-white sm:text-3xl'>
                                Ready to order?
                            </h2>
                            <p className='max-w-md text-sm leading-relaxed text-white/80'>
                                Join thousands of satisfied customers
                            </p>
                        </div>
                        <div className='flex flex-col gap-3 sm:flex-row'>
                            <Button size='lg' className='h-12 rounded-full px-7 text-base'>
                                Sign up
                            </Button>
                            <Button
                                variant='outline'
                                size='lg'
                                className='h-12 rounded-full border-white/40 bg-white/10 px-6 text-base text-white hover:bg-white/20 hover:text-white'
                            >
                                Browse foods
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Footer — unchanged content, re-skinned.
// ---------------------------------------------------------------------------

function LandingFooter() {
    return (
        <footer className='px-4 pb-2 pt-8 sm:px-6'>
            <div className='mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between'>
                <div className='flex items-center gap-2'>
                    <span className='flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                        <UtensilsCrossed className='size-3' />
                    </span>
                    <span className='text-xs text-muted-foreground'>© 2026 Notism. All rights reserved.</span>
                </div>
                <div className='flex items-center gap-5 text-xs'>
                    <a href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                        Foods
                    </a>
                    <a href='#' className='text-muted-foreground transition-colors hover:text-foreground'>
                        Log in
                    </a>
                </div>
            </div>
        </footer>
    );
}

// ---------------------------------------------------------------------------
// Mobile bottom bar — the live landing's bottom toolbar, re-cast as a floating
// rounded bar (condensed, never full-bleed): brand + single action + menu. The
// action is idle black, not crimson.
// ---------------------------------------------------------------------------

function MobileBottomBar() {
    return (
        <div className='sticky bottom-3 z-30 px-3 pb-1'>
            <div className='mx-auto flex h-14 items-center justify-between rounded-full border border-border/70 bg-card/90 pl-4 pr-2 shadow-sm backdrop-blur'>
                <span className='text-base font-semibold tracking-tight text-primary'>Notism</span>
                <div className='flex items-center gap-2'>
                    <Button size='sm' className='rounded-full'>
                        Log in
                    </Button>
                    <button
                        aria-label='Open navigation menu'
                        className='flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground'
                    >
                        <MenuIcon className='size-5' />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// App canvas — FULL-BLEED. Content flows edge-to-edge directly on the app's
// neutral canvas (bg-muted): no dark ambient frame, no enclosing floating
// rounded shell. Sections keep their own centered max-width + page padding, and
// the toolbar is the one floating rounded element pinned above the full-width
// content. The page scrolls as one clean column (document scroll).
// ---------------------------------------------------------------------------

function AppCanvas({ children }: { children: React.ReactNode }) {
    return <div className='min-h-screen w-full bg-muted pb-4'>{children}</div>;
}

// ---------------------------------------------------------------------------
// Full page compositions
// ---------------------------------------------------------------------------

function LandingDesktop() {
    return (
        <AppCanvas>
            <TopNav />
            <main>
                <Hero />
                <TrustSection />
                <FeaturesSection />
                <FaqSection />
                <FinalCta />
                <LandingFooter />
            </main>
        </AppCanvas>
    );
}

function LandingMobile() {
    return (
        <AppCanvas>
            <div className='flex min-h-screen flex-col'>
                {/* Floating condensed consumer NavBar — never full-bleed on mobile. */}
                <div className='sticky top-2 z-30 px-3 pt-3'>
                    <NavBar className='mx-auto h-14 bg-card/90 backdrop-blur'>
                        <NavBarBrand>
                            <span className='flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                                <UtensilsCrossed className='size-3.5' />
                            </span>
                            <span className='text-base font-semibold tracking-tight text-primary'>Notism</span>
                        </NavBarBrand>
                        <NavBarActions>
                            <span className='inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground'>
                                <Clock3 className='size-3.5' />
                                Open now
                            </span>
                        </NavBarActions>
                    </NavBar>
                </div>

                <main className='flex-1'>
                    <Hero />
                    <TrustSection />
                    <FeaturesSection />
                    <FaqSection />
                    <FinalCta />
                    <LandingFooter />
                </main>

                <MobileBottomBar />
            </div>
        </AppCanvas>
    );
}

// ---------------------------------------------------------------------------
// Meta + stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Landing',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default (desktop) — the full landing page full-bleed on the app's neutral
 * canvas (bg-muted): no dark ambient frame, no enclosing floating shell, just
 * the pinned floating toolbar riding above edge-to-edge content. Food-as-hero
 * imagery throughout; exactly one crimson order-level primary ("Start ordering")
 * leading into the ordering flow; every other action is idle/black. All original
 * sections and copy preserved.
 */
export const Desktop: Story = {
    render: () => <LandingDesktop />,
};

/**
 * Mobile — the same landing, full-bleed within the small viewport: content runs
 * edge-to-edge on the app canvas (no frame, no enclosing shell) with a compact
 * floating top bar, single-column stacked sections, and the floating bottom
 * action bar from the live landing. Still exactly one crimson primary (the hero
 * CTA).
 */
export const Mobile: Story = {
    parameters: {
        viewport: { defaultViewport: 'mobile1' },
    },
    render: () => <LandingMobile />,
};
