import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    ArrowLeft,
    Check,
    ChefHat,
    Home,
    Landmark,
    Package,
    Search,
    ShoppingBag,
    StickyNote,
    Truck,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import ErrorState from '@/components/error-state';
import { NavBar, NavBarActions, NavBarBrand, NavBarItem, NavBarNav } from '@/components/nav-bar';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import Timeline from '@/components/timeline';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface: OrderTracking (customer single-order tracking, /orders/:slugId).
// Restyle of src/pages/order-detail — SAME functionality, states, data and flow
// as the live page (status progression, order lines, cancel + refund-request
// with explicit confirm). Visuals + UX only.
//
// Design language (derived from the codebase's Sprint 11 stories + shared kit —
// no DESIGN_THEME.md present):
//   • Soft, minimal elevation: dark ambient frame → ONE large-radius light-gray
//     shell → white content cards (hairline + faint shadow). One gentle step per
//     level; no heavy rings or shadows. Content never sits on the raw dark frame.
//   • The top nav is the shared, domain-blind NavBar (consumer variant) — a
//     floating rounded bar pinned inside the shell, consistent with the Consumer
//     App Shell. The active tab is a REAL navigation selection (NavBarItem
//     aria-current — white pill + primary accent), never a Button in a selected
//     style.
//   • Delivery progression is the shared Timeline primitive (placed → preparing →
//     on the way → delivered): each state is labelled in WORDS with a timestamp,
//     the current step accented, upcoming steps quiet — never colour alone.
//   • Order lines are List Rows: CIRCULAR thumbnail + name + gray meta + RED
//     price. Red stays the commerce/price tone; the TOTAL in the Summary Panel is
//     the single loudest red — the only large, bold red number.
//   • Summary Panel for the order/total block: meta → dashed divider → subtotal +
//     red `-`-prefixed discount + green "Free" delivery → bold red total → primary
//     CTA pinned. The order-level primary ("Order more") is BLACK/structural.
//   • Destructive (Cancel order) + secondary (Request refund) sit APART in a
//     separate "Manage this order" zone, never adjacent to the primary, each gated
//     behind an explicit CONFIRM dialog.
//
// Composed ONLY from @/components/* + mock fixtures. No api/model/state/feature
// imports; every region the requirement does NOT touch (checkout trust/progress
// bar) is a labelled muted placeholder.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Mock domain shapes (story-local — mirror the page's data shape, not real models)
// ---------------------------------------------------------------------------

type DeliveryStatusKey = 'orderPlaced' | 'preparing' | 'onTheWay' | 'delivered';

interface OrderLine {
    id: string;
    name: string;
    customisation?: string;
    quantity: number;
    unitPrice: number;
    /** Pre-discount unit price — struck through when a saving applies. */
    originalPrice?: number;
    lineTotal: number;
    imageUrl?: string;
}

interface RefundSummary {
    status: 'pending' | 'processing' | 'paid';
    amount: number;
    sentDate?: string;
    transferReference?: string;
}

interface OrderFixture {
    slugId: string;
    placedOn: string;
    status: DeliveryStatusKey;
    totalAmount: number;
    paymentMethod: string;
    deliveryNotes?: string;
    lines: OrderLine[];
    timing: Partial<Record<DeliveryStatusKey, string>>;
    /** Present once a refund is in flight / paid (mirrors order.refund). */
    refund?: RefundSummary;
    /** Whether the customer has saved bank details (drives the refund dialog). */
    hasBankDetails?: boolean;
}

// Story-local currency format (mock only — mirrors formatVnd, no util import).
const formatVnd = (amount: number) => amount.toLocaleString('en-US') + ' ₫';

// ---------------------------------------------------------------------------
// Status model — one word + icon per delivery state. The summary Status badge
// draws its tone from the app's semantic status tokens (info / warning /
// success + neutral ink); every state also carries a WORD label so status is
// never conveyed by colour alone.
// ---------------------------------------------------------------------------

interface StatusMeta {
    key: DeliveryStatusKey;
    label: string;
    icon: LucideIcon;
    /** Soft chip tone for the summary status badge. */
    badge: string;
}

const DELIVERY_STEPS: StatusMeta[] = [
    {
        key: 'orderPlaced',
        label: 'Order placed',
        icon: ShoppingBag,
        badge: 'border-border bg-muted text-foreground',
    },
    {
        key: 'preparing',
        label: 'Preparing',
        icon: ChefHat,
        badge: 'border-warning/25 bg-warning/10 text-warning',
    },
    {
        key: 'onTheWay',
        label: 'On the way',
        icon: Truck,
        badge: 'border-info/25 bg-info/10 text-info',
    },
    {
        key: 'delivered',
        label: 'Delivered',
        icon: Check,
        badge: 'border-success/25 bg-success/10 text-success',
    },
];

const statusIndex = (key: DeliveryStatusKey) => DELIVERY_STEPS.findIndex(s => s.key === key);
const statusMeta = (key: DeliveryStatusKey) => DELIVERY_STEPS[statusIndex(key)];
const canCancel = (key: DeliveryStatusKey) => key === 'orderPlaced' || key === 'preparing';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const LINES_A: OrderLine[] = [
    {
        id: 'l1',
        name: 'Truffle mushroom pizza',
        customisation: 'Large · Thin crust',
        quantity: 1,
        unitPrice: 185000,
        originalPrice: 210000,
        lineTotal: 185000,
        imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
    },
    {
        id: 'l2',
        name: 'Crispy chicken bao',
        customisation: 'Extra spicy',
        quantity: 2,
        unitPrice: 65000,
        lineTotal: 130000,
        imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cee6a6?w=200&h=200&fit=crop',
    },
    {
        id: 'l3',
        name: 'Iced Vietnamese coffee',
        quantity: 1,
        unitPrice: 45000,
        lineTotal: 45000,
        imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200&h=200&fit=crop',
    },
];

const ORDER_ON_THE_WAY: OrderFixture = {
    slugId: 'ORD-20260704-1042',
    placedOn: 'July 4, 2026, 12:04 PM',
    status: 'onTheWay',
    totalAmount: 360000,
    paymentMethod: 'Cash on delivery',
    deliveryNotes: 'Leave at the lobby desk — call on arrival.',
    lines: LINES_A,
    timing: {
        orderPlaced: '2026-07-04T12:04:00',
        preparing: '2026-07-04T12:11:00',
        onTheWay: '2026-07-04T12:33:00',
    },
    hasBankDetails: true,
};

const ORDER_PREPARING: OrderFixture = {
    ...ORDER_ON_THE_WAY,
    slugId: 'ORD-20260704-1043',
    status: 'preparing',
    paymentMethod: 'Cash on delivery',
    timing: {
        orderPlaced: '2026-07-04T12:04:00',
        preparing: '2026-07-04T12:11:00',
    },
};

const ORDER_DELIVERED: OrderFixture = {
    ...ORDER_ON_THE_WAY,
    slugId: 'ORD-20260703-0987',
    placedOn: 'July 3, 2026, 7:12 PM',
    status: 'delivered',
    paymentMethod: 'Banking',
    deliveryNotes: undefined,
    timing: {
        orderPlaced: '2026-07-03T19:12:00',
        preparing: '2026-07-03T19:19:00',
        onTheWay: '2026-07-03T19:41:00',
        delivered: '2026-07-03T20:06:00',
    },
    hasBankDetails: true,
};

// ---------------------------------------------------------------------------
// Floating top nav — the shared, domain-blind NavBar (consumer variant): a
// large-radius rounded bar that floats inside the shell (the shell padding gives
// it margin all around). Brand slot left · nav-items region center (the active
// tab is a real navigation selection via NavBarItem aria-current, never a Button
// in a selected style) · actions slot right (search + a Cart CTA). Consistent
// with the Consumer App Shell topbar.
// ---------------------------------------------------------------------------

const NAV_ITEMS: { key: string; label: string; icon: LucideIcon; active?: boolean }[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'orders', label: 'Orders', icon: ShoppingBag, active: true },
];

function Toolbar() {
    return (
        <NavBar className='shrink-0'>
            <NavBarBrand>
                <span className='pl-1 text-lg font-extrabold tracking-tight text-primary lg:pl-2'>Notism</span>
            </NavBarBrand>

            <NavBarNav className='hidden flex-1 justify-center md:flex'>
                {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                        <NavBarItem key={item.key} active={item.active}>
                            <Icon className='size-4' aria-hidden />
                            {item.label}
                        </NavBarItem>
                    );
                })}
            </NavBarNav>

            <NavBarActions>
                <Button variant='ghost' size='icon-sm' className='text-muted-foreground' aria-label='Search'>
                    <Search className='size-4' aria-hidden />
                </Button>
                <Button className='rounded-full'>
                    <ShoppingBag className='size-4' aria-hidden />
                    Cart
                </Button>
            </NavBarActions>
        </NavBar>
    );
}

// ---------------------------------------------------------------------------
// Placeholder — labelled muted block for regions this requirement doesn't touch.
// ---------------------------------------------------------------------------

function Placeholder({ label, className = '' }: { label: string; className?: string }) {
    return (
        <div
            className={[
                'flex h-14 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40',
                className,
            ].join(' ')}
        >
            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>{label}</span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Eyebrow micro-label (UPPERCASE, letter-spaced, muted) — a treatment.
// ---------------------------------------------------------------------------

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className='text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground'>{children}</span>
    );
}

// ---------------------------------------------------------------------------
// Status badge — the current state, in WORDS + icon + its consistent tone.
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: DeliveryStatusKey }) {
    const meta = statusMeta(status);
    const Icon = meta.icon;
    return (
        <Badge variant='outline' className={`gap-1.5 rounded-full px-3 py-1 ${meta.badge}`}>
            <Icon className='h-3.5 w-3.5' aria-hidden />
            {meta.label}
        </Badge>
    );
}

// ---------------------------------------------------------------------------
// Delivery status — the shared Timeline primitive renders the status
// progression (placed → preparing → on the way → delivered). Reached states are
// accented with a timestamp, the current step highlighted, upcoming steps quiet
// ("Up next"). Words + icon + timestamp carry the state — never colour alone.
// ---------------------------------------------------------------------------

function StatusTimeline({ status, timing }: { status: DeliveryStatusKey; timing: OrderFixture['timing'] }) {
    const current = statusIndex(status);
    const items = DELIVERY_STEPS.map((step, index) => ({
        title: step.label,
        icon: step.icon,
        isCompleted: index < current,
        isCurrent: index === current,
        completedAt: timing[step.key] ?? null,
        description: index > current ? 'Up next' : undefined,
    }));

    return (
        <Card className='rounded-3xl border-border shadow-none'>
            <CardHeader>
                <CardTitle className='text-xl'>Delivery status</CardTitle>
                <CardDescription>Track exactly where your order is right now.</CardDescription>
            </CardHeader>
            <CardContent>
                <Timeline items={items} />
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Order lines — CIRCULAR thumbnails; each line name is a heading; the running
// TOTAL reads in crimson (the only crimson number on the surface).
// ---------------------------------------------------------------------------

function OrderLinesCard({ order }: { order: OrderFixture }) {
    return (
        <Card className='rounded-3xl border-border shadow-none'>
            <CardHeader>
                <CardTitle className='text-xl'>Your order</CardTitle>
                <CardDescription>
                    {order.lines.length} {order.lines.length === 1 ? 'item' : 'items'}
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                {/* List Row: circular thumb + name + gray meta + red price, one row. */}
                <ul className='space-y-2'>
                    {order.lines.map(line => {
                        const hasSaving = line.originalPrice != null && line.originalPrice > line.unitPrice;
                        return (
                            <li
                                key={line.id}
                                className='flex items-center gap-4 rounded-2xl border border-border px-3 py-3'
                            >
                                {/* Circular thumbnail — signature for order-line imagery. */}
                                <Avatar className='h-14 w-14 shrink-0'>
                                    <AvatarImage src={line.imageUrl} alt={line.name} className='object-cover' />
                                    <AvatarFallback className='bg-muted text-muted-foreground'>
                                        <Package className='h-5 w-5' aria-hidden />
                                    </AvatarFallback>
                                </Avatar>

                                <div className='min-w-0 flex-1'>
                                    <div className='font-semibold text-foreground'>{line.name}</div>
                                    {line.customisation && (
                                        <div className='truncate text-[13px] text-muted-foreground'>
                                            {line.customisation}
                                        </div>
                                    )}
                                    <div className='text-[13px] text-muted-foreground'>
                                        Qty {line.quantity} · {formatVnd(line.unitPrice)} each
                                    </div>
                                </div>

                                {/* Price — red, bold (List Row price emphasis). Pre-discount unit
                                    struck above when a saving applies. */}
                                <div className='shrink-0 text-right'>
                                    {hasSaving && (
                                        <div className='text-xs text-muted-foreground line-through'>
                                            {formatVnd((line.originalPrice as number) * line.quantity)}
                                        </div>
                                    )}
                                    <div className='font-bold text-primary'>{formatVnd(line.lineTotal)}</div>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <Separator />

                <div className='space-y-2.5 px-1'>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Payment method</span>
                        <span className='font-medium text-foreground'>{order.paymentMethod}</span>
                    </div>
                    {order.deliveryNotes && (
                        <div className='flex items-start gap-1.5 text-sm text-muted-foreground'>
                            <StickyNote className='mt-0.5 h-3.5 w-3.5 shrink-0' aria-hidden />
                            <span>{order.deliveryNotes}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Refund status panel — shown once a refund is in flight (mirrors source).
// ---------------------------------------------------------------------------

function RefundPanel({ refund }: { refund: RefundSummary }) {
    const isPaid = refund.status === 'paid';
    return (
        <div className='rounded-2xl border bg-muted/30 p-4' role='status' aria-live='polite'>
            <div className='mb-3 flex items-center justify-between'>
                <Eyebrow>Refund</Eyebrow>
                <Badge
                    variant='outline'
                    className={
                        isPaid
                            ? 'rounded-full border-success/25 bg-success/10 text-success'
                            : 'rounded-full border-warning/25 bg-warning/10 text-warning'
                    }
                >
                    {isPaid ? 'Refund sent' : 'Refund processing'}
                </Badge>
            </div>
            <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Amount</span>
                    <span className='font-semibold text-foreground'>{formatVnd(refund.amount)}</span>
                </div>
                {isPaid && refund.sentDate && (
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Sent on</span>
                        <span className='font-medium text-foreground'>{refund.sentDate}</span>
                    </div>
                )}
                {!isPaid && (
                    <p className='text-xs text-muted-foreground'>
                        We&apos;re processing your refund to your saved bank account — this usually lands within 3–5
                        days.
                    </p>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Action rail — the persistent order summary + actions.
//
// Action hierarchy: ONE crimson order-level primary ("Order more") at the top;
// the destructive Cancel + secondary Request refund sit APART in a separate
// "Manage this order" zone below a divider — never adjacent to the primary — and
// each opens an explicit CONFIRM dialog.
// ---------------------------------------------------------------------------

type OpenDialog = 'none' | 'cancel' | 'refund';

function ActionRail({ order }: { order: OrderFixture }) {
    const [open, setOpen] = React.useState<OpenDialog>('none');
    const [cancelled, setCancelled] = React.useState(false);
    const [refundRequested, setRefundRequested] = React.useState(false);

    const showCancel = canCancel(order.status) && !cancelled;
    const showRefund =
        order.status === 'delivered' && order.paymentMethod === 'Banking' && !order.refund && !refundRequested;
    const close = () => setOpen('none');

    // Summary Panel breakdown — subtotal reads pre-discount so the saving shows
    // as a red, `-`-prefixed row; delivery is free (positive → not red).
    const subtotal = order.lines.reduce((sum, line) => sum + (line.originalPrice ?? line.unitPrice) * line.quantity, 0);
    const discount = subtotal - order.totalAmount;

    return (
        // The only FLOATING panel on the surface → the single soft shadow.
        <Card className='sticky top-2 rounded-3xl border-border shadow-[0_4px_20px_rgba(0,0,0,0.05)]'>
            <CardHeader>
                <CardTitle className='text-lg'>Order summary</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
                <div>
                    <Eyebrow>Order ID</Eyebrow>
                    <div className='mt-1 rounded-lg bg-muted px-2.5 py-1.5 font-mono text-sm text-foreground'>
                        {order.slugId}
                    </div>
                </div>
                <div>
                    <Eyebrow>Placed on</Eyebrow>
                    <div className='mt-1 text-sm font-medium text-foreground'>{order.placedOn}</div>
                </div>
                <div>
                    <Eyebrow>Status</Eyebrow>
                    <div className='mt-1.5'>
                        {cancelled ? (
                            <Badge
                                variant='outline'
                                className='gap-1.5 rounded-full border-destructive/30 bg-destructive/10 px-3 py-1 text-destructive'
                            >
                                Order cancelled
                            </Badge>
                        ) : (
                            <StatusBadge status={order.status} />
                        )}
                    </div>
                </div>

                {/* Dashed divider → breakdown → bold total (Summary Panel structure). */}
                <div className='border-t border-dashed border-border pt-4'>
                    <div className='space-y-2 text-sm'>
                        <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground'>Subtotal</span>
                            <span className='font-medium text-foreground'>{formatVnd(subtotal)}</span>
                        </div>
                        {discount > 0 && (
                            <div className='flex items-center justify-between'>
                                <span className='text-muted-foreground'>Discount</span>
                                {/* Negative value → red, `-`-prefixed. */}
                                <span className='font-medium text-primary'>-{formatVnd(discount)}</span>
                            </div>
                        )}
                        <div className='flex items-center justify-between'>
                            <span className='text-muted-foreground'>Delivery</span>
                            {/* Free / positive → success, never red. */}
                            <span className='font-medium text-success'>Free</span>
                        </div>
                    </div>
                    <div className='mt-3 flex items-end justify-between border-t pt-3'>
                        <Eyebrow>Total</Eyebrow>
                        {/* The single loudest red on the surface — the total price. */}
                        <span className='text-2xl font-black tracking-tight text-primary'>
                            {formatVnd(order.totalAmount)}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardContent className='space-y-3 pt-0'>
                {/* Order-level primary — structural (black), NOT commerce red: red stays
                    reserved for the total price on this surface. */}
                <Button
                    size='lg'
                    className='bg-selected text-selected-foreground hover:bg-selected/90 w-full rounded-full'
                >
                    <ShoppingBag className='h-4 w-4' />
                    Order more
                </Button>

                {order.refund && <RefundPanel refund={order.refund} />}
                {refundRequested && !order.refund && (
                    <RefundPanel refund={{ status: 'processing', amount: order.totalAmount }} />
                )}

                {/* Manage zone — destructive / secondary held APART from the primary. */}
                {(showCancel || showRefund) && (
                    <div className='mt-2 space-y-3 rounded-2xl border border-dashed border-border p-3'>
                        <Eyebrow>Manage this order</Eyebrow>
                        {showRefund && (
                            <Button
                                variant='outline'
                                size='lg'
                                className='w-full rounded-full'
                                onClick={() => setOpen('refund')}
                            >
                                <Landmark className='h-4 w-4' />
                                Request refund
                            </Button>
                        )}
                        {showCancel && (
                            <Button
                                variant='ghost'
                                size='lg'
                                className='w-full rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive'
                                onClick={() => setOpen('cancel')}
                            >
                                Cancel order
                            </Button>
                        )}
                        <p className='text-xs text-muted-foreground'>
                            {showCancel
                                ? 'You can cancel while we prepare your order.'
                                : 'Paid by bank — refunds go to your saved account.'}
                        </p>
                    </div>
                )}
            </CardContent>

            {/* Explicit confirm — cancel (destructive). */}
            <Dialog open={open === 'cancel'} onOpenChange={o => setOpen(o ? 'cancel' : 'none')}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel this order?</DialogTitle>
                        <DialogDescription>
                            This can&apos;t be undone. We&apos;ll stop preparing {order.slugId} right away and you
                            won&apos;t be charged.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' className='rounded-full' onClick={close}>
                            Keep order
                        </Button>
                        <Button
                            variant='destructive'
                            className='rounded-full'
                            onClick={() => {
                                setCancelled(true);
                                close();
                            }}
                        >
                            Cancel order
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Explicit confirm — refund (secondary). Branches on saved bank details. */}
            <Dialog open={open === 'refund'} onOpenChange={o => setOpen(o ? 'refund' : 'none')}>
                <DialogContent>
                    {order.hasBankDetails ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Request a refund?</DialogTitle>
                                <DialogDescription>
                                    We&apos;ll refund {formatVnd(order.totalAmount)} to your saved bank account. It
                                    usually lands within 3–5 business days.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='outline' className='rounded-full' onClick={close}>
                                    Not now
                                </Button>
                                <Button
                                    className='bg-selected text-selected-foreground hover:bg-selected/90 rounded-full'
                                    onClick={() => {
                                        setRefundRequested(true);
                                        close();
                                    }}
                                >
                                    Request refund
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle>Add bank details first</DialogTitle>
                                <DialogDescription>
                                    We need somewhere to send your refund. Add your bank account, then request the
                                    refund.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='outline' className='rounded-full' onClick={close}>
                                    Not now
                                </Button>
                                <Button
                                    className='bg-selected text-selected-foreground hover:bg-selected/90 rounded-full'
                                    onClick={close}
                                >
                                    <Landmark className='h-4 w-4' />
                                    Add bank details
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Order-tracking shell — soft, minimal elevation:
//   dark ambient frame → ONE large-radius light-gray shell → white cards.
// The shell fills the viewport; the toolbar is pinned above a single scroll
// region so tracking content scrolls WITHIN the shell (no double scrollbars).
// The checkout trust/progress bar is unchanged chrome → labelled placeholder.
// ---------------------------------------------------------------------------

function OrderTrackingShell({ children }: { children: React.ReactNode }) {
    return (
        <div
            className='flex h-screen w-full flex-col bg-[oklch(0.16_0.006_285.885)] p-3 sm:p-6'
            style={{
                backgroundImage:
                    'radial-gradient(circle at 12% 18%, rgba(255,255,255,0.04) 0, transparent 42%), radial-gradient(circle at 88% 82%, rgba(255,255,255,0.03) 0, transparent 40%)',
            }}
        >
            {/* One large-radius light-gray shell — fills the frame, clips its scroll. */}
            <div className='mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-muted shadow-[0_4px_20px_rgba(0,0,0,0.05)]'>
                {/* Floating toolbar region — margin all around; pinned above the scroll. */}
                <div className='shrink-0 px-4 pt-4 sm:px-6 sm:pt-6'>
                    <Toolbar />
                </div>

                {/* Single scroll region — the tracking content scrolls here. */}
                <div className='min-h-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6'>
                    {/* Hero band */}
                    <div className='px-1 pb-2 pt-4'>
                        <Button variant='ghost' size='sm' className='-ml-2 mb-3 rounded-full text-muted-foreground'>
                            <ArrowLeft className='h-4 w-4' />
                            Back to orders
                        </Button>
                        <h1 className='text-3xl font-black tracking-tight text-foreground sm:text-4xl'>
                            Track your order
                        </h1>
                        <p className='mt-1 text-muted-foreground'>Follow every step from kitchen to doorstep.</p>
                        <div className='mt-4'>
                            <Placeholder label='checkout trust + progress bar placeholder' />
                        </div>
                    </div>

                    {/* Body */}
                    <div className='px-1 py-6 sm:py-8'>{children}</div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Full surface — the composed page for a given order fixture.
// ---------------------------------------------------------------------------

function OrderTrackingSurface({ order }: { order: OrderFixture }) {
    return (
        <OrderTrackingShell>
            <div className='grid gap-6 lg:grid-cols-3'>
                <div className='space-y-6 lg:col-span-2'>
                    <StatusTimeline status={order.status} timing={order.timing} />
                    <OrderLinesCard order={order} />
                </div>
                <div className='lg:col-span-1'>
                    <ActionRail order={order} />
                </div>
            </div>
        </OrderTrackingShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Order Tracking',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ order?: OrderFixture }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — mid-timeline. The order is "On the way": earlier states are complete
 * (accented, timestamped), the current step is highlighted, and the next step is
 * quiet ("Up next"). Order lines carry circular thumbnails; the total is crimson.
 * While in progress the order can still be cancelled (destructive, held apart).
 */
export const Default: Story = {
    name: 'Default — Mid-Timeline (On The Way)',
    render: () => <OrderTrackingSurface order={ORDER_ON_THE_WAY} />,
};

/**
 * Partial — earlier in the timeline ("Preparing"): only two states reached, two
 * still upcoming. Cancel is still available in the Manage zone with its explicit
 * confirm.
 */
export const Preparing: Story = {
    name: 'Partial — Early Timeline (Preparing)',
    render: () => <OrderTrackingSurface order={ORDER_PREPARING} />,
};

/**
 * Success — delivered. Every timeline state is complete, cancel is no longer
 * offered, and (bank-paid) a Request refund action appears in the Manage zone —
 * apart from the primary, gated behind an explicit confirm.
 */
export const Delivered: Story = {
    name: 'Success — Delivered (Refund Available)',
    render: () => <OrderTrackingSurface order={ORDER_DELIVERED} />,
};

/**
 * Confirm — the destructive Cancel and secondary Request refund each require an
 * explicit confirm dialog before anything happens. The story control is a
 * single-select ToggleGroup (a real selection primitive, never a Button in a
 * selected style): pick the in-progress order to open "Cancel order", or the
 * delivered order to open "Request refund". Both dialogs keep the safe choice as
 * the muted option and the committing action distinct (destructive / primary).
 */
export const CancelRefundConfirm: Story = {
    name: 'Confirm — Cancel / Request Refund (Explicit Confirm)',
    render: () => {
        function Harness() {
            const [which, setWhich] = React.useState<'cancel' | 'refund'>('cancel');
            const handleSelect = (value: string) => {
                if (value) setWhich(value as 'cancel' | 'refund');
            };
            return (
                <div>
                    <div className='mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 pt-4'>
                        <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                            story controls
                        </span>
                        <ToggleGroup type='single' variant='segmented' value={which} onValueChange={handleSelect}>
                            <ToggleGroupItem value='cancel'>Cancellable order</ToggleGroupItem>
                            <ToggleGroupItem value='refund'>Refundable order</ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <OrderTrackingSurface key={which} order={which === 'cancel' ? ORDER_ON_THE_WAY : ORDER_DELIVERED} />
                </div>
            );
        }
        return <Harness />;
    },
};

/**
 * Loading — the order is being fetched. The shell chrome is present while the
 * tracking content resolves.
 */
export const Loading: Story = {
    name: 'Loading — Fetching Order',
    render: () => (
        <OrderTrackingShell>
            <div className='flex h-[420px] items-center justify-center'>
                <Spinner size='lg' />
            </div>
        </OrderTrackingShell>
    ),
};

/**
 * Error — the order couldn't be found. A single clear next action returns the
 * customer to their orders — no dead end.
 */
export const Error: Story = {
    name: 'Error — Order Not Found',
    render: () => (
        <OrderTrackingShell>
            <ErrorState
                title="We couldn't find that order"
                description='The order may have been removed, or the link is out of date. Head back to your orders to try again.'
                action={
                    <Button className='bg-selected text-selected-foreground hover:bg-selected/90 rounded-full'>
                        <ArrowLeft className='h-4 w-4' />
                        Back to orders
                    </Button>
                }
            />
        </OrderTrackingShell>
    ),
};
