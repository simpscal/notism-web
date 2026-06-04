import type { Meta, StoryObj } from '@storybook/react-vite';
import { ClipboardList, ShoppingBag, StickyNote } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';

// ---------------------------------------------------------------------------
// Utilities
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

interface Order {
    id: string;
    ref: string;
    placedAt: string;
    status: 'delivered' | 'preparing' | 'cancelled';
    items: OrderLineItem[];
    deliveryNote: string | null;
}

function lineTotal(item: OrderLineItem): number {
    return (item.basePrice + (item.surcharge ?? 0)) * item.quantity;
}

function orderTotal(order: Order): number {
    return order.items.reduce((sum, item) => sum + lineTotal(item), 0);
}

// ---------------------------------------------------------------------------
// Mock order history data
// ---------------------------------------------------------------------------

const ORDERS: Order[] = [
    {
        id: 'ord-1',
        ref: 'ORD-20260531-2241',
        placedAt: '31 May 2026, 19:42',
        status: 'delivered',
        deliveryNote: 'Please leave at the door — do not ring the bell.',
        items: [
            // surcharge applies
            {
                foodName: 'Grilled Salmon',
                customisationLabel: 'Large (260 g)',
                surcharge: 30000,
                basePrice: 185000,
                quantity: 1,
            },
            // no surcharge
            {
                foodName: 'Beef Pho',
                customisationLabel: null,
                surcharge: 0,
                basePrice: 95000,
                quantity: 2,
            },
            // surcharge applies
            {
                foodName: 'Spring Rolls',
                customisationLabel: 'Extra sauce',
                surcharge: 5000,
                basePrice: 55000,
                quantity: 3,
            },
        ],
    },
    {
        id: 'ord-2',
        ref: 'ORD-20260528-9104',
        placedAt: '28 May 2026, 12:15',
        status: 'delivered',
        deliveryNote: null,
        items: [
            // no surcharge on any item
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
        deliveryNote: 'Call me when you arrive — apartment is on the 4th floor.',
        items: [
            // surcharge only
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
        status: 'cancelled',
        deliveryNote: null,
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
// Status badge
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
// Shared page shell — matches OrderPage.stories.tsx
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {/* Top bar — placeholder; not the focus of this story */}
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
// Order row card
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
                    <StatusBadge status={order.status} />
                </div>
            </CardHeader>
            <CardContent className='space-y-3'>
                {/* Item summary */}
                <p className='text-sm text-muted-foreground'>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    {hasSurcharges ? ' · includes customisation surcharges' : ''}
                </p>

                {order.deliveryNote && (
                    <div className='flex items-start gap-1.5 text-sm text-muted-foreground'>
                        <StickyNote className='mt-0.5 h-3.5 w-3.5 shrink-0' />
                        <span>{order.deliveryNote}</span>
                    </div>
                )}

                <Separator />

                {/* Surcharge-inclusive total + CTA */}
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
// Story: Default — orders list with surcharge-inclusive totals
// ---------------------------------------------------------------------------

function OrdersListPage() {
    return (
        <PageShell>
            <div className='mb-6 flex items-center gap-2'>
                <ClipboardList className='h-5 w-5 text-primary' />
                <h2 className='text-2xl font-bold text-foreground'>My Orders</h2>
            </div>
            <p className='mb-6 text-sm text-muted-foreground'>
                Each total shown includes any customisation surcharges applied to your items.
            </p>

            <div className='space-y-4'>
                {ORDERS.map(order => (
                    <OrderRowCard key={order.id} order={order} />
                ))}
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Loading — skeleton list
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
                                <Skeleton className='h-5 w-20 rounded-full' />
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

// ---------------------------------------------------------------------------
// Story: Empty — no orders placed yet
// ---------------------------------------------------------------------------

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
                    When you place your first order it will appear here with the full surcharge-inclusive total.
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
    title: 'Surfaces/Sprint 7/Orders Page',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default — Orders List with Surcharge-Inclusive Totals',
    render: () => <OrdersListPage />,
};

export const Loading: Story = {
    name: 'Loading — Skeleton',
    render: () => <LoadingOrdersPage />,
};

export const Empty: Story = {
    name: 'Empty — No Orders Placed',
    render: () => <EmptyOrdersPage />,
};
