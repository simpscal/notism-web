import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ArrowRight,
    Heart,
    LifeBuoy,
    Minus,
    Plus,
    ReceiptText,
    Search,
    ShoppingBag,
    Soup,
    Ticket,
    Trash2,
    UtensilsCrossed,
    X,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/alert-dialog';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/card';
import { Checkbox } from '@/components/checkbox';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { Toaster } from '@/components/sonner';

// ---------------------------------------------------------------------------
// Surface — CartReview (/cart), Sprint 11.
//
// RESTYLE ONLY: business functionality is unchanged from src/pages/cart/. The
// current cart's flow is preserved verbatim — per-line selection, circular
// −/+ quantity steppers (decrement below 1 removes the line), remove-with-
// confirm, an order summary that totals the SELECTED lines, and the single
// "Proceed to payment" action. This story only re-skins those to
// DESIGN_THEME.md; it adds/removes no steps.
//
// Theme application (DESIGN_THEME.md):
//   • Elevation — soft and minimal, one gentle step per level: dark ambient
//     frame → ONE large-radius light-gray shell → white panels (hairline,
//     faint shadow) → white line cards (hairline, no shadow). No heavy rings.
//   • Toolbar — the shared domain-blind NavBar (consumer variant): a real
//     floating rounded bar pinned to the top of the shell (margin all around,
//     never full-bleed): brand left, icon+label nav in the centre (active = a
//     real navigation selection via NavBarItem's aria-current — a white pill +
//     crimson icon/label, never a Button in a selected style), search + crimson
//     Cart pill right. Condenses on mobile, staying a rounded floating bar.
//   • Scrolling — the shell fills the viewport; the toolbar is pinned and the
//     cart body scrolls within the shell (single scrollbar, no clipping).
//   • Color roles — every line price and the running total read in CRIMSON;
//     item-level + selection controls (steppers, checkbox) read BLACK; exactly
//     ONE crimson order-level action in the cart body ("Proceed to payment").
//   • Steppers — circular −/+ buttons flanking the count, item-level only.
//   • Destructive — Remove sits APART from the primary (per-line, top-right,
//     far from the summary CTA) and requires an EXPLICIT confirm (AlertDialog).
//
// Placeholder rule — only the cart-review area (order lines + order summary /
// checkout + empty state) and the toolbar the reference introduces are
// implemented. Surrounding regions the requirement does NOT change — trust bar,
// checkout progress — remain low-emphasis labelled placeholders.
//
// Mock-only fixtures + local state harness. No api / model / store / page /
// util imports — only @/components/* + a local money formatter.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shape (mock only — mirrors the fields src/pages/cart renders)
// ---------------------------------------------------------------------------

interface CartLine {
    id: string;
    name: string;
    description: string;
    category: string;
    unit: string;
    imageUrl: string;
    /** Effective unit price incl. surcharges, in đồng. */
    unitPrice: number;
    quantity: number;
    stock: number;
    selected: boolean;
}

// Local money formatter — stands in for the app's formatVnd so the story stays
// self-contained (no cross-layer util import).
const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`;

// ---------------------------------------------------------------------------
// Fixtures — realistic Vietnamese-menu lines matching the cart's data shape.
// ---------------------------------------------------------------------------

const LINES: CartLine[] = [
    {
        id: 'line-1',
        name: 'Phở bò tái',
        description: 'Rare beef, rice noodles, star-anise broth',
        category: 'Noodles',
        unit: 'Bowl',
        imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=200&h=200&fit=crop',
        unitPrice: 85000,
        quantity: 2,
        stock: 12,
        selected: true,
    },
    {
        id: 'line-2',
        name: 'Gỏi cuốn tôm',
        description: 'Fresh shrimp spring rolls, peanut hoisin dip',
        category: 'Starters',
        unit: 'Plate',
        imageUrl: 'https://images.unsplash.com/photo-1625938146369-2fefeb0d9a25?w=200&h=200&fit=crop',
        unitPrice: 65000,
        quantity: 1,
        stock: 8,
        selected: true,
    },
    {
        id: 'line-3',
        name: 'Cà phê sữa đá',
        description: 'Iced Vietnamese coffee, condensed milk',
        category: 'Drinks',
        unit: 'Cup',
        imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
        unitPrice: 35000,
        quantity: 1,
        stock: 20,
        selected: false,
    },
];

// ---------------------------------------------------------------------------
// App shell — the ambient frame fills the viewport; ONE large-radius light-gray
// shell sits on it and fills the frame. The toolbar is pinned at the top of the
// shell; only the body below scrolls, so there is a single scrollbar and no
// clipping. Elevation climbs one gentle step at a time (frame → shell → panels
// → cards); no heavy shadows or rings.
// ---------------------------------------------------------------------------

function AppShell({ cartCount, children }: { cartCount: number; children: React.ReactNode }) {
    return (
        <div className='flex h-screen flex-col bg-frame p-3 sm:p-5'>
            {/* Decorative line-art motif — behind the shell, never carries content. */}
            <div
                aria-hidden
                className='pointer-events-none fixed inset-0 opacity-[0.05]'
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
                    backgroundSize: '48px 48px, 64px 64px',
                }}
            />
            <div className='relative mx-auto flex h-full w-full min-h-0 max-w-7xl flex-col overflow-hidden rounded-[2.5rem] bg-muted shadow-xl'>
                <Toolbar cartCount={cartCount} />
                {/* The only scroll region — the toolbar above stays pinned. */}
                <div className='min-h-0 flex-1 overflow-y-auto'>{children}</div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Floating rounded toolbar — the shared domain-blind NavBar (consumer variant):
// a large-radius rounded bar that FLOATS inside the shell (margin all around via
// the wrapper padding; never full-bleed). Brand slot left · nav-items region
// centre (the active tab is a real navigation selection — a white pill + crimson
// icon/label via NavBarItem's aria-current, never a Button in a selected style) ·
// actions slot right (search + crimson Cart pill). Condenses on mobile, staying a
// rounded floating bar.
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
    { label: 'Menu', icon: UtensilsCrossed, active: true },
    { label: 'Orders', icon: ReceiptText, active: false },
    { label: 'Favorites', icon: Heart, active: false },
    { label: 'Help', icon: LifeBuoy, active: false },
];

function Toolbar({ cartCount }: { cartCount: number }) {
    return (
        <NavBar className='z-40 m-3 shrink-0 gap-3 bg-card/95 backdrop-blur sm:m-4'>
            {/* Brand — mark + wordmark carry the accent RED as identity (theme §2); nav/Cart pills stay black. */}
            <NavBarBrand className='pl-1 pr-1 sm:pr-2'>
                <span className='flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                    <Soup className='size-5' aria-hidden />
                </span>
                <span className='hidden text-lg font-black tracking-tight text-primary sm:inline'>Notism</span>
            </NavBarBrand>

            {/* Nav — centre, desktop only. Active item = a real navigation selection. */}
            <NavBarNav className='mx-auto hidden lg:flex'>
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavBarItem key={item.label} active={item.active} className='font-semibold'>
                            <Icon className='size-4' aria-hidden />
                            {item.label}
                        </NavBarItem>
                    );
                })}
            </NavBarNav>

            {/* Search + Cart pill (brand red — the toolbar's cart CTA) — right. */}
            <NavBarActions>
                <Button
                    variant='ghost'
                    size='icon'
                    className='text-foreground/70 hover:text-foreground'
                    aria-label='Search the menu'
                >
                    <Search className='size-5' />
                </Button>
                <Button className='rounded-full px-4' aria-label={`Cart, ${cartCount} items`}>
                    <ShoppingBag className='size-4' />
                    <span className='hidden sm:inline'>Cart</span>
                    <span className='inline-flex min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-xs font-bold tabular-nums'>
                        {cartCount}
                    </span>
                </Button>
            </NavBarActions>
        </NavBar>
    );
}

// Muted labelled placeholder block for a region the requirement does not change.
function RegionPlaceholder({ label, className }: { label: string; className?: string }) {
    return (
        <div
            className={`flex h-11 items-center justify-center rounded-xl border border-dashed bg-muted/40 ${className ?? ''}`}
        >
            <span className='font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40'>{label}</span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Circular thumbnail — image-forward, circular framing for small imagery.
// ---------------------------------------------------------------------------

function LineThumbnail({ src, alt }: { src: string; alt: string }) {
    const [failed, setFailed] = React.useState(false);
    return (
        <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted ring-1 ring-black/5'>
            {failed ? (
                <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                    <UtensilsCrossed className='h-6 w-6' aria-hidden />
                </div>
            ) : (
                <img src={src} alt={alt} className='h-full w-full object-cover' onError={() => setFailed(true)} />
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Circular −/+ stepper — item-level control, reads BLACK (never crimson).
// ---------------------------------------------------------------------------

function QuantityStepper({
    quantity,
    atMax,
    onDecrement,
    onIncrement,
}: {
    quantity: number;
    atMax: boolean;
    onDecrement: () => void;
    onIncrement: () => void;
}) {
    return (
        <div className='flex items-center gap-2 rounded-full bg-muted p-1'>
            <Button
                variant='outline'
                size='icon-sm'
                className='border-border bg-background text-foreground'
                aria-label='Decrease quantity'
                onClick={onDecrement}
            >
                <Minus className='h-4 w-4' />
            </Button>
            <span className='w-6 text-center text-sm font-bold tabular-nums text-foreground'>{quantity}</span>
            <Button
                variant='outline'
                size='icon-sm'
                className='border-border bg-background text-foreground'
                aria-label='Increase quantity'
                disabled={atMax}
                onClick={onIncrement}
            >
                <Plus className='h-4 w-4' />
            </Button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Remove control — destructive, sits APART from the primary and requires an
// explicit confirm (AlertDialog). `defaultOpen` lets the RemoveConfirm story
// present the confirm step statically.
// ---------------------------------------------------------------------------

function RemoveLineControl({
    name,
    defaultOpen = false,
    onConfirm,
}: {
    name: string;
    defaultOpen?: boolean;
    onConfirm: () => void;
}) {
    const [open, setOpen] = React.useState(defaultOpen);
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant='ghost'
                    size='icon-sm'
                    className='text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                    aria-label={`Remove ${name}`}
                >
                    <Trash2 className='h-4 w-4' />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='rounded-2xl'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove {name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This takes the line out of your cart. You can add it again from the menu.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className='rounded-full'>Keep it</AlertDialogCancel>
                    <AlertDialogAction className='rounded-full' onClick={onConfirm}>
                        Remove item
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ---------------------------------------------------------------------------
// Order-line card — a white card with a hairline and no shadow (it sits on the
// white lines panel). Circular thumbnail, black selection + stepper controls,
// crimson line price, destructive remove kept apart in the top-right corner.
// ---------------------------------------------------------------------------

function CartLineCard({
    line,
    forceConfirm = false,
    onToggleSelect,
    onQuantityChange,
    onRemove,
}: {
    line: CartLine;
    forceConfirm?: boolean;
    onToggleSelect: (id: string, selected: boolean) => void;
    onQuantityChange: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
}) {
    const lineTotal = line.unitPrice * line.quantity;

    return (
        <Card className='gap-0 rounded-2xl border-border/70 py-0 shadow-none'>
            <div className='relative flex items-start gap-4 p-5'>
                {/* Selection — black control (checked), not crimson. */}
                <Checkbox
                    checked={line.selected}
                    onCheckedChange={checked => onToggleSelect(line.id, checked === true)}
                    aria-label={`Select ${line.name}`}
                    className='mt-1 size-5 rounded-full border-2 data-[state=checked]:border-selected data-[state=checked]:bg-selected data-[state=checked]:text-selected-foreground'
                />

                <LineThumbnail src={line.imageUrl} alt={line.name} />

                <div className='flex min-w-0 flex-1 flex-col gap-3'>
                    <div className='flex items-start justify-between gap-4'>
                        <div className='min-w-0'>
                            <h3 className='truncate text-lg font-bold leading-tight text-foreground'>{line.name}</h3>
                            <p className='mt-1 line-clamp-1 text-sm text-muted-foreground'>{line.description}</p>
                        </div>
                        {/* Destructive remove — kept APART from the primary action, top-right. */}
                        <RemoveLineControl
                            name={line.name}
                            defaultOpen={forceConfirm}
                            onConfirm={() => onRemove(line.id)}
                        />
                    </div>

                    <div className='flex flex-wrap items-center gap-2'>
                        <Badge variant='outline' className='rounded-full border-border bg-background font-medium'>
                            {line.category}
                        </Badge>
                        <Badge variant='outline' className='rounded-full border-border bg-background font-medium'>
                            {line.unit}
                        </Badge>
                    </div>

                    <div className='mt-1 flex flex-wrap items-center justify-between gap-4'>
                        <QuantityStepper
                            quantity={line.quantity}
                            atMax={line.quantity >= line.stock}
                            onDecrement={() => onQuantityChange(line.id, -1)}
                            onIncrement={() => onQuantityChange(line.id, 1)}
                        />
                        {/* Line price — crimson. */}
                        <div className='text-right'>
                            <p className='text-xl font-black tracking-tight text-primary'>{formatVnd(lineTotal)}</p>
                            <p className='text-xs text-muted-foreground'>{formatVnd(line.unitPrice)} each</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Summary Panel (DESIGN_THEME §5) — a floating white panel (hairline + one soft
// shadow) on the gray shell. Structure top→bottom: title + count → line items →
// DASHED divider → promo-code row (removable Promo/Tag Pill) → discount/delivery
// breakdown (plain rows) → bold total row → primary CTA pinned at the bottom.
// Every price + the total read CRIMSON; the discount reads crimson with a `-`
// prefix; free delivery reads GREEN; the single crimson Final CTA is the loudest
// element on the screen.
// ---------------------------------------------------------------------------

const PROMO_CODE = 'BATO';
const PROMO_RATE = 0.1; // 10% off applied by the BATO code.

function OrderSummary({
    lines,
    promoApplied,
    onDismissPromo,
    onCheckout,
}: {
    lines: CartLine[];
    promoApplied: boolean;
    onDismissPromo: () => void;
    onCheckout: () => void;
}) {
    const selected = lines.filter(l => l.selected);
    const subtotal = selected.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
    const discount = promoApplied ? Math.round(subtotal * PROMO_RATE) : 0;
    const total = subtotal - discount;

    return (
        <Card className='sticky top-0 gap-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]'>
            {/* Title + count. */}
            <CardHeader>
                <h2 className='text-xl font-bold text-foreground'>My Order</h2>
                <p className='text-xs font-medium tabular-nums text-muted-foreground'>
                    {selected.length} {selected.length === 1 ? 'position' : 'positions'}
                </p>
            </CardHeader>

            <CardContent className='space-y-4'>
                {/* Line items. */}
                {selected.length > 0 ? (
                    <div className='space-y-3'>
                        {selected.map(l => (
                            <div key={l.id} className='flex items-center justify-between gap-3 text-sm'>
                                <span className='min-w-0 truncate text-muted-foreground'>
                                    {l.name} &times;{l.quantity}
                                </span>
                                {/* Every price reads crimson. */}
                                <span className='shrink-0 font-bold text-primary'>
                                    {formatVnd(l.unitPrice * l.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-sm text-muted-foreground'>Select at least one line to check out.</p>
                )}

                {/* Dashed divider — optional/divider meaning only. */}
                <div className='border-t border-dashed border-border' />

                {/* Promo-code row — removable Promo/Tag Pill for the applied code. */}
                <div className='flex items-center justify-between gap-3'>
                    <span className='text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                        Promocode
                    </span>
                    {promoApplied ? (
                        <span className='inline-flex items-center gap-1.5 rounded-full bg-selected py-1 pl-2.5 pr-1.5 text-xs font-semibold text-selected-foreground'>
                            <Ticket className='size-3.5' aria-hidden />
                            {PROMO_CODE}
                            <button
                                type='button'
                                onClick={onDismissPromo}
                                aria-label={`Remove promo code ${PROMO_CODE}`}
                                className='ml-0.5 inline-flex size-4 items-center justify-center rounded-full text-selected-foreground/70 transition-colors hover:bg-white/15 hover:text-selected-foreground'
                            >
                                <X className='size-3' aria-hidden />
                            </button>
                        </span>
                    ) : (
                        <span className='text-xs text-muted-foreground/70'>No code applied</span>
                    )}
                </div>

                {/* Discount / delivery breakdown — plain rows. */}
                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <span className='text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                            Discount
                        </span>
                        {/* Negative value — crimson, `-` prefixed. */}
                        <span className='text-sm font-semibold text-primary'>
                            {promoApplied ? `-${Math.round(PROMO_RATE * 100)}%` : '—'}
                        </span>
                    </div>
                    <div className='flex items-center justify-between'>
                        <span className='text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground'>
                            Delivery
                        </span>
                        {/* Free — green, never crimson. */}
                        <span className='text-sm font-semibold text-success'>FREE</span>
                    </div>
                </div>

                <div className='border-t border-border' />

                {/* Bold total row — crimson, the emphasis of the surface. */}
                <div className='flex items-baseline justify-between'>
                    <span className='text-sm font-bold uppercase tracking-[0.08em] text-foreground'>Total</span>
                    <span className='text-2xl font-black tracking-tight text-primary'>{formatVnd(total)}</span>
                </div>
            </CardContent>

            {/* Primary CTA pinned at the bottom — the single loudest crimson Final
                CTA (cart review is the last step before payment). */}
            <CardFooter>
                <Button
                    size='lg'
                    className='w-full rounded-full text-base'
                    disabled={selected.length === 0}
                    onClick={onCheckout}
                >
                    Proceed to payment
                    <ArrowRight className='h-4 w-4' />
                </Button>
            </CardFooter>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Empty cart — illustration + exactly one CTA back to the menu (no dead end).
// ---------------------------------------------------------------------------

function EmptyCart() {
    return (
        <div className='flex flex-col items-center justify-center rounded-3xl border bg-card px-6 py-24 text-center shadow-sm'>
            <div className='mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted'>
                <ShoppingBag className='h-10 w-10 text-muted-foreground' aria-hidden />
            </div>
            <h2 className='mb-2 text-2xl font-bold text-foreground'>Your cart is empty</h2>
            <p className='mb-8 max-w-sm text-muted-foreground'>
                Nothing here yet. Browse the menu and add something you will love.
            </p>
            <Button size='lg' className='rounded-full text-base'>
                Browse the menu
                <ArrowRight className='h-4 w-4' />
            </Button>
        </div>
    );
}

// ---------------------------------------------------------------------------
// CartReview surface — full page, local-state harness mirroring src/pages/cart.
// ---------------------------------------------------------------------------

function CartReview({ initialLines, forceConfirmId }: { initialLines: CartLine[]; forceConfirmId?: string }) {
    const [lines, setLines] = React.useState<CartLine[]>(initialLines);
    const [promoApplied, setPromoApplied] = React.useState(true);

    const dismissPromo = () => {
        setPromoApplied(false);
        toast.success('Promo code removed');
    };

    const toggleSelect = (id: string, selected: boolean) =>
        setLines(prev => prev.map(l => (l.id === id ? { ...l, selected } : l)));

    const removeLine = (id: string) => {
        setLines(prev => prev.filter(l => l.id !== id));
        toast.success('Item removed from cart');
    };

    // Mirrors src/pages/cart: decrement below 1 removes the line (here, via the
    // confirm dialog opened by the stepper); increment is capped at stock.
    const changeQuantity = (id: string, delta: number) => {
        setLines(prev =>
            prev.flatMap(l => {
                if (l.id !== id) return [l];
                const next = l.quantity + delta;
                if (next <= 0) {
                    toast.success('Item removed from cart');
                    return [];
                }
                if (next > l.stock) {
                    toast.error(`Only ${l.stock} in stock`);
                    return [l];
                }
                return [{ ...l, quantity: next }];
            })
        );
    };

    const checkout = () => toast.success('Proceeding to payment');

    return (
        <AppShell cartCount={lines.length}>
            <div className='px-4 pb-10 sm:px-6'>
                {/* Page heading — one display element for the surface. */}
                <div className='mb-6 flex items-center gap-3'>
                    <h1 className='text-3xl font-black tracking-tight text-foreground sm:text-4xl'>Review your cart</h1>
                    {lines.length > 0 && (
                        <span className='rounded-full bg-background px-3 py-1 text-sm font-semibold text-muted-foreground shadow-sm'>
                            {lines.length} {lines.length === 1 ? 'line' : 'lines'}
                        </span>
                    )}
                </div>

                {/* Existing chrome the requirement does not change — placeholders. */}
                <div className='mb-8 grid gap-3 sm:grid-cols-2'>
                    <RegionPlaceholder label='trust bar placeholder' />
                    <RegionPlaceholder label='checkout progress placeholder' />
                </div>

                {lines.length === 0 ? (
                    <EmptyCart />
                ) : (
                    <div className='grid gap-6 lg:grid-cols-3'>
                        {/* White lines panel on the gray shell — holds the white line cards. */}
                        <div className='space-y-3 rounded-3xl border bg-card p-3 shadow-sm sm:p-4 lg:col-span-2'>
                            {lines.map(line => (
                                <CartLineCard
                                    key={line.id}
                                    line={line}
                                    forceConfirm={line.id === forceConfirmId}
                                    onToggleSelect={toggleSelect}
                                    onQuantityChange={changeQuantity}
                                    onRemove={removeLine}
                                />
                            ))}
                        </div>
                        <div className='lg:col-span-1'>
                            <OrderSummary
                                lines={lines}
                                promoApplied={promoApplied}
                                onDismissPromo={dismissPromo}
                                onCheckout={checkout}
                            />
                        </div>
                    </div>
                )}
            </div>

            <Toaster />
        </AppShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Cart Review',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — the cart with lines. A floating rounded toolbar is pinned at the top
 * of one light-gray shell; the cart body scrolls beneath it. Each order line is
 * a white card (hairline, no shadow) on the white lines panel, with a circular
 * thumbnail; every line price and the running total read in crimson; the
 * circular −/+ steppers and the selection checkbox read black; a single crimson
 * "Proceed to payment" is the only order-level action in the body. Fully
 * interactive: adjust quantities and toggle selection to watch the crimson total
 * follow.
 */
export const Default: Story = {
    name: 'Default — Cart With Lines',
    render: () => <CartReview initialLines={LINES} />,
};

/**
 * Remove confirm — the destructive control sits apart from the primary (per-
 * line, top-right, far from the checkout CTA) and asks for an explicit confirm
 * before the line leaves the cart. Shown here with the first line's confirm
 * step open.
 */
export const RemoveConfirm: Story = {
    name: 'Partial — Remove Needs Explicit Confirm',
    render: () => <CartReview initialLines={LINES} forceConfirmId='line-1' />,
};

/**
 * Empty — no lines in the cart. A single CTA leads back to the menu; no dead
 * end, no competing actions.
 */
export const Empty: Story = {
    name: 'Empty — Nothing In The Cart',
    render: () => <CartReview initialLines={[]} />,
};
