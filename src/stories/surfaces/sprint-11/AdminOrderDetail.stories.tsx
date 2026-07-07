import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Check,
    Loader2,
    Package,
    StickyNote,
    Truck,
    UtensilsCrossed,
    Wallet,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import Timeline from '@/components/timeline';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface: AdminOrderDetail (route /admin/orders/:slugId) — RESTYLE ONLY.
//
// Business behaviour is UNCHANGED from src/pages/admin/order-detail/. Same data
// (order items, running total, payment method + notes, payment details, the
// payment-status update action) and the same flow (back-to-orders link → order
// header → delivery timeline → items + summary + payment detail cards, with the
// status-update panel in the right rail). Only the VISUALS + UX are on-theme:
//
//   • Cards — items + payment details render as on-theme white cards on the
//     light shell, large-radius, with an eyebrow micro-label + heading + quiet
//     body hierarchy. Order lines carry a circular thumbnail.
//   • Two-tone hierarchy — RED is reserved for money: every line price and the
//     running total, the ONE loudest red on the screen. The status-update commit
//     ("Save status" + the dialog's Confirm) is a BLACK structural primary — no
//     commerce lives here, so it never goes red.
//   • Status roles — payment + delivery status show as WORD labels with one
//     consistent colour each (Badge variants), never colour alone.
//
// This regeneration adopts the shared kit for three regions:
//   • Delivery / audit progression → the shared <Timeline> component (no bespoke
//     step markup). Steps are derived from the order's delivery status.
//   • Payment-status setter → the shared <ToggleGroup variant="segmented"> as the
//     single-select control. No Button carries a selected state anywhere on the
//     surface; the sole selection affordance is the segmented group's own on-state.
//   • Admin top nav → this surface is a PAGE rendered inside the admin app shell
//     (AdminAppShell owns the shared NavBar), so the top nav is a
//     labelled sticky placeholder here rather than a re-implemented bar.
//
// Mock-only fixtures; no api/model/state imports. Composed from @/components/*.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shapes (mock only — mirror the page's AdminOrderDetailModel shape)
// ---------------------------------------------------------------------------

type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';
type DeliveryStatus = 'orderPlaced' | 'preparing' | 'onTheWay' | 'delivered';

interface OrderLine {
    id: string;
    foodName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    imageUrl: string;
    customisationLabel: string | null;
}

interface OrderDetail {
    slugId: string;
    createdAt: string;
    createdAtIso: string;
    totalAmount: number;
    paymentMethod: 'cashOnDelivery' | 'banking';
    paymentStatus: PaymentStatus;
    deliveryStatus: DeliveryStatus;
    paidAt: string | null;
    deliveryNotes: string | null;
    items: OrderLine[];
}

// ---------------------------------------------------------------------------
// Fixtures — VND amounts + `ORD-…` slug mirror the app's conventions.
// ---------------------------------------------------------------------------

const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`;

const ORDER: OrderDetail = {
    slugId: 'ORD-20260704-1042',
    createdAt: '4 July 2026, 12:04',
    createdAtIso: '2026-07-04T12:04:00',
    totalAmount: 385000,
    paymentMethod: 'banking',
    paymentStatus: 'paid',
    deliveryStatus: 'preparing',
    paidAt: '4 July 2026, 12:06',
    deliveryNotes: 'Leave at the door, please ring the bell twice.',
    items: [
        {
            id: 'li-1',
            foodName: 'Crispy chicken bao',
            quantity: 2,
            unitPrice: 95000,
            totalPrice: 190000,
            imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=160&q=80',
            customisationLabel: 'Extra chilli · No coriander',
        },
        {
            id: 'li-2',
            foodName: 'Grilled lemongrass pork',
            quantity: 1,
            unitPrice: 120000,
            totalPrice: 120000,
            imageUrl: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=160&q=80',
            customisationLabel: null,
        },
        {
            id: 'li-3',
            foodName: 'Iced Vietnamese coffee',
            quantity: 3,
            unitPrice: 25000,
            totalPrice: 75000,
            imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=160&q=80',
            customisationLabel: 'Less ice',
        },
    ],
};

const UNPAID_ORDER: OrderDetail = {
    ...ORDER,
    slugId: 'ORD-20260704-1043',
    paymentStatus: 'unpaid',
    paymentMethod: 'cashOnDelivery',
    deliveryStatus: 'orderPlaced',
    paidAt: null,
    deliveryNotes: null,
};

const PAYMENT_STATUS_OPTIONS: { key: PaymentStatus; label: string }[] = [
    { key: 'paid', label: 'Paid' },
    { key: 'unpaid', label: 'Unpaid' },
    { key: 'failed', label: 'Failed' },
    { key: 'refunded', label: 'Refunded' },
];

// ---------------------------------------------------------------------------
// Status roles — a WORD label + one consistent colour per state (theme: status
// colours for status only, never colour alone).
// ---------------------------------------------------------------------------

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    const map: Record<PaymentStatus, { label: string; variant: 'success' | 'destructive' | 'warning' | 'secondary' }> =
        {
            paid: { label: 'Paid', variant: 'success' },
            failed: { label: 'Failed', variant: 'destructive' },
            refunded: { label: 'Refunded', variant: 'warning' },
            unpaid: { label: 'Unpaid', variant: 'secondary' },
        };
    const { label, variant } = map[status];
    return <Badge variant={variant}>{label}</Badge>;
}

const DELIVERY_LABEL: Record<DeliveryStatus, string> = {
    orderPlaced: 'Order placed',
    preparing: 'Preparing',
    onTheWay: 'On the way',
    delivered: 'Delivered',
};

const PAYMENT_METHOD_LABEL: Record<OrderDetail['paymentMethod'], string> = {
    cashOnDelivery: 'Cash on delivery',
    banking: 'Banking',
};

// ---------------------------------------------------------------------------
// Delivery / audit progression — derived into the shared Timeline's item shape.
// The ordered sequence of delivery states, each with an icon and a description;
// steps before the current state read as completed (with a timestamp), the
// current state reads as in-progress, later states stay muted.
// ---------------------------------------------------------------------------

const DELIVERY_SEQUENCE: { key: DeliveryStatus; icon: LucideIcon; description: string; offsetMinutes: number }[] = [
    { key: 'orderPlaced', icon: Package, description: 'Order received and confirmed', offsetMinutes: 0 },
    { key: 'preparing', icon: UtensilsCrossed, description: 'Kitchen is preparing the items', offsetMinutes: 6 },
    { key: 'onTheWay', icon: Truck, description: 'Rider is heading to the address', offsetMinutes: 24 },
    { key: 'delivered', icon: CheckCircle2, description: 'Handed to the customer', offsetMinutes: 41 },
];

function addMinutesIso(iso: string, minutes: number) {
    const base = new Date(iso);
    base.setMinutes(base.getMinutes() + minutes);
    return base.toISOString();
}

function buildDeliveryTimeline(order: OrderDetail) {
    const currentIndex = DELIVERY_SEQUENCE.findIndex(step => step.key === order.deliveryStatus);
    return DELIVERY_SEQUENCE.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        return {
            title: DELIVERY_LABEL[step.key],
            description: step.description,
            icon: step.icon,
            isCompleted,
            isCurrent,
            completedAt: isCompleted ? addMinutesIso(order.createdAtIso, step.offsetMinutes) : null,
        };
    });
}

// ---------------------------------------------------------------------------
// Eyebrow micro-label — UPPERCASE, letter-spaced, muted (theme treatment).
// ---------------------------------------------------------------------------

function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <span className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground'>{children}</span>
    );
}

// ---------------------------------------------------------------------------
// Placeholder — unchanged shell regions this sprint does not touch. The nav
// variant is a sticky, dashed, pinned bar (the admin top nav is owned by the
// AdminAppShell, not re-implemented here).
// ---------------------------------------------------------------------------

function NavPlaceholder() {
    return (
        <div className='sticky top-0 z-20 shrink-0 px-3 pt-3 sm:px-4 sm:pt-4'>
            <div className='flex h-14 items-center justify-center rounded-full border border-dashed border-border bg-card/60'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60'>
                    admin top nav placeholder
                </span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Order header — one display H1 (page hero), order id + date as quiet body, the
// running total in crimson (theme: every total is crimson).
// ---------------------------------------------------------------------------

function OrderHeader({ order }: { order: OrderDetail }) {
    return (
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div className='space-y-1'>
                <h1 className='text-3xl font-bold tracking-tight text-foreground'>Order detail</h1>
                <p className='font-mono text-sm font-medium text-foreground'>{order.slugId}</p>
                <p className='text-sm text-muted-foreground'>{order.createdAt}</p>
            </div>
            <div className='text-left sm:text-right'>
                <div className='text-2xl font-bold text-primary'>{formatVnd(order.totalAmount)}</div>
                <div className='mt-1 flex items-center gap-2 sm:justify-end'>
                    <Eyebrow>Delivery</Eyebrow>
                    <Badge variant='secondary'>{DELIVERY_LABEL[order.deliveryStatus]}</Badge>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Delivery progression card — the audit progression rendered by the shared
// Timeline component (adopted in place of the previous bespoke placeholder).
// ---------------------------------------------------------------------------

function DeliveryTimelineCard({ order }: { order: OrderDetail }) {
    return (
        <Card>
            <CardHeader>
                <Eyebrow>Progress</Eyebrow>
                <CardTitle className='text-lg'>Delivery status</CardTitle>
            </CardHeader>
            <CardContent>
                <Timeline items={buildDeliveryTimeline(order)} />
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Order items card — order lines as theme List Rows (circular thumbnail, bold
// name, quiet meta line, RED line price), closed by a Summary Panel totals
// block: breakdown rows → dashed divider → bold red total.
// ---------------------------------------------------------------------------

function OrderItemsCard({ order }: { order: OrderDetail }) {
    return (
        <Card>
            <CardHeader>
                <div className='flex items-baseline justify-between'>
                    <div className='space-y-1'>
                        <Eyebrow>Items</Eyebrow>
                        <CardTitle className='text-lg'>Order items</CardTitle>
                    </div>
                    <span className='text-sm text-muted-foreground'>
                        {order.items.length} {order.items.length === 1 ? 'position' : 'positions'}
                    </span>
                </div>
            </CardHeader>
            <CardContent className='space-y-2.5'>
                {order.items.length === 0 && (
                    <div className='flex flex-col items-center gap-2 py-8 text-center'>
                        <span className='flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
                            <Package className='size-5' aria-hidden />
                        </span>
                        <p className='text-sm text-muted-foreground'>No items on this order.</p>
                    </div>
                )}
                {order.items.map(line => (
                    <div key={line.id} className='flex items-center gap-4 rounded-2xl border bg-card p-3'>
                        <span className='relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted'>
                            <img
                                src={line.imageUrl}
                                alt=''
                                className='size-full object-cover'
                                referrerPolicy='no-referrer'
                            />
                            <span className='absolute -bottom-0.5 -right-0.5 flex size-6 items-center justify-center rounded-full border-2 border-card bg-foreground text-[11px] font-semibold text-background'>
                                {line.quantity}
                            </span>
                        </span>
                        <div className='min-w-0 flex-1'>
                            <p className='truncate font-semibold text-foreground'>{line.foodName}</p>
                            {line.customisationLabel ? (
                                <p className='truncate text-sm text-muted-foreground'>{line.customisationLabel}</p>
                            ) : (
                                <p className='text-sm text-muted-foreground'>{formatVnd(line.unitPrice)} each</p>
                            )}
                        </div>
                        <span className='shrink-0 font-semibold text-primary'>{formatVnd(line.totalPrice)}</span>
                    </div>
                ))}

                <div className='my-3 border-t border-dashed border-border' />

                <div className='space-y-2.5'>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Total items</span>
                        <span className='font-medium text-foreground'>
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-muted-foreground'>Payment method</span>
                        <span className='font-medium text-foreground'>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</span>
                    </div>
                    {order.deliveryNotes && (
                        <div className='flex items-start gap-2 rounded-2xl bg-muted/40 p-3 text-sm text-muted-foreground'>
                            <StickyNote className='mt-0.5 size-4 shrink-0' aria-hidden />
                            <span>{order.deliveryNotes}</span>
                        </div>
                    )}

                    {/* Summary Panel: dashed divider then the bold red total */}
                    <div className='my-1 border-t border-dashed border-border' />
                    <div className='flex items-center justify-between'>
                        <Eyebrow>Total</Eyebrow>
                        <span className='text-xl font-bold text-primary'>{formatVnd(order.totalAmount)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Payment details card — shown when the order is paid (mirrors the page).
// ---------------------------------------------------------------------------

function PaymentDetailsCard({ order }: { order: OrderDetail }) {
    if (order.paymentStatus !== 'paid') return null;
    return (
        <Card>
            <CardHeader>
                <Eyebrow>Payment</Eyebrow>
                <CardTitle className='text-lg'>Payment details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Amount paid</span>
                    <span className='font-semibold text-primary'>{formatVnd(order.totalAmount)}</span>
                </div>
                <Separator />
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Payment confirmed</span>
                    <span className='font-medium text-foreground'>{order.paidAt}</span>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Payment-status panel — the RIGHT RAIL. The single-select control is the shared
// ToggleGroup (segmented): its own on-state is the only selected affordance. The
// commit ("Save status") is a black structural primary action (NOT a selection
// indicator); the confirm dialog is a ≤2-field edit (theme: dialog for small
// edits, one primary per viewport).
// ---------------------------------------------------------------------------

function PaymentStatusPanel({
    order,
    isPending = false,
    onConfirm,
}: {
    order: OrderDetail;
    isPending?: boolean;
    onConfirm?: (next: PaymentStatus) => void;
}) {
    const [selected, setSelected] = React.useState<PaymentStatus>(order.paymentStatus);
    const [confirming, setConfirming] = React.useState(false);
    const dirty = selected !== order.paymentStatus;

    return (
        <Card>
            <CardHeader>
                <Eyebrow>Update</Eyebrow>
                <CardTitle className='flex items-center gap-2 text-lg'>
                    <Wallet className='size-4 text-muted-foreground' aria-hidden />
                    Payment status
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Current status</span>
                    <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Method</span>
                    <span className='font-medium text-foreground'>{PAYMENT_METHOD_LABEL[order.paymentMethod]}</span>
                </div>

                <Separator />

                <div className='space-y-1.5'>
                    <Eyebrow>Set status</Eyebrow>
                    {/* Single-select control → shared segmented ToggleGroup. The on-state
                        is the sole selection affordance; no Button carries selection. */}
                    <ToggleGroup
                        type='single'
                        variant='segmented'
                        value={selected}
                        onValueChange={value => value && setSelected(value as PaymentStatus)}
                        disabled={isPending}
                        aria-label='Set payment status'
                        className='w-full'
                    >
                        {PAYMENT_STATUS_OPTIONS.map(option => (
                            <ToggleGroupItem key={option.key} value={option.key} aria-label={option.label}>
                                {option.label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                {/* Black structural primary — status is not commerce, so never red.
                    This is an ACTION button, not a selected-state control. */}
                <Button className='w-full' disabled={!dirty || isPending} onClick={() => setConfirming(true)}>
                    {isPending ? (
                        <>
                            <Loader2 className='size-4 animate-spin' aria-hidden />
                            Saving status
                        </>
                    ) : (
                        <>
                            <Check className='size-4' aria-hidden />
                            Save status
                        </>
                    )}
                </Button>
            </CardContent>

            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update payment status?</DialogTitle>
                        <DialogDescription>
                            Change payment status from {order.paymentStatus} to {selected} for {order.slugId}.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={() => setConfirming(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                onConfirm?.(selected);
                                setConfirming(false);
                            }}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Surface shell — dark ambient frame → ONE large-radius light-gray shell filling
// the viewport → white cards. The admin top nav (owned by AdminAppShell) is a
// pinned placeholder at the top of the shell; the order-detail body scrolls
// beneath it in a single scroll region (no double scrollbars).
// ---------------------------------------------------------------------------

function AdminOrderDetailSurface({ body }: { body: React.ReactNode }) {
    return (
        <div className='flex h-screen flex-col bg-frame p-2 sm:p-4'>
            <div className='mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] bg-muted'>
                <NavPlaceholder />

                <div className='min-h-0 flex-1 overflow-y-auto px-3 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6'>
                    <div className='mx-auto w-full max-w-5xl'>{body}</div>
                </div>
            </div>
        </div>
    );
}

function OrderDetailBody({
    order,
    isPending,
    onConfirm,
}: {
    order: OrderDetail;
    isPending?: boolean;
    onConfirm?: (next: PaymentStatus) => void;
}) {
    return (
        <>
            <Button variant='ghost' className='mb-6' size='sm'>
                <ArrowLeft className='size-4' aria-hidden />
                Back to orders
            </Button>

            <div className='space-y-6'>
                <OrderHeader order={order} />

                <div className='grid gap-6 lg:grid-cols-3'>
                    <div className='space-y-6 lg:col-span-2'>
                        <DeliveryTimelineCard order={order} />
                        <OrderItemsCard order={order} />
                        <PaymentDetailsCard order={order} />
                    </div>

                    <div className='space-y-6'>
                        <PaymentStatusPanel order={order} isPending={isPending} onConfirm={onConfirm} />
                    </div>
                </div>
            </div>
        </>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Admin Order Detail',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — a paid order rendered on-theme: order header with the running total
 * in crimson, the shared Timeline showing the delivery progression (Order placed
 * completed, Preparing in progress), order items as a card (line prices crimson),
 * the payment-details card, and the right-rail payment-status panel. The status
 * setter is a segmented ToggleGroup; "Save status" is the single black action.
 */
export const Default: Story = {
    name: 'Default — Paid Order, Items + Payment',
    render: () => <AdminOrderDetailSurface body={<OrderDetailBody order={ORDER} />} />,
};

/**
 * Partial — an unpaid cash-on-delivery order: no payment-details card yet, the
 * status badge reads "Unpaid" (secondary), the Timeline sits at "Order placed",
 * and the right-rail segmented control is ready to mark it paid.
 */
export const Unpaid: Story = {
    name: 'Partial — Unpaid Order (No Payment Details Yet)',
    render: () => <AdminOrderDetailSurface body={<OrderDetailBody order={UNPAID_ORDER} />} />,
};

/**
 * Success — the status-update action in flight: the segmented control is disabled
 * and the black primary reads "Saving status" while the mutation runs (mirrors
 * the page's isPaymentStatusPending state).
 */
export const Saving: Story = {
    name: 'Success — Status Update In Progress',
    render: () => <AdminOrderDetailSurface body={<OrderDetailBody order={UNPAID_ORDER} isPending />} />,
};

/**
 * Interactive — pick a new payment status on the segmented control, then Save:
 * the confirm dialog (a ≤2-field edit) opens before the change is applied,
 * matching the page's confirm-before-update flow. Confirming applies the status.
 */
export const Interactive: Story = {
    name: 'Interactive — Update Payment Status (Confirm)',
    render: () => {
        function Harness() {
            const [current, setCurrent] = React.useState<PaymentStatus>(UNPAID_ORDER.paymentStatus);
            return (
                <AdminOrderDetailSurface
                    body={
                        <OrderDetailBody order={{ ...UNPAID_ORDER, paymentStatus: current }} onConfirm={setCurrent} />
                    }
                />
            );
        }
        return <Harness />;
    },
};

/**
 * Loading — the order is being fetched; the shell shows a centred spinner in the
 * content zone (mirrors the page's isLoading branch).
 */
export const Loading: Story = {
    name: 'Loading — Fetching Order',
    render: () => (
        <AdminOrderDetailSurface
            body={
                <div className='flex min-h-[60vh] w-full items-center justify-center'>
                    <Spinner size='lg' />
                </div>
            }
        />
    ),
};

/**
 * Error — the order failed to load. A quiet error state offers the one recovery
 * action (Back to orders), with no dead end (theme: error says what to do next).
 */
export const ErrorState: Story = {
    name: 'Error — Failed To Load Order',
    render: () => (
        <AdminOrderDetailSurface
            body={
                <>
                    <Button variant='ghost' className='mb-8' size='sm'>
                        <ArrowLeft className='size-4' aria-hidden />
                        Back to orders
                    </Button>
                    <div className='mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center'>
                        <span className='flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive'>
                            <AlertTriangle className='size-6' aria-hidden />
                        </span>
                        <div className='space-y-1'>
                            <h2 className='text-lg font-semibold text-foreground'>Couldn’t load this order</h2>
                            <p className='text-sm text-muted-foreground'>
                                Something went wrong fetching the order. Go back and open it again.
                            </p>
                        </div>
                        <Button>
                            <ArrowLeft className='size-4' aria-hidden />
                            Back to orders
                        </Button>
                    </div>
                </>
            }
        />
    ),
};

/**
 * Empty — an order with no line items (an edge state): the items card shows a
 * quiet empty message while the Timeline, summary + payment panel still render.
 */
export const Empty: Story = {
    name: 'Empty — Order With No Items',
    render: () => (
        <AdminOrderDetailSurface
            body={
                <OrderDetailBody
                    order={{ ...ORDER, items: [], totalAmount: 0, paymentStatus: 'unpaid', paidAt: null }}
                />
            }
        />
    ),
};
