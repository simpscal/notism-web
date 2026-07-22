import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, ClipboardList, Clock, ShoppingBag, StickyNote } from 'lucide-react';
import React from 'react';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import { Separator } from '@/uis/separator';
import { Skeleton } from '@/uis/skeleton';

// ---------------------------------------------------------------------------
// Implementation reference — sprint-7 refund status on the customer ORDERS LIST.
//
// The customer orders-list page already exists (src/pages/orders/orders.tsx,
// route `orders`) and renders one Card per order with a delivery-status badge,
// item summary, surcharge-inclusive total, and a "View details" CTA. This story
// adds, ON EACH ORDER ROW, an inline refund-status badge when that order has a
// refund — so the customer sees refund progress without opening the order.
//
// The refund-status model + badge styling + copy are reused VERBATIM from
// CustomerRefundTracking.stories.tsx (the order-detail surface) so the list view
// stays consistent with the detail view:
//   • Customer-visible refund status is ONLY Pending | Paid (locked sprint-7
//     decision). A failed/retrying transfer still reads "Refund pending" —
//     Failed is never surfaced to the customer.
//   • Pending → warning Badge + Clock + "Refund pending".
//   • Paid    → success Badge + CheckCircle2 + "Refund sent".
//   • Orders with no refund show nothing new (unchanged).
//
// Everything outside the order rows (nav, hero) is unchanged → labelled
// placeholders. Mock-only fixtures; no api/model/state imports.
// ---------------------------------------------------------------------------

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrderLineItem {
    foodName: string;
    customisationLabel: string | null;
    surcharge: number;
    basePrice: number;
    quantity: number;
}

/**
 * Customer-visible refund status. A Failed/retrying refund is intentionally NOT
 * surfaced to the customer as "Failed" — it reads as Pending until terminal Paid.
 * So the customer list view models just Pending | Paid (matches the detail view).
 */
type CustomerRefundStatus = 'pending' | 'paid';

interface Order {
    id: string;
    ref: string;
    placedAt: string;
    status: 'delivered' | 'preparing' | 'cancelled';
    items: OrderLineItem[];
    deliveryNotes: string | null;
    /** Present only when this order has a refund; null → no refund (unchanged row). */
    refundStatus: CustomerRefundStatus | null;
}

function lineTotal(item: OrderLineItem): number {
    return (item.basePrice + (item.surcharge ?? 0)) * item.quantity;
}

function orderTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + lineTotal(item), 0);
}

// ---------------------------------------------------------------------------
// Mock order history data — a mix of refund / no-refund orders.
// ---------------------------------------------------------------------------

const ORDERS: Order[] = [
    {
        id: 'ord-1',
        ref: 'ORD-20260531-2241',
        placedAt: '31 May 2026, 19:42',
        status: 'cancelled',
        deliveryNotes: null,
        // Cancelled paid order → refund created on cancel, still in flight → Pending.
        refundStatus: 'pending',
        items: [
            {
                foodName: 'Grilled Salmon',
                customisationLabel: 'Large (260 g)',
                surcharge: 30000,
                basePrice: 185000,
                quantity: 1,
            },
            {
                foodName: 'Beef Pho',
                customisationLabel: null,
                surcharge: 0,
                basePrice: 95000,
                quantity: 2,
            },
        ],
    },
    {
        id: 'ord-2',
        ref: 'ORD-20260528-9104',
        placedAt: '28 May 2026, 12:15',
        status: 'delivered',
        deliveryNotes: 'Please leave at the door — do not ring the bell.',
        // Refund requested after delivery, transfer already sent → Paid.
        refundStatus: 'paid',
        items: [
            {
                foodName: 'Vegetable Fried Rice',
                customisationLabel: null,
                surcharge: 0,
                basePrice: 75000,
                quantity: 1,
            },
            {
                foodName: 'Mango Smoothie',
                customisationLabel: null,
                surcharge: 0,
                basePrice: 55000,
                quantity: 2,
            },
        ],
    },
    {
        id: 'ord-3',
        ref: 'ORD-20260601-7843',
        placedAt: '1 Jun 2026, 08:30',
        status: 'preparing',
        deliveryNotes: 'Call me when you arrive — apartment is on the 4th floor.',
        // No refund → row is unchanged, no refund badge shown.
        refundStatus: null,
        items: [
            {
                foodName: 'Wagyu Beef Steak',
                customisationLabel: 'Medium-rare, 300 g',
                surcharge: 85000,
                basePrice: 395000,
                quantity: 1,
            },
            {
                foodName: 'Caesar Salad',
                customisationLabel: null,
                surcharge: 0,
                basePrice: 89000,
                quantity: 1,
            },
        ],
    },
    {
        id: 'ord-4',
        ref: 'ORD-20260520-3356',
        placedAt: '20 May 2026, 20:05',
        status: 'delivered',
        deliveryNotes: null,
        // No refund → row is unchanged.
        refundStatus: null,
        items: [
            {
                foodName: 'Banh Mi Thit',
                customisationLabel: 'Extra chilli',
                surcharge: 5000,
                basePrice: 45000,
                quantity: 3,
            },
        ],
    },
];

// ---------------------------------------------------------------------------
// Delivery-status badge — matches OrdersPage.stories.tsx
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<
    Order['status'],
    { label: string; variant: 'success' | 'secondary' | 'destructive' | 'outline' }
> = {
    delivered: { label: 'Delivered', variant: 'success' },
    preparing: { label: 'Preparing', variant: 'secondary' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
};

function StatusBadge({ status }: { status: Order['status'] }) {
    const cfg = STATUS_CONFIG[status];
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}

// ---------------------------------------------------------------------------
// Refund-status badge — reused VERBATIM from CustomerRefundTracking.stories.tsx
// so the list view matches the detail view. Pending | Paid only.
// ---------------------------------------------------------------------------

function RefundBadge({ status }: { status: CustomerRefundStatus }) {
    if (status === 'paid') {
        return (
            <Badge variant='success' className='gap-1'>
                <CheckCircle2 className='h-3 w-3' />
                Refund sent
            </Badge>
        );
    }

    return (
        <Badge variant='warning' className='gap-1'>
            <Clock className='h-3 w-3' />
            Refund pending
        </Badge>
    );
}

// ---------------------------------------------------------------------------
// Shared page shell — matches OrdersPage.stories.tsx
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {/* Top bar — placeholder; exists in current system, not changed by this sprint */}
            <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
                <div className='h-px w-6 bg-muted-foreground/30' />
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    nav placeholder
                </span>
                <div className='h-px w-6 bg-muted-foreground/30' />
            </div>
            {/* Hero banner — placeholder; exists in current system, not changed by this sprint */}
            <div className='flex h-[100px] items-center justify-center border-b border-dashed bg-muted/20'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                    hero banner placeholder
                </span>
            </div>
            <div className='container mx-auto max-w-3xl px-4 py-8'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Order row card — existing layout, with the inline refund badge added in the
// header. Refund badge sits next to the delivery-status badge; orders without a
// refund render exactly as today (no new element).
// ---------------------------------------------------------------------------

function OrderRowCard({ order }: { order: Order }) {
    const total = orderTotal(order);
    const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);
    const hasSurcharges = order.items.some(i => i.surcharge > 0);

    return (
        <Card>
            <CardHeader className='pb-0'>
                <div className='flex items-start justify-between gap-4'>
                    <div className='space-y-1'>
                        <CardTitle className='font-mono text-sm text-muted-foreground'>{order.ref}</CardTitle>
                        <p className='text-xs text-muted-foreground'>{order.placedAt}</p>
                    </div>
                    {/* Status cluster — delivery status, plus the refund badge when
                        this order has a refund (sprint-7 addition). */}
                    <div className='flex flex-wrap items-center justify-end gap-2'>
                        <StatusBadge status={order.status} />
                        {order.refundStatus && <RefundBadge status={order.refundStatus} />}
                    </div>
                </div>
            </CardHeader>
            <CardContent className='space-y-3'>
                <p className='text-sm text-muted-foreground'>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    {hasSurcharges ? ' · includes customisation surcharges' : ''}
                </p>

                {order.deliveryNotes && (
                    <div className='flex items-start gap-1.5 text-sm text-muted-foreground'>
                        <StickyNote className='mt-0.5 h-3.5 w-3.5 shrink-0' />
                        <span>{order.deliveryNotes}</span>
                    </div>
                )}

                <Separator />

                <div className='flex items-center justify-between'>
                    <div>
                        <p className='text-xs text-muted-foreground'>Order total</p>
                        <p className='text-base font-bold text-foreground'>{formatVnd(total)}</p>
                    </div>
                    <Button variant='outline' size='sm'>
                        View details
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// List page
// ---------------------------------------------------------------------------

function OrdersListPage({ orders }: { orders: Order[] }) {
    return (
        <PageShell>
            <div className='mb-6 flex items-center gap-2'>
                <ClipboardList className='h-5 w-5 text-primary' />
                <h2 className='text-2xl font-bold text-foreground'>My Orders</h2>
            </div>
            <p className='mb-6 text-sm text-muted-foreground'>
                Orders with a refund show its status here — open the order for full refund details.
            </p>

            <div className='space-y-4'>
                {orders.map(order => (
                    <OrderRowCard key={order.id} order={order} />
                ))}
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Loading + Empty — match OrdersPage.stories.tsx
// ---------------------------------------------------------------------------

function LoadingOrdersPage() {
    return (
        <PageShell>
            <Skeleton className='mb-6 h-8 w-40' />
            <Skeleton className='mb-6 h-4 w-72' />

            <div className='space-y-4'>
                {[1, 2, 3].map(i => (
                    <Card key={i}>
                        <CardHeader className='pb-0'>
                            <div className='flex items-start justify-between gap-4'>
                                <div className='space-y-1.5'>
                                    <Skeleton className='h-4 w-44' />
                                    <Skeleton className='h-3 w-32' />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <Skeleton className='h-5 w-20 rounded-full' />
                                    <Skeleton className='h-5 w-24 rounded-full' />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            <Skeleton className='h-3.5 w-36' />
                            <Separator />
                            <div className='flex items-center justify-between'>
                                <div className='space-y-1.5'>
                                    <Skeleton className='h-3 w-20' />
                                    <Skeleton className='h-5 w-28' />
                                </div>
                                <Skeleton className='h-8 w-24 rounded-md' />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </PageShell>
    );
}

function EmptyOrdersPage() {
    return (
        <PageShell>
            <div className='mb-6 flex items-center gap-2'>
                <ClipboardList className='h-5 w-5 text-primary' />
                <h2 className='text-2xl font-bold text-foreground'>My Orders</h2>
            </div>

            <div className='flex flex-col items-center rounded-2xl border border-dashed py-20 text-center'>
                <ShoppingBag className='mb-4 h-12 w-12 text-muted-foreground/40' />
                <h3 className='mb-1 text-base font-semibold text-foreground'>No orders yet</h3>
                <p className='mb-6 max-w-xs text-sm text-muted-foreground'>
                    When you place your first order it will appear here, with any refund status shown right on the
                    order.
                </p>
                <Button>Browse the menu</Button>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Orders List Refund Status',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — mixed list: a Pending refund, a Paid refund, and orders with no
 *  refund (which render exactly as today, no refund badge). */
export const Default: Story = {
    name: 'Default — Mixed Refund / No-Refund Orders',
    render: () => <OrdersListPage orders={ORDERS} />,
};

/** Refund pending — an order whose refund is still in flight. A failed/retrying
 *  transfer reads identically here ("Refund pending"); Failed is never surfaced. */
export const RefundPending: Story = {
    name: 'Refund Pending Badge',
    render: () => <OrdersListPage orders={[ORDERS[0]]} />,
};

/** Refund paid — an order whose refund transfer has been sent ("Refund sent"). */
export const RefundPaid: Story = {
    name: 'Refund Paid Badge',
    render: () => <OrdersListPage orders={[ORDERS[1]]} />,
};

/** No refund — orders without a refund are unchanged; no refund badge appears. */
export const NoRefund: Story = {
    name: 'No Refund — Unchanged Rows',
    render: () => <OrdersListPage orders={[ORDERS[2], ORDERS[3]]} />,
};

/** Loading — skeleton list (row header reserves space for both badges). */
export const Loading: Story = {
    name: 'Loading — Skeleton',
    render: () => <LoadingOrdersPage />,
};

/** Empty — no orders placed yet. */
export const Empty: Story = {
    name: 'Empty — No Orders Placed',
    render: () => <EmptyOrdersPage />,
};
