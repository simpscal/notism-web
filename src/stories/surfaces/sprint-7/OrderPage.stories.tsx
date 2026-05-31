import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, ChevronRight, Package } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card';
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
    id: string;
    foodName: string;
    customisationLabel: string | null;
    surcharge: number;
    basePrice: number;
    quantity: number;
}

function lineTotal(item: OrderLineItem): number {
    return (item.basePrice + item.surcharge) * item.quantity;
}

// ---------------------------------------------------------------------------
// Mock order data
// ---------------------------------------------------------------------------

const ORDER_ITEMS: OrderLineItem[] = [
    {
        id: 'oi-1',
        foodName: 'Grilled Salmon',
        customisationLabel: 'Large (260 g)',
        surcharge: 30000,
        basePrice: 185000,
        quantity: 1,
    },
    {
        id: 'oi-2',
        foodName: 'Beef Pho',
        customisationLabel: null,
        surcharge: 0,
        basePrice: 95000,
        quantity: 2,
    },
    {
        id: 'oi-3',
        foodName: 'Spring Rolls',
        customisationLabel: 'Extra sauce (+5,000 ₫)',
        surcharge: 5000,
        basePrice: 55000,
        quantity: 3,
    },
];

const TAX_RATE = 0.08;

function computeSubtotal(items: OrderLineItem[]): number {
    return items.reduce((sum, item) => sum + lineTotal(item), 0);
}

function computeTax(subtotal: number): number {
    return Math.round(subtotal * TAX_RATE);
}

function computeTotal(subtotal: number): number {
    return subtotal + computeTax(subtotal);
}

const SUBTOTAL = computeSubtotal(ORDER_ITEMS);
const TAX = computeTax(SUBTOTAL);
const TOTAL = computeTotal(SUBTOTAL);

// ---------------------------------------------------------------------------
// Shared page shell
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <header className='sticky top-0 z-50 border-b bg-background'>
                <div className='flex h-16 items-center px-4 md:px-6'>
                    <h1 className='text-lg font-semibold tracking-tight text-primary md:text-2xl'>Notism</h1>
                    <div className='ml-4 hidden items-center gap-1 text-sm text-muted-foreground md:flex'>
                        <span>Cart</span>
                        <ChevronRight className='h-3.5 w-3.5' />
                        <span className='font-medium text-foreground'>Order</span>
                        <ChevronRight className='h-3.5 w-3.5' />
                        <span>Payment</span>
                    </div>
                </div>
            </header>
            <div className='container mx-auto max-w-3xl px-4 py-8'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Shared order items list
// ---------------------------------------------------------------------------

function OrderItemsList({ items }: { items: OrderLineItem[] }) {
    return (
        <div className='space-y-0 divide-y'>
            {items.map(item => {
                const total = lineTotal(item);
                return (
                    <div key={item.id} className='flex items-start justify-between py-3'>
                        <div className='space-y-0.5'>
                            <p className='text-sm font-medium text-foreground'>{item.foodName}</p>
                            {item.customisationLabel && (
                                <p className='text-xs text-muted-foreground'>{item.customisationLabel}</p>
                            )}
                            <p className='text-xs text-muted-foreground'>
                                {formatVnd(item.basePrice + item.surcharge)} × {item.quantity}
                            </p>
                        </div>
                        <span className='text-sm font-semibold text-foreground'>{formatVnd(total)}</span>
                    </div>
                );
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Shared totals breakdown
// ---------------------------------------------------------------------------

function TotalsBreakdown({ subtotal, tax, total }: { subtotal: number; tax: number; total: number }) {
    return (
        <div className='space-y-2'>
            <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span>{formatVnd(subtotal)}</span>
            </div>
            <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Tax (8%)</span>
                <span>{formatVnd(tax)}</span>
            </div>
            <Separator />
            <div className='flex justify-between text-base font-bold'>
                <span>Total</span>
                <span className='text-primary'>{formatVnd(total)}</span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story: OrderReview
// ---------------------------------------------------------------------------

function OrderReviewPage() {
    return (
        <PageShell>
            <h2 className='mb-2 text-2xl font-bold text-foreground'>Review your order</h2>
            <p className='mb-6 text-sm text-muted-foreground'>
                Check everything looks correct before proceeding to payment.
            </p>

            <div className='space-y-6'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='flex items-center gap-2 text-base'>
                            <Package className='h-4 w-4' />
                            Items ({ORDER_ITEMS.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <OrderItemsList items={ORDER_ITEMS} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-base'>Price breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <TotalsBreakdown subtotal={SUBTOTAL} tax={TAX} total={TOTAL} />
                    </CardContent>
                    <CardFooter className='flex flex-col gap-2'>
                        <Button className='w-full' size='lg'>
                            Continue to payment — {formatVnd(TOTAL)}
                        </Button>
                        <Button variant='ghost' className='w-full text-sm text-muted-foreground'>
                            Back to cart
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: OrderConfirmation
// ---------------------------------------------------------------------------

function OrderConfirmationPage() {
    const orderRef = 'ORD-20260601-7843';

    return (
        <PageShell>
            {/* Success banner */}
            <div className='mb-8 flex flex-col items-center rounded-2xl bg-primary/5 px-6 py-10 text-center'>
                <CheckCircle2 className='mb-4 h-14 w-14 text-primary' />
                <h2 className='mb-1 text-2xl font-bold text-foreground'>Order confirmed!</h2>
                <p className='mb-3 text-sm text-muted-foreground'>
                    Thank you for your order. We are preparing your food now.
                </p>
                <Badge variant='outline' className='font-mono text-sm'>
                    {orderRef}
                </Badge>
            </div>

            <div className='space-y-6'>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardTitle className='text-base'>Order summary</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <OrderItemsList items={ORDER_ITEMS} />
                        <Separator />
                        <TotalsBreakdown subtotal={SUBTOTAL} tax={TAX} total={TOTAL} />
                    </CardContent>
                </Card>

                <div className='flex gap-3'>
                    <Button variant='outline' className='flex-1'>
                        Track order
                    </Button>
                    <Button className='flex-1'>Browse menu</Button>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Loading
// ---------------------------------------------------------------------------

function LoadingOrderPage() {
    return (
        <PageShell>
            <Skeleton className='mb-2 h-8 w-56' />
            <Skeleton className='mb-6 h-4 w-72' />

            <div className='space-y-6'>
                <Card>
                    <CardHeader>
                        <Skeleton className='h-5 w-32' />
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {[1, 2, 3].map(i => (
                            <div key={i} className='flex justify-between'>
                                <div className='space-y-1.5'>
                                    <Skeleton className='h-4 w-40' />
                                    <Skeleton className='h-3 w-28' />
                                    <Skeleton className='h-3 w-24' />
                                </div>
                                <Skeleton className='h-4 w-20' />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Skeleton className='h-5 w-36' />
                    </CardHeader>
                    <CardContent className='space-y-3'>
                        <div className='flex justify-between'>
                            <Skeleton className='h-4 w-20' />
                            <Skeleton className='h-4 w-24' />
                        </div>
                        <div className='flex justify-between'>
                            <Skeleton className='h-4 w-16' />
                            <Skeleton className='h-4 w-20' />
                        </div>
                        <Separator />
                        <div className='flex justify-between'>
                            <Skeleton className='h-5 w-12' />
                            <Skeleton className='h-5 w-28' />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className='h-10 w-full rounded-md' />
                    </CardFooter>
                </Card>
            </div>
        </PageShell>
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

export const OrderReview: Story = {
    name: 'Order Review — Surcharge-Inclusive Total',
    render: () => <OrderReviewPage />,
};

export const OrderConfirmation: Story = {
    name: 'Order Confirmation — Total with All Surcharges',
    render: () => <OrderConfirmationPage />,
};

export const Loading: Story = {
    name: 'Loading — Skeleton',
    render: () => <LoadingOrderPage />,
};
