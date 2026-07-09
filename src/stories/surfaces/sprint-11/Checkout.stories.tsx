import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    Banknote,
    ChefHat,
    CreditCard,
    Flame,
    IceCreamCone,
    Leaf,
    MapPin,
    Search,
    ShieldCheck,
    ShoppingBag,
    Tag,
    UtensilsCrossed,
    Wine,
    X,
} from 'lucide-react';
import React from 'react';

import { cn, formatVnd } from '@/app/utils';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Textarea } from '@/components/textarea';

// ---------------------------------------------------------------------------
// Surface: Checkout (/payment) — CONFORMED to DESIGN_THEME.md (the concrete
// meal-ordering design language). Business behaviour is UNCHANGED from
// src/pages/payment: same fields (delivery address + optional notes), same two
// payment methods (cash on delivery, bank transfer w/ QR), same order summary +
// running total, same "place order" action. Only the VISUALS/UX are conformed.
//
// Theme conformance (see §-references in DESIGN_THEME.md):
//   • Two-tone hierarchy (§1, §2): BLACK for structural/selection controls,
//     RED (accent-primary) for commerce — prices + the single irreversible CTA.
//   • Payment method = single-select RadioGroup (§5): a vertical list of option
//     rows (radio dot + icon + title + hint); the chosen row is highlighted with
//     a BLACK hairline + tinted fill. Selection is a real radio group — never a
//     Button in a "selected" style. Crimson is reserved for prices + the CTA.
//   • Order review = Summary Panel pattern (§5): line items → dashed divider →
//     promo-code row (Promo/Tag Pill) → discount/delivery breakdown → bold RED
//     total → RED Final CTA pinned at the bottom.
//   • Final/Checkout CTA (§5): full-width RED pill, white bold text, NO split —
//     it is the ONE loudest red action on the surface (the place-order step). The
//     only Button on the surface is this commit action (+ the toolbar Cart).
//   • Layout (§6): single-column form, max ~40rem, labels ABOVE fields, never
//     multi-column.
//   • Spacing & Shape (§4): 8px grid, 20–24px card radius, one soft shadow on
//     floating panels only; dashed border reserved for the summary divider.
//   • States (§8): validation error says what to do NEXT; free delivery is
//     GREEN (success), never red; discounts are red and prefixed with "-".
//   • Chrome (§6): the shared domain-blind NavBar (consumer variant) as the
//     floating rounded toolbar (brand left, category nav centre via aria-current,
//     search + Cart right); the checkout progress remains a labelled placeholder
//     (this sprint only conforms the form body).
//
// Self-contained: @/components/* + mock-only fixtures. No api / store / model /
// page imports.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shapes (mock only — mirrors the payment surface's cart-item shape)
// ---------------------------------------------------------------------------

interface CheckoutLine {
    id: string;
    name: string;
    quantity: number;
    /** Unit price after any discount, in VND. */
    unitPrice: number;
    /** Per-unit customisation surcharge, in VND. */
    surcharge?: number;
    /** e.g. "Large, Extra cheese". */
    customisationLabel?: string;
}

type PaymentMethod = 'cod' | 'banking';

// ---------------------------------------------------------------------------
// Fixtures — realistic VND order, matching the payment surface's summary shape.
// ---------------------------------------------------------------------------

const ORDER_LINES: CheckoutLine[] = [
    {
        id: 'line-1',
        name: 'Signature beef pho',
        quantity: 2,
        unitPrice: 89000,
        surcharge: 15000,
        customisationLabel: 'Large, Extra brisket',
    },
    {
        id: 'line-2',
        name: 'Crispy spring rolls',
        quantity: 1,
        unitPrice: 65000,
        customisationLabel: 'Set of 6',
    },
    {
        id: 'line-3',
        name: 'Vietnamese iced coffee',
        quantity: 2,
        unitPrice: 39000,
    },
];

const lineTotal = (line: CheckoutLine) => (line.unitPrice + (line.surcharge ?? 0)) * line.quantity;

const PROMO = { code: 'PHO10', rate: 0.1 };
const SUBTOTAL = ORDER_LINES.reduce((sum, line) => sum + lineTotal(line), 0);
const DISCOUNT = Math.round(SUBTOTAL * PROMO.rate);
const ORDER_TOTAL = SUBTOTAL - DISCOUNT;
const ORDER_COUNT = ORDER_LINES.reduce((sum, line) => sum + line.quantity, 0);

const SAVED_ADDRESS = '42 Nguyen Hue Blvd, District 1, Ho Chi Minh City';

const BANK_ACCOUNT = {
    bank: 'Vietcombank',
    account: '0071000512345',
    reference: 'ORD20260704A19',
};

// ---------------------------------------------------------------------------
// Eyebrow — UPPERCASE micro-label above a group (§3 Label/Eyebrow: 11–12px,
// medium, +0.08em tracking).
// ---------------------------------------------------------------------------

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className='text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground'>{children}</span>
    );
}

// ---------------------------------------------------------------------------
// Payment method — a single-select RadioGroup (§5): a vertical list of option
// rows. Selection is a real radio group (RadioGroupItem), never a Button in a
// "selected" style. The chosen row is highlighted with a BLACK hairline + a faint
// tinted fill; crimson stays reserved for prices + the CTA.
// ---------------------------------------------------------------------------

interface PaymentOptionProps {
    value: PaymentMethod;
    selected: boolean;
    icon: React.ReactNode;
    title: string;
    hint: string;
}

function PaymentOption({ value, selected, icon, title, hint }: PaymentOptionProps) {
    const id = `checkout-pay-${value}`;
    return (
        <Label
            htmlFor={id}
            className={cn(
                'flex cursor-pointer items-center gap-3 rounded-[1.25rem] border px-5 py-4 transition-colors',
                selected ? 'border-foreground bg-muted/40' : 'border-border bg-background hover:border-foreground/40'
            )}
        >
            <RadioGroupItem id={id} value={value} />
            <span
                className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    selected ? 'bg-selected text-selected-foreground' : 'bg-muted text-foreground'
                )}
            >
                {icon}
            </span>
            <span className='flex min-w-0 flex-col gap-0.5 leading-tight'>
                <span className='text-sm font-semibold text-foreground'>{title}</span>
                <span className='text-xs font-normal text-muted-foreground'>{hint}</span>
            </span>
        </Label>
    );
}

// ---------------------------------------------------------------------------
// Promo/Tag Pill (§5) — small rounded tag with icon + code + dismiss "×", used
// for the applied promo code inside the Summary Panel.
// ---------------------------------------------------------------------------

function PromoPill({ code }: { code: string }) {
    return (
        <span className='inline-flex items-center gap-1.5 rounded-full bg-selected px-3 py-1.5 text-xs font-semibold text-selected-foreground'>
            <Tag className='h-3.5 w-3.5' />
            {code}
            <button
                type='button'
                aria-label={`Remove promo code ${code}`}
                className='flex h-4 w-4 items-center justify-center rounded-full text-selected-foreground/70 transition-colors hover:text-selected-foreground'
            >
                <X className='h-3 w-3' />
            </button>
        </span>
    );
}

// ---------------------------------------------------------------------------
// Order review — Summary Panel pattern (§5): line items → dashed divider →
// promo-code row → discount/delivery breakdown → bold RED total. Every price is
// red (§3); the discount is negative-red, delivery is GREEN "Free" (§8).
// ---------------------------------------------------------------------------

function SummaryPanel({ lines }: { lines: CheckoutLine[] }) {
    return (
        <section className='space-y-3'>
            <div className='flex items-baseline justify-between'>
                <Eyebrow>Your order</Eyebrow>
                <span className='text-xs text-muted-foreground'>{ORDER_COUNT} items</span>
            </div>

            <div className='rounded-[1.25rem] border border-border bg-background p-5'>
                {/* Line items */}
                <ul className='space-y-3'>
                    {lines.map(line => (
                        <li key={line.id} className='flex items-start justify-between gap-4'>
                            <div className='min-w-0'>
                                <p className='text-sm font-semibold text-foreground'>{line.name}</p>
                                {line.customisationLabel && (
                                    <p className='text-xs text-muted-foreground'>{line.customisationLabel}</p>
                                )}
                                <p className='text-xs text-muted-foreground'>&times; {line.quantity}</p>
                            </div>
                            <span className='shrink-0 text-sm font-bold text-primary'>
                                {formatVnd(lineTotal(line))}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Dashed divider (§4: reserved meaning) */}
                <div className='my-4 border-t border-dashed border-border' />

                {/* Promo-code row — Promo/Tag Pill */}
                <div className='flex items-center justify-between'>
                    <Eyebrow>Promocode</Eyebrow>
                    <PromoPill code={PROMO.code} />
                </div>

                {/* Breakdown — plain rows */}
                <dl className='mt-4 space-y-2 text-sm'>
                    <div className='flex items-center justify-between'>
                        <dt className='text-muted-foreground'>Subtotal</dt>
                        <dd className='font-medium text-foreground'>{formatVnd(SUBTOTAL)}</dd>
                    </div>
                    <div className='flex items-center justify-between'>
                        <dt className='text-muted-foreground'>Discount</dt>
                        <dd className='font-semibold text-primary'>-{formatVnd(DISCOUNT)}</dd>
                    </div>
                    <div className='flex items-center justify-between'>
                        <dt className='text-muted-foreground'>Delivery</dt>
                        <dd className='font-semibold text-success'>Free</dd>
                    </div>
                </dl>

                {/* Bold RED total */}
                <div className='mt-4 flex items-baseline justify-between border-t border-border pt-4'>
                    <Eyebrow>Total</Eyebrow>
                    <span className='text-2xl font-black tracking-tight text-primary'>{formatVnd(ORDER_TOTAL)}</span>
                </div>
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Bank transfer QR — shown when the Banking method is chosen (mirrors the
// payment surface's banking-QR panel: bank / account / amount + auto-confirm).
// ---------------------------------------------------------------------------

function BankTransferPanel() {
    return (
        <div className='space-y-5 rounded-[1.25rem] border border-border bg-background p-5'>
            <div className='flex flex-col items-center gap-3'>
                <div className='flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/40'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                        qr code
                    </span>
                </div>
                <p className='text-xs text-muted-foreground'>Scan with your banking app to pay</p>
            </div>
            <div className='space-y-2 rounded-2xl bg-muted/50 px-4 py-3 text-sm'>
                <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Bank</span>
                    <span className='font-medium text-foreground'>{BANK_ACCOUNT.bank}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Account</span>
                    <span className='font-mono font-medium text-foreground'>{BANK_ACCOUNT.account}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Amount</span>
                    <span className='font-bold text-primary'>{formatVnd(ORDER_TOTAL)}</span>
                </div>
            </div>
            <div className='flex items-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-xs text-muted-foreground'>
                <ShieldCheck className='h-3.5 w-3.5 shrink-0' />
                We confirm your order automatically once the transfer lands.
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Final CTA (§5) — full-width RED pill, white bold, NO split. Sits at the end of
// the checkout content flow and scrolls with the page (not a pinned footer) — the
// single irreversible place-order step. This is the ONE loudest red action.
// ---------------------------------------------------------------------------

function FinalCta({ method, onPlaceOrder }: { method: PaymentMethod; onPlaceOrder: () => void }) {
    return (
        <Button size='lg' className='h-12 w-full rounded-full text-base font-semibold' onClick={onPlaceOrder}>
            {method === 'banking' ? "I've transferred — place order" : 'Place order'}
        </Button>
    );
}

// ---------------------------------------------------------------------------
// Floating rounded toolbar — the shared, domain-blind NavBar (consumer variant):
// a large-radius rounded bar floating over the full-bleed content (§6). Brand slot left ·
// nav-items region centre (the active tab is a real navigation selection via
// NavBarItem's aria-current — a white pill w/ crimson icon+label, never a Button
// in a "selected" style) · actions slot right (search + the black Cart pill).
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
    { label: 'Main Dishes', icon: UtensilsCrossed, active: true },
    { label: 'Vegan', icon: Leaf, active: false },
    { label: 'Street Food', icon: Flame, active: false },
    { label: 'Desserts', icon: IceCreamCone, active: false },
    { label: 'Drinks', icon: Wine, active: false },
] as const;

function Toolbar() {
    return (
        <div className='shrink-0 px-3 pt-3 sm:px-4 sm:pt-4'>
            <NavBar>
                <NavBarBrand>
                    <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground'>
                        <ChefHat className='h-4 w-4' />
                    </span>
                    <span className='text-lg font-black tracking-tight text-primary'>Notism</span>
                </NavBarBrand>

                <NavBarNav className='hidden flex-1 justify-center lg:flex'>
                    {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
                        <NavBarItem key={label} active={active}>
                            <Icon className='h-4 w-4' />
                            {label}
                        </NavBarItem>
                    ))}
                </NavBarNav>

                <NavBarActions>
                    <span className='flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background text-foreground'>
                        <Search className='h-4 w-4' />
                    </span>
                    <Button size='lg' className='rounded-full px-5'>
                        <ShoppingBag className='h-4 w-4' />
                        Cart
                    </Button>
                </NavBarActions>
            </NavBar>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Existing chrome — the checkout progress is unchanged this sprint, so it renders
// as a labelled, muted placeholder (theme placeholder convention).
// ---------------------------------------------------------------------------

function CheckoutProgressPlaceholder() {
    return (
        <div className='flex h-12 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30'>
            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                checkout progress placeholder
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Checkout shell — FULL-BLEED / edge-to-edge on the app's neutral canvas
// (bg-muted): no dark ambient frame, no enclosing floating light shell. The
// floating rounded toolbar is pinned at top and the Final CTA at the bottom,
// over an independently scrolling single-column content zone. The form is a
// SINGLE COLUMN, max ~40rem, labels above fields (§4, §6).
// ---------------------------------------------------------------------------

interface CheckoutSurfaceProps {
    initialMethod?: PaymentMethod;
    /** Pre-fill the delivery address; empty string simulates a fresh field. */
    initialAddress?: string;
    /** Force the validation-error state (empty-address guidance) on first paint. */
    initialError?: boolean;
}

function CheckoutSurface({
    initialMethod = 'cod',
    initialAddress = SAVED_ADDRESS,
    initialError = false,
}: CheckoutSurfaceProps) {
    const [method, setMethod] = React.useState<PaymentMethod>(initialMethod);
    const [address, setAddress] = React.useState(initialAddress);
    const [notes, setNotes] = React.useState('');
    const [error, setError] = React.useState(initialError);

    const handlePlaceOrder = () => {
        if (address.trim() === '') {
            setError(true);
            return;
        }
        setError(false);
    };

    return (
        // Full-bleed canvas — no dark frame, no enclosing floating shell. Content
        // flows edge-to-edge on the app's neutral canvas; this is the single scroll
        // container (toolbar pinned top; the place-order CTA scrolls with the content).
        <div className='flex h-screen w-full flex-col overflow-hidden bg-muted'>
            <Toolbar />

            {/* Scroll region — only the single-column content scrolls here. */}
            <div className='min-h-0 flex-1 overflow-y-auto px-3 pb-6 sm:px-4'>
                <div className='mx-auto max-w-[40rem] pt-4 sm:pt-5'>
                    {/* White form panel: hairline + one soft shadow. */}
                    <div className='space-y-8 rounded-[1.5rem] border border-border/70 bg-background p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] sm:p-7'>
                        <CheckoutProgressPlaceholder />

                        <header className='space-y-1'>
                            <Eyebrow>Checkout</Eyebrow>
                            <h1 className='text-3xl font-black tracking-tight text-foreground'>Almost there</h1>
                            <p className='text-sm text-muted-foreground'>
                                Review your order, tell us where to bring it, and place your order.
                            </p>
                        </header>

                        {/* Delivery — single column, labels ABOVE each field */}
                        <section className='space-y-4'>
                            <Eyebrow>Delivery</Eyebrow>
                            <div className='space-y-2'>
                                <Label htmlFor='checkout-address'>
                                    <MapPin className='h-3.5 w-3.5' />
                                    Delivery address
                                </Label>
                                <Input
                                    id='checkout-address'
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    aria-invalid={error || undefined}
                                    placeholder='Street, district, city'
                                />
                                {error && (
                                    <p className='text-sm font-medium text-destructive'>
                                        Add a delivery address so we know where to bring your order.
                                    </p>
                                )}
                            </div>
                            <div className='space-y-2'>
                                <Label htmlFor='checkout-notes'>
                                    Delivery notes{' '}
                                    <span className='text-xs font-normal text-muted-foreground'>(optional)</span>
                                </Label>
                                <Textarea
                                    id='checkout-notes'
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows={3}
                                    placeholder='Gate code, landmark, or anything the driver should know'
                                />
                            </div>
                        </section>

                        {/* Payment method — single-select RadioGroup (vertical rows) */}
                        <section className='space-y-3'>
                            <Eyebrow>Payment</Eyebrow>
                            <RadioGroup
                                value={method}
                                onValueChange={value => setMethod(value as PaymentMethod)}
                                aria-label='Payment method'
                                className='gap-3'
                            >
                                <PaymentOption
                                    value='cod'
                                    selected={method === 'cod'}
                                    icon={<Banknote className='h-4 w-4' />}
                                    title='Cash on delivery'
                                    hint='Pay when it arrives'
                                />
                                <PaymentOption
                                    value='banking'
                                    selected={method === 'banking'}
                                    icon={<CreditCard className='h-4 w-4' />}
                                    title='Bank transfer'
                                    hint='Scan & pay now'
                                />
                            </RadioGroup>
                            {method === 'banking' && <BankTransferPanel />}
                        </section>

                        {/* Order review — Summary Panel pattern */}
                        <SummaryPanel lines={ORDER_LINES} />

                        {/* Place order — sits at the end of the content flow, scrolls with the page */}
                        <FinalCta method={method} onPlaceOrder={handlePlaceOrder} />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Checkout',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — a calm single-column checkout (max ~40rem, labels above fields). The
 * order review follows the Summary Panel pattern (line items → dashed divider →
 * promo pill → breakdown → bold RED total); the ONE loudest red action is the
 * full-width "Place order" pill pinned at the bottom. Cash on delivery is the
 * chosen payment method (solid-black Segmented Choice pill).
 */
export const Default: Story = {
    name: 'Default — Single-Column Checkout (COD)',
    render: () => <CheckoutSurface initialMethod='cod' />,
};

/**
 * Payment method selected — the customer picked Bank transfer: the Segmented
 * Choice toggles to that pill (still exactly one selected, black fill) and the
 * QR / account panel appears with the amount in red. The full-width red CTA
 * updates to confirm the transfer.
 */
export const BankTransferSelected: Story = {
    name: 'Selected — Bank Transfer Method (QR)',
    render: () => <CheckoutSurface initialMethod='banking' />,
};

/**
 * Validation error — the delivery address is empty on Place order. The message
 * says what to do NEXT ("Add a delivery address so we know where to bring your
 * order."), not just that a field is invalid; the field is flagged and the
 * red CTA stays available to retry.
 */
export const ValidationError: Story = {
    name: 'Error — Empty Address, Next-Step Guidance',
    render: () => <CheckoutSurface initialMethod='cod' initialAddress='' initialError />,
};
