import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banknote, CheckCircle2, CreditCard, MapPin, Pencil, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/uis/card';
import { Input } from '@/uis/input';
import { Label } from '@/uis/label';
import { RadioGroup, RadioGroupItem } from '@/uis/radio-group';
import { Separator } from '@/uis/separator';
import Spinner from '@/uis/spinner';
import { Textarea } from '@/uis/textarea';

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

// Saved address fixture
const SAVED_ADDRESS = '123 Nguyen Hue, District 1, Ho Chi Minh City';

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
            {/* Top bar — placeholder; not the focus of this story */}
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
                        <span className='text-xs text-muted-foreground'>Scan QR code and transfer directly</span>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
}

// ---------------------------------------------------------------------------
// COD form — delivery address + notes (no saved address)
// ---------------------------------------------------------------------------

interface CodFormProps {
    onPlaceOrder?: () => void;
    disabled?: boolean;
}

function CodForm({ onPlaceOrder, disabled = false }: CodFormProps) {
    const [address, setAddress] = useState('');
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
// COD saved-address row — shown when user already has an address on file
// ---------------------------------------------------------------------------

interface CodSavedAddressProps {
    address: string;
    onPlaceOrder?: () => void;
    disabled?: boolean;
}

function CodSavedAddress({ address, onPlaceOrder, disabled = false }: CodSavedAddressProps) {
    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                    <MapPin className='h-4 w-4' />
                    Delivery details
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                {/* Read-only saved address row */}
                <div className='flex items-start justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3'>
                    <div className='space-y-0.5'>
                        <p className='text-xs font-medium uppercase tracking-widest text-muted-foreground'>
                            Delivering to
                        </p>
                        <p className='text-sm font-medium text-foreground'>{address}</p>
                    </div>
                    <button
                        className='mt-0.5 flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline'
                        type='button'
                    >
                        <Pencil className='h-3 w-3' />
                        Edit
                    </button>
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
// BankingQr — QR code display + bank account details
// ---------------------------------------------------------------------------

interface BankingQrProps {
    /** When true, shows the waiting-for-transfer spinner overlay */
    waiting?: boolean;
}

function BankingQr({ waiting = false }: BankingQrProps) {
    return (
        <Card>
            <CardHeader className='pb-3'>
                <CardTitle className='flex items-center gap-2 text-base'>
                    <CreditCard className='h-4 w-4' />
                    Bank transfer
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5'>
                {/* QR placeholder */}
                <div className='flex flex-col items-center gap-3'>
                    <div className='relative'>
                        {/* Checkerboard / grid placeholder representing the QR code */}
                        <div
                            className='h-44 w-44 rounded-lg border-2 border-primary/40'
                            style={{
                                backgroundImage: 'repeating-conic-gradient(#0001 0% 25%, transparent 0% 50%)',
                                backgroundSize: '12px 12px',
                                backgroundColor: 'hsl(var(--muted))',
                            }}
                        />
                        {/* Centre label */}
                        <div className='absolute inset-0 flex items-center justify-center'>
                            <span className='rounded-md bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shadow-sm'>
                                QR placeholder
                            </span>
                        </div>
                        {/* Waiting overlay */}
                        {waiting && (
                            <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-background/80 backdrop-blur-[2px]'>
                                <Spinner size='md' />
                            </div>
                        )}
                    </div>
                    <p className='text-xs text-muted-foreground'>Scan to pay</p>
                </div>

                {/* Bank / account details */}
                <div className='space-y-2 rounded-lg border bg-muted/30 px-4 py-3 text-sm'>
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Bank</span>
                        <span className='font-medium text-foreground'>Vietcombank</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Account</span>
                        <span className='font-mono font-medium text-foreground'>1234567890</span>
                    </div>
                    <Separator />
                    <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Amount</span>
                        <span className='font-semibold text-primary'>{formatVnd(TOTAL)}</span>
                    </div>
                </div>

                {/* Status message */}
                {waiting ? (
                    <div className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
                        <Spinner size='xs' />
                        Waiting for transfer confirmation…
                    </div>
                ) : (
                    <div className='flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
                        <ShieldCheck className='h-3.5 w-3.5 shrink-0' />
                        After your transfer the payment will be confirmed automatically.
                    </div>
                )}
            </CardContent>
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
                    {method === 'cod' ? <CodForm /> : <BankingQr />}
                </div>
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: CashOnDelivery — COD pre-selected, no saved address (interactive)
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
// Story: CashOnDeliveryNoAddress — COD, no saved address, form shown
// ---------------------------------------------------------------------------

function CashOnDeliveryNoAddressPage() {
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
// Story: CashOnDeliveryAddressSet — COD, saved address displayed read-only
// ---------------------------------------------------------------------------

function CashOnDeliveryAddressSetPage() {
    return (
        <PageShell>
            <h2 className='mb-6 text-2xl font-bold text-foreground'>Payment</h2>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <div className='space-y-5'>
                    <PaymentMethodSelector value='cod' onChange={() => {}} />
                    <CodSavedAddress address={SAVED_ADDRESS} />
                </div>
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Banking — QR code displayed (static snapshot)
// ---------------------------------------------------------------------------

function BankingPage() {
    return (
        <PageShell>
            <h2 className='mb-6 text-2xl font-bold text-foreground'>Payment</h2>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <div className='space-y-5'>
                    <PaymentMethodSelector value='banking' onChange={() => {}} />
                    <BankingQr />
                </div>
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Processing — awaiting transfer confirmation, QR still visible
// ---------------------------------------------------------------------------

function ProcessingPage() {
    return (
        <PageShell>
            <h2 className='mb-2 text-2xl font-bold text-foreground'>Payment</h2>
            <p className='mb-6 text-sm text-muted-foreground'>
                Awaiting transfer confirmation — please do not close this page.
            </p>

            <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
                <div className='space-y-5'>
                    <PaymentMethodSelector value='banking' onChange={() => {}} />
                    <BankingQr waiting />
                </div>
                <OrderSummaryPanel />
            </div>
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Story: Success — order placed / payment auto-confirmed
// ---------------------------------------------------------------------------

function SuccessPage({ method }: { method: PaymentMethod }) {
    const orderRef = 'ORD-20260601-7843';
    const isCod = method === 'cod';

    return (
        <PageShell>
            <div className='mb-8 flex flex-col items-center rounded-2xl bg-primary/5 px-6 py-10 text-center'>
                <CheckCircle2 className='mb-4 h-14 w-14 text-primary' />
                <h2 className='mb-1 text-2xl font-bold text-foreground'>
                    {isCod ? 'Order placed!' : 'Payment confirmed'}
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
                            Your transfer of <span className='font-semibold text-foreground'>{formatVnd(TOTAL)}</span>{' '}
                            has been received and confirmed automatically.
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
                                {isCod ? 'Amount due on delivery' : 'Amount received'}
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

export const CashOnDeliveryNoAddress: Story = {
    name: 'Cash on Delivery — No Saved Address (Form Shown)',
    render: () => <CashOnDeliveryNoAddressPage />,
};

export const CashOnDeliveryAddressSet: Story = {
    name: 'Cash on Delivery — Saved Address (Read-only)',
    render: () => <CashOnDeliveryAddressSetPage />,
};

export const Banking: Story = {
    name: 'Banking — QR Code Scan & Transfer',
    render: () => <BankingPage />,
};

export const Processing: Story = {
    name: 'Processing — Awaiting Transfer Confirmation',
    render: () => <ProcessingPage />,
};

export const SuccessCod: Story = {
    name: 'Success — Order Placed (Cash on Delivery)',
    render: () => <SuccessPage method='cod' />,
};

export const SuccessBanking: Story = {
    name: 'Success — Payment Confirmed (Banking)',
    render: () => <SuccessPage method='banking' />,
};
