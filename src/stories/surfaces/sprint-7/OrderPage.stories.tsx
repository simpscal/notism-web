import type { Meta, StoryObj } from '@storybook/react-vite';
import { Package } from 'lucide-react';

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

interface OrderItem {
    id: string;
    foodName: string;
    /** customisation label e.g. "Large (260 g)" */
    variantLabel: string | null;
    /** surcharge on top of base price */
    surcharge: number;
    basePrice: number;
    quantity: number;
    /** placeholder colour for thumbnail — no network requests */
    thumbColor: string;
}

function itemUnitPrice(item: OrderItem): number {
    return item.basePrice + item.surcharge;
}

function itemTotal(item: OrderItem): number {
    return itemUnitPrice(item) * item.quantity;
}

function orderTotal(items: OrderItem[]): number {
    return items.reduce((sum, i) => sum + itemTotal(i), 0);
}

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

const ITEMS: OrderItem[] = [
    {
        id: 'oi-1',
        foodName: 'Grilled Salmon',
        variantLabel: 'Large (260 g)',
        surcharge: 30_000,
        basePrice: 185_000,
        quantity: 1,
        thumbColor: '#f97316',
    },
    {
        id: 'oi-2',
        foodName: 'Beef Pho',
        variantLabel: null,
        surcharge: 0,
        basePrice: 95_000,
        quantity: 2,
        thumbColor: '#8b5cf6',
    },
    {
        id: 'oi-3',
        foodName: 'Spring Rolls',
        variantLabel: 'Extra sauce',
        surcharge: 5_000,
        basePrice: 55_000,
        quantity: 3,
        thumbColor: '#22c55e',
    },
];

// ---------------------------------------------------------------------------
// Inline: OrderItemsCard — FOCUS of sprint 7
// Total = sum of (basePrice + surcharge) × quantity (surcharge-inclusive)
// ---------------------------------------------------------------------------

function OrderItemsCard({ items }: { items: OrderItem[] }) {
    const total = orderTotal(items);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-4'>
                    {items.map(item => (
                        <div key={item.id} className='flex gap-4'>
                            {/* Thumbnail placeholder — coloured div, no network */}
                            <div
                                className='relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl'
                                style={{ backgroundColor: item.thumbColor + '33' }}
                            >
                                <div
                                    className='flex h-full w-full items-center justify-center'
                                    style={{ color: item.thumbColor }}
                                >
                                    <Package className='h-8 w-8 opacity-60' />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <div className='font-medium'>{item.foodName}</div>
                                {item.variantLabel && (
                                    <div className='text-sm text-muted-foreground'>{item.variantLabel}</div>
                                )}
                                <div className='text-sm text-muted-foreground'>Qty: {item.quantity}</div>
                                <div className='mt-1 font-bold'>
                                    {formatVnd(itemUnitPrice(item))}{' '}
                                    <span className='text-xs font-normal text-muted-foreground'>each</span>
                                </div>
                            </div>
                            <div className='text-right'>
                                <div className='font-bold'>{formatVnd(itemTotal(item))}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Payment method</span>
                        <span className='font-medium capitalize'>Cash</span>
                    </div>
                    <div className='flex justify-between text-xl font-black'>
                        <span>Total</span>
                        <span>{formatVnd(total)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

function NavPlaceholder() {
    return (
        <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
            <div className='h-px w-6 bg-muted-foreground/30' />
            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                nav placeholder
            </span>
            <div className='h-px w-6 bg-muted-foreground/30' />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story: Delivered
// ---------------------------------------------------------------------------

function DeliveredPage() {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <NavPlaceholder />

            {/* Hero banner — placeholder; exists in current system, not changed by this sprint */}
            <div className='flex h-[120px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                    hero banner placeholder
                </span>
            </div>

            <div className='container mx-auto max-w-4xl px-4 py-6'>
                <div className='space-y-6'>
                    {/* Order header card — placeholder; exists in current system, not changed by this sprint */}
                    <div className='flex h-[80px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                        <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                            order header card placeholder
                        </span>
                    </div>

                    <div className='grid gap-6 lg:grid-cols-[2fr_1fr]'>
                        {/* Left column */}
                        <div className='space-y-6'>
                            {/* Delivery status timeline — placeholder; exists in current system, not changed by this sprint */}
                            <div className='flex h-[160px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                                    delivery status timeline placeholder
                                </span>
                            </div>

                            <OrderItemsCard items={ITEMS} />
                        </div>

                        {/* Right column */}
                        <div>
                            {/* Sidebar order action card — placeholder; exists in current system, not changed by this sprint */}
                            <div className='flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                                    sidebar order action card placeholder
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story: Preparing
// ---------------------------------------------------------------------------

function PreparingPage() {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <NavPlaceholder />

            {/* Hero banner — placeholder; exists in current system, not changed by this sprint */}
            <div className='flex h-[120px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                    hero banner placeholder
                </span>
            </div>

            <div className='container mx-auto max-w-4xl px-4 py-6'>
                <div className='space-y-6'>
                    {/* Order header card — placeholder; exists in current system, not changed by this sprint */}
                    <div className='flex h-[80px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                        <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                            order header card placeholder
                        </span>
                    </div>

                    <div className='grid gap-6 lg:grid-cols-[2fr_1fr]'>
                        {/* Left column */}
                        <div className='space-y-6'>
                            {/* Delivery status timeline — placeholder; exists in current system, not changed by this sprint */}
                            <div className='flex h-[160px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                                    delivery status timeline placeholder
                                </span>
                            </div>

                            <OrderItemsCard items={ITEMS} />
                        </div>

                        {/* Right column */}
                        <div>
                            {/* Sidebar order action card — placeholder; exists in current system, not changed by this sprint */}
                            <div className='flex h-[200px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                                    sidebar order action card placeholder
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story: Loading
// ---------------------------------------------------------------------------

function LoadingPage() {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <NavPlaceholder />

            {/* Hero banner skeleton — matches h-[120px] placeholder */}
            <Skeleton className='h-[120px] w-full rounded-none' />

            <div className='container mx-auto max-w-4xl px-4 py-6'>
                <div className='space-y-6'>
                    {/* Order header skeleton — matches h-[80px] placeholder */}
                    <Skeleton className='h-[80px] w-full rounded-xl' />

                    <div className='grid gap-6 lg:grid-cols-[2fr_1fr]'>
                        {/* Left column skeleton */}
                        <div className='space-y-6'>
                            {/* Delivery timeline skeleton — matches h-[160px] placeholder */}
                            <Skeleton className='h-[160px] w-full rounded-xl' />

                            {/* Items card skeleton */}
                            <Card>
                                <CardHeader>
                                    <Skeleton className='h-5 w-28' />
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className='flex gap-4'>
                                            <Skeleton className='h-20 w-20 rounded-xl' />
                                            <div className='flex-1 space-y-2'>
                                                <Skeleton className='h-4 w-40' />
                                                <Skeleton className='h-3 w-28' />
                                                <Skeleton className='h-3 w-20' />
                                                <Skeleton className='h-4 w-24' />
                                            </div>
                                            <Skeleton className='h-5 w-20' />
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className='space-y-2'>
                                        <div className='flex justify-between'>
                                            <Skeleton className='h-4 w-32' />
                                            <Skeleton className='h-4 w-16' />
                                        </div>
                                        <div className='flex justify-between'>
                                            <Skeleton className='h-6 w-16' />
                                            <Skeleton className='h-6 w-28' />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar skeleton — matches h-[200px] placeholder */}
                        <div>
                            <Skeleton className='h-[200px] w-full rounded-xl' />
                        </div>
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
    title: 'Surfaces/Sprint 7/Order Page',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Delivered: Story = {
    name: 'Delivered — All Steps Complete',
    render: () => <DeliveredPage />,
};

export const Preparing: Story = {
    name: 'Preparing — In Progress, Cancel Available',
    render: () => <PreparingPage />,
};

export const Loading: Story = {
    name: 'Loading — Skeleton State',
    render: () => <LoadingPage />,
};
