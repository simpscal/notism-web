import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banknote, CheckCircle2, ChevronRight, CreditCard, Lock, MapPin, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/card';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { Separator } from '@/components/separator';
import Spinner from '@/components/spinner';
import { Textarea } from '@/components/textarea';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Mock order data — same line items as OrderPage / CartPage
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
// Payment method types
// ---------------------------------------------------------------------------

type PaymentMethod = 'cod' | 'banking';

// ---------------------------------------------------------------------------
// Page shell — cart → order → payment breadcrumb
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <header className='sticky top-0 z-50 border-b bg-background'>
                <div className='flex h-16 items-center px-4 md:px-6'>
                    <h1 className='text-lg font-semibold tracking-tight text-primary md:text-2xl'>Notism</h1>
                    <div className='ml-4 hidden items-center gap-1.5 text-sm text-muted-foreground md:flex'>
                        <span className='text-muted-foreground'>Cart</span>
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
// Order summary panel — sticky on desktop
// ---------------------------------------------------------------------------

function OrderSummaryPanel() {
    return (
        <Card className='lg:sticky lg:top-24'>
            <CardHeader className='pb-2'>
                <CardTitle className='text-base'>Order summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='divide-y'>
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
                        <span>Total</span>
                        <span className='text-primary'>{formatVnd(TOTAL)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Payment method selector — radio cards
// ---------------------------------------------------------------------------

interface PaymentMethodSelectorProps {
    value: PaymentMethod;
    onChange: (method: PaymentMethod) => void;
}

function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
    return (
        <div className='space-y-2'>
            <p className='text-sm font-semibold text-foreground'>Payment method</p>
            <RadioGroup
                value={value}
                onValueChange={v => onChange(v as PaymentMethod)}
                className='grid grid-cols-1 gap-3 sm:grid-cols-2'
            >
                {/* Cash on Delivery */}
                <div
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition-colors hover:bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5`}
                >
                    <RadioGroupItem value='cod' id='method-cod' />
                    <Label htmlFor='method-cod' className='flex cursor-pointer flex-col gap-0.5'>
                        <span className='flex items-center gap-2 text-sm font-semibold'>
                            <Banknote className='h-4 w-4 text-primary' />
                            Cash on Delivery
                        </span>
                        <span className='text-xs text-muted-foreground'>Pay in cash when your order arrives</span>
                    </Label>
                </div>

                {/* Banking */}
                <div
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition-colors hover:bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5`}
                >
                    <RadioGroupItem value='banking' id='method-banking' />
                    <Label htmlFor='method-banking' className='flex cursor-pointer flex-col gap-0.5'>
                        <span className='flex items-center gap-2 text-sm font-semibold'>
                            <CreditCard className='h-4 w-4 text-primary' />
                            Banking
                        </span>
                        <span className='text-xs text-muted-foreground'>Pay by card or bank transfer</span>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
}

// ---------------------------------------------------------------------------
// COD form — delivery address + notes
// ---------------------------------------------------------------------------

interface CodFormProps {
    onPlaceOrder?: () => void;
    disabled?: boolean;
}

function CodForm({ onPlaceOrder, disabled = false }: CodFormProps) {
    const [address, setAddress] = useState('123 Nguyen Hue, District 1, Ho Chi Minh City');
    const [notes, setNotes] = useState('');

    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                    <MapPin className='h-4 w-4' />
                    Delivery details
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-1.5'>
                    <Label htmlFor='delivery-address'>Delivery address</Label>
                    <Input
                        id='delivery-address'
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        disabled={disabled}
                        placeholder='Enter your delivery address'
                    />
                </div>
                <div className='space-y-1.5'>
                    <Label htmlFor='delivery-notes'>
                        Delivery notes <span className='text-xs text-muted-foreground'>(optional)</span>
                    </Label>
                    <Textarea
                        id='delivery-notes'
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        disabled={disabled}
                        placeholder='E.g. ring the doorbell, leave at reception…'
                        rows={3}
                    />
                </div>

                <div className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
                    <Banknote className='h-3.5 w-3.5 shrink-0' />
                    Please prepare the exact amount of{' '}
                    <span className='font-semibold text-foreground'>{formatVnd(TOTAL)}</span> in cash for the delivery
                    rider.
                </div>
            </CardContent>
            <CardFooter>
                <Button className='w-full gap-2' size='lg' disabled={disabled} onClick={onPlaceOrder}>
                    Place order — {formatVnd(TOTAL)}
                </Button>
            </CardFooter>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Banking form — card details
// ---------------------------------------------------------------------------

interface BankingFormProps {
    onAuthorise?: () => void;
    disabled?: boolean;
    processing?: boolean;
}

function BankingForm({ onAuthorise, disabled = false, processing = false }: BankingFormProps) {
    const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
    const [expiry, setExpiry] = useState('12/28');
    const [cvv, setCvv] = useState('123');
    const [name, setName] = useState('Nguyen Van A');

    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                    <CreditCard className='h-4 w-4' />
                    Card details
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
            <CardFooter>
                <Button className='w-full gap-2' size='lg' disabled={disabled} onClick={onAuthorise}>
                    {processing ? (
                        <>
                            <Spinner size='sm' />
                            Processing…
                        </>
                    ) : (
                        <>
                            <Lock className='h-4 w-4' />
                            Authorise payment — {formatVnd(TOTAL)}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Story: Default — interactive payment method selection
// ---------------------------------------------------------------------------

function DefaultPaymentPage() {
    const [method, setMethod] = useState<PaymentMethod>('cod');

    return (
        <PageShell>
            <h2 className='mb-6 text-2xl font-bold text-foreground'>Payment</h2>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <div className='space-y-5'>
                    <PaymentMethodSelector value={method} onChange={setMethod} />
                    {method === 'cod' ? <CodForm /> : <BankingForm />}
                </div>
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: CashOnDelivery — COD pre-selected (static snapshot)
// ---------------------------------------------------------------------------

function CashOnDeliveryPage() {
    return (
        <PageShell>
            <h2 className='mb-6 text-2xl font-bold text-foreground'>Payment</h2>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <div className='space-y-5'>
                    <PaymentMethodSelector value='cod' onChange={() => {}} />
                    <CodForm />
                </div>
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Banking — card form pre-selected (static snapshot)
// ---------------------------------------------------------------------------

function BankingPage() {
    return (
        <PageShell>
            <h2 className='mb-6 text-2xl font-bold text-foreground'>Payment</h2>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <div className='space-y-5'>
                    <PaymentMethodSelector value='banking' onChange={() => {}} />
                    <BankingForm />
                </div>
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Processing — banking authorisation in progress
// ---------------------------------------------------------------------------

function ProcessingPage() {
    return (
        <PageShell>
            <h2 className='mb-2 text-2xl font-bold text-foreground'>Payment</h2>
            <p className='mb-6 text-sm text-muted-foreground'>
                Processing your payment — please do not close this page.
            </p>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <div className='space-y-5'>
                    <PaymentMethodSelector value='banking' onChange={() => {}} />
                    <BankingForm disabled processing />
                </div>
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Success — order placed / payment authorised
// ---------------------------------------------------------------------------

function SuccessPage({ method }: { method: PaymentMethod }) {
    const orderRef = 'ORD-20260601-7843';
    const isCod = method === 'cod';

    return (
        <PageShell>
            <div className='mb-8 flex flex-col items-center rounded-2xl bg-primary/5 px-6 py-10 text-center'>
                <CheckCircle2 className='mb-4 h-14 w-14 text-primary' />
                <h2 className='mb-1 text-2xl font-bold text-foreground'>
                    {isCod ? 'Order placed!' : 'Payment authorised'}
                </h2>
                <p className='mb-3 text-sm text-muted-foreground'>
                    {isCod ? (
                        <>
                            Your order is confirmed. Please prepare{' '}
                            <span className='font-semibold text-foreground'>{formatVnd(TOTAL)}</span> in cash for the
                            delivery rider.
                        </>
                    ) : (
                        <>
                            Your payment of <span className='font-semibold text-foreground'>{formatVnd(TOTAL)}</span>{' '}
                            has been charged successfully.
                        </>
                    )}
                </p>
                <Badge variant='outline' className='font-mono text-sm'>
                    {orderRef}
                </Badge>
            </div>

            <div className='mx-auto max-w-sm space-y-4'>
                <Card>
                    <CardContent className='space-y-3 pt-6'>
                        <div className='text-center'>
                            <p className='mb-1 text-xs uppercase tracking-widest text-muted-foreground'>
                                {isCod ? 'Amount due on delivery' : 'Amount charged'}
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
                        Track order
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
    name: 'Default — Select Payment Method',
    render: () => <DefaultPaymentPage />,
};

export const CashOnDelivery: Story = {
    name: 'Cash on Delivery — Delivery Details Form',
    render: () => <CashOnDeliveryPage />,
};

export const Banking: Story = {
    name: 'Banking — Card Details Form',
    render: () => <BankingPage />,
};

export const Processing: Story = {
    name: 'Processing — Banking Authorisation In Progress',
    render: () => <ProcessingPage />,
};

export const SuccessCod: Story = {
    name: 'Success — Order Placed (Cash on Delivery)',
    render: () => <SuccessPage method='cod' />,
};

export const SuccessBanking: Story = {
    name: 'Success — Payment Authorised (Banking)',
    render: () => <SuccessPage method='banking' />,
};
