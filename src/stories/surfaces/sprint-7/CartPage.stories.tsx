import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/uis/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/uis/select';
import { Separator } from '@/uis/separator';
import { Skeleton } from '@/uis/skeleton';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CartCustomisation {
    groupId: string;
    groupLabel: string;
    selectedValue: string;
    selectedLabel: string;
    surcharge: number;
    options: { value: string; label: string; surcharge: number }[];
}

interface CartLineItem {
    id: string;
    foodName: string;
    imageUrl: string;
    basePrice: number;
    quantity: number;
    customisation: CartCustomisation | null;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PORTION_OPTIONS = [
    { value: 'regular', label: 'Regular (180 g)', surcharge: 0 },
    { value: 'large', label: 'Large (260 g)', surcharge: 30000 },
];

const INITIAL_CART_DEFAULT: CartLineItem[] = [
    {
        id: 'item-1',
        foodName: 'Grilled Salmon',
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&h=120&fit=crop',
        basePrice: 185000,
        quantity: 1,
        customisation: {
            groupId: 'size',
            groupLabel: 'Portion size',
            selectedValue: 'large',
            selectedLabel: 'Large (260 g)',
            surcharge: 30000,
            options: PORTION_OPTIONS,
        },
    },
    {
        id: 'item-2',
        foodName: 'Beef Pho',
        imageUrl: 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=120&h=120&fit=crop',
        basePrice: 95000,
        quantity: 2,
        customisation: null,
    },
];

const INITIAL_CART_SURCHARGE_CHANGED: CartLineItem[] = [
    {
        ...INITIAL_CART_DEFAULT[0],
        customisation: {
            groupId: 'size',
            groupLabel: 'Portion size',
            selectedValue: 'regular',
            selectedLabel: 'Regular (180 g)',
            surcharge: 0,
            options: PORTION_OPTIONS,
        },
    },
    INITIAL_CART_DEFAULT[1],
];

// ---------------------------------------------------------------------------
// Line item — unit price = base + surcharge
// ---------------------------------------------------------------------------

function lineTotal(item: CartLineItem): number {
    const surcharge = item.customisation?.surcharge ?? 0;
    return (item.basePrice + surcharge) * item.quantity;
}

function unitPrice(item: CartLineItem): number {
    return item.basePrice + (item.customisation?.surcharge ?? 0);
}

// ---------------------------------------------------------------------------
// CartLineItemRow
// ---------------------------------------------------------------------------

interface CartLineItemRowProps {
    item: CartLineItem;
    onQuantityChange: (id: string, qty: number) => void;
    onCustomisationChange: (id: string, value: string) => void;
    onRemove: (id: string) => void;
}

function CartLineItemRow({ item, onQuantityChange, onCustomisationChange, onRemove }: CartLineItemRowProps) {
    const unit = unitPrice(item);
    const total = lineTotal(item);
    const hasSurcharge = (item.customisation?.surcharge ?? 0) > 0;

    return (
        <div className='flex gap-4 py-5'>
            {/* Thumbnail */}
            <div className='h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted'>
                <img src={item.imageUrl} alt={item.foodName} className='h-full w-full object-cover' />
            </div>

            {/* Details */}
            <div className='flex flex-1 flex-col gap-2'>
                <div className='flex items-start justify-between'>
                    <span className='text-sm font-semibold text-foreground'>{item.foodName}</span>
                    <button
                        className='text-muted-foreground hover:text-destructive transition-colors'
                        onClick={() => onRemove(item.id)}
                        aria-label='Remove item'
                    >
                        <Trash2 className='h-4 w-4' />
                    </button>
                </div>

                {/* Customisation selector */}
                {item.customisation && (
                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-muted-foreground'>{item.customisation.groupLabel}:</span>
                        <Select
                            value={item.customisation.selectedValue}
                            onValueChange={val => onCustomisationChange(item.id, val)}
                        >
                            <SelectTrigger className='h-7 w-auto min-w-[160px] text-xs'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {item.customisation.options.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} className='text-xs'>
                                        {opt.label}
                                        {opt.surcharge > 0 && ` (+${formatVnd(opt.surcharge)})`}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasSurcharge && (
                            <Badge variant='secondary' className='text-xs'>
                                +{formatVnd(item.customisation.surcharge)}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Price row */}
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-1.5 rounded-full bg-muted px-1 py-0.5'>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='h-6 w-6 rounded-full'
                            onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                        >
                            <Minus className='h-3 w-3' />
                        </Button>
                        <span className='w-6 text-center text-xs font-bold'>{item.quantity}</span>
                        <Button
                            variant='ghost'
                            size='icon'
                            className='h-6 w-6 rounded-full'
                            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                        >
                            <Plus className='h-3 w-3' />
                        </Button>
                    </div>
                    <div className='text-right'>
                        {item.quantity > 1 && <p className='text-xs text-muted-foreground'>{formatVnd(unit)} each</p>}
                        <p className='text-sm font-bold text-foreground'>{formatVnd(total)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            {/* Nav — placeholder; exists in current system, not changed by this sprint */}
            <div className='sticky top-0 z-50 flex h-16 items-center justify-center gap-3 border-b border-dashed bg-muted/20'>
                <div className='h-px w-6 bg-muted-foreground/30' />
                <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                    nav placeholder
                </span>
                <div className='h-px w-6 bg-muted-foreground/30' />
            </div>
            <div className='container mx-auto max-w-4xl px-4 py-8'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Story: Default
// ---------------------------------------------------------------------------

function DefaultCartPage() {
    const [items, setItems] = useState<CartLineItem[]>(INITIAL_CART_DEFAULT);

    const handleQuantityChange = (id: string, qty: number) => {
        setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity: qty } : item)));
    };

    const handleCustomisationChange = (id: string, value: string) => {
        setItems(prev =>
            prev.map(item => {
                if (item.id !== id || !item.customisation) return item;
                const opt = item.customisation.options.find(o => o.value === value);
                if (!opt) return item;
                return {
                    ...item,
                    customisation: {
                        ...item.customisation,
                        selectedValue: opt.value,
                        selectedLabel: opt.label,
                        surcharge: opt.surcharge,
                    },
                };
            })
        );
    };

    const handleRemove = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

    return (
        <PageShell>
            <h2 className='mb-6 text-2xl font-bold text-foreground'>Your cart</h2>

            <div className='grid gap-6 lg:grid-cols-[1fr_340px]'>
                {/* Items list */}
                <Card>
                    <CardContent className='p-0'>
                        <div className='divide-y px-5'>
                            {items.map(item => (
                                <CartLineItemRow
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                    onCustomisationChange={handleCustomisationChange}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Order summary */}
                <div className='space-y-4'>
                    <Card>
                        <CardHeader className='pb-3'>
                            <CardTitle className='text-base'>Order summary</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            {items.map(item => {
                                const surcharge = item.customisation?.surcharge ?? 0;
                                return (
                                    <div key={item.id} className='flex justify-between text-sm'>
                                        <div>
                                            <span className='text-foreground'>{item.foodName}</span>
                                            {surcharge > 0 && (
                                                <span className='ml-1 text-xs text-muted-foreground'>
                                                    ({item.customisation?.selectedLabel})
                                                </span>
                                            )}
                                            <span className='ml-1 text-xs text-muted-foreground'>
                                                × {item.quantity}
                                            </span>
                                        </div>
                                        <span className='font-medium'>{formatVnd(lineTotal(item))}</span>
                                    </div>
                                );
                            })}

                            <Separator />

                            <div className='flex justify-between text-sm font-semibold'>
                                <span>Subtotal</span>
                                <span>{formatVnd(subtotal)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className='w-full gap-2' size='lg'>
                                Proceed to checkout
                                <ArrowRight className='h-4 w-4' />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: SurchargeChanged — starts with Regular selected
// ---------------------------------------------------------------------------

function SurchargeChangedCartPage() {
    const [items, setItems] = useState<CartLineItem[]>(INITIAL_CART_SURCHARGE_CHANGED);

    const handleQuantityChange = (id: string, qty: number) => {
        setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity: qty } : item)));
    };

    const handleCustomisationChange = (id: string, value: string) => {
        setItems(prev =>
            prev.map(item => {
                if (item.id !== id || !item.customisation) return item;
                const opt = item.customisation.options.find(o => o.value === value);
                if (!opt) return item;
                return {
                    ...item,
                    customisation: {
                        ...item.customisation,
                        selectedValue: opt.value,
                        selectedLabel: opt.label,
                        surcharge: opt.surcharge,
                    },
                };
            })
        );
    };

    const handleRemove = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);

    return (
        <PageShell>
            <h2 className='mb-2 text-2xl font-bold text-foreground'>Your cart</h2>
            <p className='mb-6 text-sm text-muted-foreground'>
                Grilled Salmon customisation changed to Regular — price updated immediately.
            </p>

            <div className='grid gap-6 lg:grid-cols-[1fr_340px]'>
                <Card>
                    <CardContent className='p-0'>
                        <div className='divide-y px-5'>
                            {items.map(item => (
                                <CartLineItemRow
                                    key={item.id}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                    onCustomisationChange={handleCustomisationChange}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className='space-y-4'>
                    <Card>
                        <CardHeader className='pb-3'>
                            <CardTitle className='text-base'>Order summary</CardTitle>
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            {items.map(item => (
                                <div key={item.id} className='flex justify-between text-sm'>
                                    <div>
                                        <span className='text-foreground'>{item.foodName}</span>
                                        {item.customisation && (
                                            <span className='ml-1 text-xs text-muted-foreground'>
                                                ({item.customisation.selectedLabel})
                                            </span>
                                        )}
                                        <span className='ml-1 text-xs text-muted-foreground'>× {item.quantity}</span>
                                    </div>
                                    <span className='font-medium'>{formatVnd(lineTotal(item))}</span>
                                </div>
                            ))}

                            <Separator />

                            <div className='flex justify-between text-sm font-semibold'>
                                <span>Subtotal</span>
                                <span>{formatVnd(subtotal)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className='w-full gap-2' size='lg'>
                                Proceed to checkout
                                <ArrowRight className='h-4 w-4' />
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Loading
// ---------------------------------------------------------------------------

function LoadingCartPage() {
    return (
        <PageShell>
            <Skeleton className='mb-6 h-8 w-36' />
            <div className='grid gap-6 lg:grid-cols-[1fr_340px]'>
                <Card>
                    <CardContent className='space-y-6 p-5'>
                        {[1, 2].map(i => (
                            <div key={i} className='flex gap-4'>
                                <Skeleton className='h-20 w-20 shrink-0 rounded-xl' />
                                <div className='flex flex-1 flex-col gap-3'>
                                    <Skeleton className='h-4 w-40' />
                                    <Skeleton className='h-7 w-52 rounded-md' />
                                    <div className='flex items-center justify-between'>
                                        <Skeleton className='h-6 w-24 rounded-full' />
                                        <Skeleton className='h-4 w-24' />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className='h-5 w-32' />
                    </CardHeader>
                    <CardContent className='space-y-3'>
                        <Skeleton className='h-4 w-full' />
                        <Skeleton className='h-4 w-full' />
                        <Separator />
                        <Skeleton className='h-4 w-full' />
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
// Story: Empty
// ---------------------------------------------------------------------------

function EmptyCartPage() {
    return (
        <PageShell>
            <h2 className='mb-6 text-2xl font-bold text-foreground'>Your cart</h2>
            <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed px-8 py-20 text-center'>
                <ShoppingCart className='mb-4 h-12 w-12 text-muted-foreground/40' />
                <h3 className='mb-2 text-lg font-semibold text-foreground'>Your cart is empty</h3>
                <p className='mb-6 max-w-xs text-sm text-muted-foreground'>
                    Browse our menu and add items to start your order.
                </p>
                <Button size='lg' className='gap-2'>
                    Browse menu
                    <ArrowRight className='h-4 w-4' />
                </Button>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Cart Page',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default — Cart with Surcharge Item',
    render: () => <DefaultCartPage />,
};

export const SurchargeChanged: Story = {
    name: 'Surcharge Changed — Price Updates Immediately',
    render: () => <SurchargeChangedCartPage />,
};

export const Loading: Story = {
    name: 'Loading — Skeleton',
    render: () => <LoadingCartPage />,
};

export const Empty: Story = {
    name: 'Empty — Browse CTA',
    render: () => <EmptyCartPage />,
};
