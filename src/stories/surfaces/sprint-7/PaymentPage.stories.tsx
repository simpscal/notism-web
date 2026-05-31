import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, ChevronRight, CreditCard, Lock, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Mock order data — same items as OrderPage
// ---------------------------------------------------------------------------

interface PaymentLineItem {
    id: string;
    foodName: string;
    customisationLabel: string | null;
    surcharge: number;
    basePrice: number;
    quantity: number;
}

function lineTotal(item: PaymentLineItem): number {
    return (item.basePrice + item.surcharge) * item.quantity;
}

const ORDER_ITEMS: PaymentLineItem[] = [
    {
        id: 'pi-1',
        foodName: 'Grilled Salmon',
        customisationLabel: 'Large (260 g)',
        surcharge: 30000,
        basePrice: 185000,
        quantity: 1,
    },
    {
        id: 'pi-2',
        foodName: 'Beef Pho',
        customisationLabel: null,
        surcharge: 0,
        basePrice: 95000,
        quantity: 2,
    },
    {
        id: 'pi-3',
        foodName: 'Spring Rolls',
        customisationLabel: 'Extra sauce',
        surcharge: 5000,
        basePrice: 55000,
        quantity: 3,
    },
];

const TAX_RATE = 0.08;
const SUBTOTAL = ORDER_ITEMS.reduce((s, i) => s + lineTotal(i), 0);
const TAX = Math.round(SUBTOTAL * TAX_RATE);
const TOTAL = SUBTOTAL + TAX;

// ---------------------------------------------------------------------------
// Shared page shell with checkout steps
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
                        <span>Order</span>
                        <ChevronRight className='h-3.5 w-3.5' />
                        <span className='font-medium text-foreground'>Payment</span>
                    </div>
                </div>
            </header>
            <div className='container mx-auto max-w-4xl px-4 py-8'>{children}</div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Order summary panel — shared across stories
// ---------------------------------------------------------------------------

function OrderSummaryPanel() {
    return (
        <Card className='lg:sticky lg:top-24'>
            <CardHeader className='pb-2'>
                <CardTitle className='text-base'>Order summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='space-y-0 divide-y'>
                    {ORDER_ITEMS.map(item => (
                        <div key={item.id} className='flex items-start justify-between py-2.5'>
                            <div>
                                <p className='text-sm font-medium text-foreground'>{item.foodName}</p>
                                {item.customisationLabel && (
                                    <p className='text-xs text-muted-foreground'>
                                        {item.customisationLabel}
                                        {item.surcharge > 0 && (
                                            <span className='ml-1 text-primary'>+{formatVnd(item.surcharge)}</span>
                                        )}
                                    </p>
                                )}
                                <p className='text-xs text-muted-foreground'>× {item.quantity}</p>
                            </div>
                            <span className='text-sm font-semibold'>{formatVnd(lineTotal(item))}</span>
                        </div>
                    ))}
                </div>

                <Separator />

                <div className='space-y-1.5 text-sm'>
                    <div className='flex justify-between text-muted-foreground'>
                        <span>Subtotal</span>
                        <span>{formatVnd(SUBTOTAL)}</span>
                    </div>
                    <div className='flex justify-between text-muted-foreground'>
                        <span>Tax (8%)</span>
                        <span>{formatVnd(TAX)}</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between font-bold text-base'>
                        <span>Total charged</span>
                        <span className='text-primary'>{formatVnd(TOTAL)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Payment method form (mock card inputs)
// ---------------------------------------------------------------------------

interface PaymentFormProps {
    disabled?: boolean;
    onAuthorise?: () => void;
    authoriseLabel?: string;
}

function PaymentForm({ disabled = false, onAuthorise, authoriseLabel }: PaymentFormProps) {
    const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
    const [expiry, setExpiry] = useState('12/28');
    const [cvv, setCvv] = useState('123');
    const [name, setName] = useState('Nguyen Van A');

    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                    <CreditCard className='h-4 w-4' />
                    Payment method
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-1.5'>
                    <Label htmlFor='card-name'>Cardholder name</Label>
                    <Input
                        id='card-name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={disabled}
                        placeholder='Name on card'
                    />
                </div>
                <div className='space-y-1.5'>
                    <Label htmlFor='card-number'>Card number</Label>
                    <Input
                        id='card-number'
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        disabled={disabled}
                        placeholder='0000 0000 0000 0000'
                    />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                        <Label htmlFor='card-expiry'>Expiry</Label>
                        <Input
                            id='card-expiry'
                            value={expiry}
                            onChange={e => setExpiry(e.target.value)}
                            disabled={disabled}
                            placeholder='MM/YY'
                        />
                    </div>
                    <div className='space-y-1.5'>
                        <Label htmlFor='card-cvv'>CVV</Label>
                        <Input
                            id='card-cvv'
                            value={cvv}
                            onChange={e => setCvv(e.target.value)}
                            disabled={disabled}
                            placeholder='000'
                            type='password'
                        />
                    </div>
                </div>

                <div className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
                    <ShieldCheck className='h-3.5 w-3.5 shrink-0' />
                    Your card details are encrypted and never stored.
                </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-3'>
                {/* Total echoed on the CTA — must visually match the order summary total */}
                <Button className='w-full gap-2' size='lg' disabled={disabled} onClick={onAuthorise}>
                    {disabled ? (
                        <>
                            <Spinner size='sm' />
                            Processing…
                        </>
                    ) : (
                        <>
                            <Lock className='h-4 w-4' />
                            {authoriseLabel ?? `Authorise payment — ${formatVnd(TOTAL)}`}
                        </>
                    )}
                </Button>
                <p className='text-center text-xs text-muted-foreground'>
                    By authorising you agree to our terms of service.
                </p>
            </CardFooter>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Story: Default
// ---------------------------------------------------------------------------

function DefaultPaymentPage() {
    return (
        <PageShell>
            <h2 className='mb-6 text-2xl font-bold text-foreground'>Payment</h2>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <PaymentForm />
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Processing
// ---------------------------------------------------------------------------

function ProcessingPaymentPage() {
    return (
        <PageShell>
            <h2 className='mb-2 text-2xl font-bold text-foreground'>Payment</h2>
            <p className='mb-6 text-sm text-muted-foreground'>
                Processing your payment — please do not close this page.
            </p>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <PaymentForm disabled authoriseLabel={`Authorise payment — ${formatVnd(TOTAL)}`} />
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Success
// ---------------------------------------------------------------------------

function SuccessPaymentPage() {
    const orderRef = 'ORD-20260601-7843';

    return (
        <PageShell>
            {/* Confirmation header */}
            <div className='mb-8 flex flex-col items-center rounded-2xl bg-primary/5 px-6 py-10 text-center'>
                <CheckCircle2 className='mb-4 h-14 w-14 text-primary' />
                <h2 className='mb-1 text-2xl font-bold text-foreground'>Payment authorised</h2>
                <p className='mb-3 text-sm text-muted-foreground'>
                    Your payment of <span className='font-semibold text-foreground'>{formatVnd(TOTAL)}</span> has been
                    charged successfully.
                </p>
                <Badge variant='outline' className='font-mono text-sm'>
                    {orderRef}
                </Badge>
            </div>

            {/* Charged amount card — echoes the total shown during authorisation */}
            <div className='mx-auto max-w-sm space-y-4'>
                <Card>
                    <CardContent className='space-y-3 pt-6'>
                        <div className='text-center'>
                            <p className='mb-1 text-xs uppercase tracking-widest text-muted-foreground'>
                                Amount charged
                            </p>
                            <p className='text-4xl font-bold text-primary tabular-nums'>{formatVnd(TOTAL)}</p>
                        </div>
                        <Separator />
                        <div className='space-y-1.5 text-sm'>
                            {ORDER_ITEMS.map(item => (
                                <div key={item.id} className='flex justify-between text-muted-foreground'>
                                    <span>
                                        {item.foodName}
                                        {item.customisationLabel && ` (${item.customisationLabel})`} × {item.quantity}
                                    </span>
                                    <span>{formatVnd(lineTotal(item))}</span>
                                </div>
                            ))}
                            <Separator />
                            <div className='flex justify-between text-muted-foreground'>
                                <span>Tax (8%)</span>
                                <span>{formatVnd(TAX)}</span>
                            </div>
                            <div className='flex justify-between font-semibold text-foreground'>
                                <span>Total</span>
                                <span>{formatVnd(TOTAL)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className='flex gap-3'>
                    <Button variant='outline' className='flex-1'>
                        View order
                    </Button>
                    <Button className='flex-1'>Browse menu</Button>
                </div>
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Payment Page',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default — Payment Form with Order Summary',
    render: () => <DefaultPaymentPage />,
};

export const Processing: Story = {
    name: 'Processing — Authorise Button Disabled',
    render: () => <ProcessingPaymentPage />,
};

export const Success: Story = {
    name: 'Success — Payment Authorised, Amount Confirmed',
    render: () => <SuccessPaymentPage />,
};
