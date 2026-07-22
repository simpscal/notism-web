import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowLeft, StickyNote } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/uis/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/uis/select';
import { Separator } from '@/uis/separator';
import { Toaster } from '@/uis/sonner';
import Spinner from '@/uis/spinner';

/** Copy shown when a payment-status change fails (toast + revert). */
const SAVE_FAILED_MESSAGE = 'Couldn’t update the payment status. Please try again.';

// ---------------------------------------------------------------------------
// Implementation reference — stories 235 + 236.
//
// The admin order-detail page already exists (src/pages/admin/order-detail/
// order-detail.tsx, route admin/orders/{slugId}). This sprint adds, ON THAT
// PAGE, an admin payment-status control:
//   1. a Select to pick Paid / Unpaid / Failed / Refunded (mirrors the existing
//      admin delivery-status Select on admin-orders-table.tsx);
//   2. a confirmation Dialog before the change applies (confirm / cancel);
//   3. the payment-status Badge, extended with a NEW "Refunded" variant that is
//      visually distinct from Paid / Unpaid / Failed.
//
// FAILURE FEEDBACK: an optimistically-applied change that fails surfaces as a
// destructive Sonner TOAST (toast.error, reusing the same `toast` + `Toaster`
// pattern as the admin delivery-status mutation on admin-orders-table.tsx) and
// reverts the badge to its previous value. There is NO inline error message
// under the control — the toast replaces it.
//
// Everything else on the page (nav, header, delivery timeline, order-items card,
// payment-details card) is unchanged → rendered as labelled placeholders so the
// reviewer sees the changed control in its real page context, not in isolation.
//
// Mock-only fixtures; no state management, no api/model imports.
// ---------------------------------------------------------------------------

/** Mirrors src/app/utils/currency.utils.ts — VND formatting used across the app. */
function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Payment status — the four statuses an admin can set (235 + 236).
// Mirrors the shape of the delivery-status constant the existing Select uses.
// ---------------------------------------------------------------------------

type PaymentStatus = 'paid' | 'unpaid' | 'failed' | 'refunded';

interface PaymentStatusMeta {
    key: PaymentStatus;
    label: string;
}

/** Selectable options, in the order they appear in the Select. */
const PAYMENT_STATUS_OPTIONS: PaymentStatusMeta[] = [
    { key: 'paid', label: 'Paid' },
    { key: 'unpaid', label: 'Unpaid' },
    { key: 'failed', label: 'Failed' },
    { key: 'refunded', label: 'Refunded' },
];

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
    paid: 'Paid',
    unpaid: 'Unpaid',
    failed: 'Failed',
    refunded: 'Refunded',
};

// ---------------------------------------------------------------------------
// PaymentStatusBadge — reference for the extended badge.
//
// The current component (src/features/payment/components/payment-status-badge
// .tsx) maps only Paid → success and everything else → secondary. This sprint
// needs four DISTINCT looks. Reusing the existing Badge variants:
//   • Paid     → success    (green)  — unchanged
//   • Unpaid   → secondary  (grey)   — unchanged
//   • Failed   → destructive (red)
//   • Refunded → warning-toned outline (amber, via the --warning token) so it
//     reads apart from green / grey / red at a glance — satisfies the
//     "visually distinguishable" AC (236) without relying on colour alone:
//     it is the only OUTLINED badge, so shape differs too.
//
// NOTE FOR IMPLEMENTATION: there is no `warning` Badge variant in
// src/uis/badge.tsx today (variants: default, secondary, destructive,
// outline, success). The Refunded look below is composed with utility classes
// over the `outline` variant using the existing `--warning` design token. See
// <confirmations> — implementation should either add a `warning` Badge variant
// or keep this className composition.
// ---------------------------------------------------------------------------

function PaymentStatusBadge({ paymentStatus }: { paymentStatus: PaymentStatus }) {
    const label = PAYMENT_STATUS_LABEL[paymentStatus];

    if (paymentStatus === 'paid') {
        return <Badge variant='success'>{label}</Badge>;
    }
    if (paymentStatus === 'failed') {
        return <Badge variant='destructive'>{label}</Badge>;
    }
    if (paymentStatus === 'refunded') {
        // Distinct amber, outlined — different hue AND different shape from the
        // other three. Built on the `outline` variant + the --warning token.
        return (
            <Badge variant='outline' className='border-warning/40 bg-warning/10 text-warning'>
                {label}
            </Badge>
        );
    }
    return <Badge variant='secondary'>{label}</Badge>;
}

// ---------------------------------------------------------------------------
// Page placeholders — areas that exist today and are NOT changed this sprint.
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

function BlockPlaceholder({ label, height }: { label: string; height: number }) {
    return (
        <div
            className='flex items-center justify-center rounded-xl border border-dashed bg-muted/20'
            style={{ height }}
        >
            <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>{label}</span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Order header (placeholder shell) — exists today, kept for page context.
// ---------------------------------------------------------------------------

const ORDER = {
    slugId: 'A1B2C3',
    totalAmount: 485_000,
    paymentMethod: 'card' as 'card' | 'cash on delivery',
    itemCount: 3,
    deliveryNotes: 'Leave at the front desk — call on arrival.',
    paidAt: '12 June 2026, 09:14',
};

function OrderHeaderPlaceholder() {
    return (
        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
            <div>
                <h1 className='mb-2 text-3xl font-bold'>Order</h1>
                <p className='text-muted-foreground'>Order #: {ORDER.slugId}</p>
                <p className='text-sm text-muted-foreground'>12 June 2026, 09:02</p>
            </div>
            <div className='text-right'>
                <div className='text-2xl font-bold'>{formatVnd(ORDER.totalAmount)}</div>
                <div className='text-sm text-muted-foreground'>On the Way</div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// THE CHANGED SURFACE — Payment card.
//
// Holds: current-status Badge (read-only display) + the admin Select control.
// The Select mirrors the delivery-status Select on admin-orders-table.tsx
// (SelectTrigger / SelectValue / SelectContent / SelectItem, disabled while a
// mutation is pending). Selecting a status DIFFERENT from current opens the
// confirmation Dialog (235); confirm applies, cancel leaves it unchanged.
// ---------------------------------------------------------------------------

type SaveState = 'idle' | 'saving';

interface PaymentCardProps {
    /** The status currently shown by the badge / selected in the control. */
    status: PaymentStatus;
    /** Pending status awaiting confirmation (drives the dialog), or null. */
    pendingStatus: PaymentStatus | null;
    saveState: SaveState;
    onSelect: (next: PaymentStatus) => void;
    onConfirm: () => void;
    onCancel: () => void;
    paymentMethod: 'card' | 'cash on delivery';
}

function PaymentCard({
    status,
    pendingStatus,
    saveState,
    onSelect,
    onConfirm,
    onCancel,
    paymentMethod,
}: PaymentCardProps) {
    const isSaving = saveState === 'saving';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                {/* Read-only display — current status + method */}
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Current status</span>
                    <PaymentStatusBadge paymentStatus={status} />
                </div>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Method</span>
                    <span className='font-medium capitalize'>{paymentMethod}</span>
                </div>

                <Separator />

                {/* Admin control — mirrors the delivery-status Select pattern.
                    Change is allowed regardless of payment method (235). */}
                <div className='space-y-1.5'>
                    <label htmlFor='payment-status-select' className='text-sm font-medium'>
                        Update payment status
                    </label>
                    <Select
                        value={status}
                        onValueChange={value => onSelect(value as PaymentStatus)}
                        disabled={isSaving}
                    >
                        <SelectTrigger id='payment-status-select' className='w-full' aria-label='Update payment status'>
                            {isSaving ? (
                                <span className='flex items-center gap-2 text-muted-foreground'>
                                    <Spinner size='sm' />
                                    Saving…
                                </span>
                            ) : (
                                <SelectValue />
                            )}
                        </SelectTrigger>
                        <SelectContent>
                            {PAYMENT_STATUS_OPTIONS.map(option => (
                                <SelectItem key={option.key} value={option.key}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Failure is surfaced as a destructive Sonner toast (with
                        badge revert), not an inline message — see the harness /
                        PageShell Toaster outlet. */}
                </div>
            </CardContent>

            {/* Confirmation dialog (235 / 236). Opens when a different status is
                picked; confirm applies, cancel reverts the selection. */}
            <Dialog open={pendingStatus !== null} onOpenChange={open => (!open ? onCancel() : undefined)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change payment status?</DialogTitle>
                        <DialogDescription>
                            This order&apos;s payment status will change from{' '}
                            <span className='font-medium text-foreground'>{PAYMENT_STATUS_LABEL[status]}</span> to{' '}
                            <span className='font-medium text-foreground'>
                                {pendingStatus ? PAYMENT_STATUS_LABEL[pendingStatus] : ''}
                            </span>
                            . You can change it again at any time.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button onClick={onConfirm}>Confirm change</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Page shell — composes the changed Payment card into the full page, with the
// rest of the page as placeholders.
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <NavPlaceholder />
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' disabled>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Orders
                </Button>

                <div className='mx-auto max-w-4xl space-y-6'>
                    <OrderHeaderPlaceholder />

                    <div className='grid gap-6 lg:grid-cols-3'>
                        <div className='space-y-6 lg:col-span-2'>
                            {/* Delivery timeline — placeholder; not changed this sprint */}
                            <BlockPlaceholder label='delivery timeline placeholder' height={140} />

                            {/* Order items card — placeholder shell, kept for context */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Items</CardTitle>
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <div className='space-y-2'>
                                        <div className='flex justify-between text-sm'>
                                            <span className='text-muted-foreground'>Total Items</span>
                                            <span className='font-medium'>{ORDER.itemCount} items</span>
                                        </div>
                                        <Separator />
                                        <div className='flex items-start gap-1.5 text-sm'>
                                            <StickyNote className='mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground' />
                                            <span className='text-muted-foreground'>{ORDER.deliveryNotes}</span>
                                        </div>
                                        <div className='flex justify-between text-lg font-semibold'>
                                            <span>Total</span>
                                            <span>{formatVnd(ORDER.totalAmount)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right column — the CHANGED payment control lives here */}
                        <div className='space-y-6'>{children}</div>
                    </div>
                </div>
            </div>

            {/* Toast outlet — failure feedback renders here (sonner, bottom-right),
                reusing the same pattern as the admin delivery-status mutation. */}
            <Toaster />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — drives Select → Dialog → confirm/cancel/error flow so
// reviewers can exercise the real interaction, not just static snapshots.
// ---------------------------------------------------------------------------

interface HarnessProps {
    initialStatus?: PaymentStatus;
    paymentMethod?: 'card' | 'cash on delivery';
    /** When true, a confirm triggers a simulated save failure + revert. */
    failOnConfirm?: boolean;
    /** When true, a confirm holds in the saving state (shows the spinner). */
    stickySaving?: boolean;
}

function PaymentControlHarness({
    initialStatus = 'unpaid',
    paymentMethod = 'card',
    failOnConfirm = false,
    stickySaving = false,
}: HarnessProps) {
    const [status, setStatus] = React.useState<PaymentStatus>(initialStatus);
    const [pendingStatus, setPendingStatus] = React.useState<PaymentStatus | null>(null);
    const [saveState, setSaveState] = React.useState<SaveState>('idle');

    const handleSelect = (next: PaymentStatus) => {
        // Only a DIFFERENT status opens the dialog (235).
        if (next === status) return;
        setPendingStatus(next);
    };

    const handleCancel = () => {
        // Leaves the status unchanged (235).
        setPendingStatus(null);
    };

    const handleConfirm = () => {
        const next = pendingStatus;
        const previous = status;
        setPendingStatus(null);
        if (next === null) return;

        // Optimistic update — badge reflects the new status immediately.
        setStatus(next);
        setSaveState('saving');
        if (stickySaving) return; // stay in saving for the Loading story

        window.setTimeout(() => {
            setSaveState('idle');
            if (failOnConfirm) {
                // Failure → revert badge to previous value AND surface a
                // destructive toast (replaces the old inline error).
                setStatus(previous);
                toast.error(SAVE_FAILED_MESSAGE);
            }
        }, 600);
    };

    return (
        <PageShell>
            <PaymentCard
                status={status}
                pendingStatus={pendingStatus}
                saveState={saveState}
                onSelect={handleSelect}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                paymentMethod={paymentMethod}
            />
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Static composition — used for the always-open dialog / saving / success /
// error snapshot stories so reviewers see each state without interaction.
// ---------------------------------------------------------------------------

function PaymentControlStatic(props: PaymentCardProps) {
    return (
        <PageShell>
            <PaymentCard {...props} />
        </PageShell>
    );
}

/**
 * Static failure snapshot — renders the page with the badge already REVERTED to
 * its previous value and fires the destructive Sonner toast once on mount, so
 * reviewers see the exact toast + revert outcome without interacting. Mirrors
 * the toast.error pattern of the admin delivery-status mutation.
 */
function PaymentControlErrorStatic({
    revertedStatus,
    paymentMethod = 'card',
}: {
    revertedStatus: PaymentStatus;
    paymentMethod?: 'card' | 'cash on delivery';
}) {
    React.useEffect(() => {
        toast.error(SAVE_FAILED_MESSAGE);
    }, []);

    return (
        <PaymentControlStatic
            status={revertedStatus}
            pendingStatus={null}
            saveState='idle'
            onSelect={NOOP}
            onConfirm={NOOP}
            onCancel={NOOP}
            paymentMethod={paymentMethod}
        />
    );
}

const NOOP = () => undefined;

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 6/Admin Order Detail',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default / idle — read-only badge + the Select control, ready to use. */
export const Default: Story = {
    name: 'Default — Idle Control & Status Badge',
    render: () => <PaymentControlHarness initialStatus='paid' paymentMethod='card' />,
};

/**
 * Full happy-path flow — pick any other status from the Select to open the
 * confirmation dialog, confirm to apply, cancel to leave unchanged (235).
 */
export const ConfirmFlow: Story = {
    name: 'Confirm Flow — Select → Dialog → Apply',
    render: () => <PaymentControlHarness initialStatus='unpaid' paymentMethod='card' />,
};

/** Confirmation dialog, statically open, so reviewers see the exact copy. */
export const ConfirmDialog: Story = {
    name: 'Confirm Dialog — Pending Change Awaiting Confirm',
    render: () => (
        <PaymentControlStatic
            status='unpaid'
            pendingStatus='paid'
            saveState='idle'
            onSelect={NOOP}
            onConfirm={NOOP}
            onCancel={NOOP}
            paymentMethod='card'
        />
    ),
};

/** Saving — the control shows a spinner and is disabled while the change persists. */
export const Saving: Story = {
    name: 'Loading — Saving The Status Change',
    render: () => (
        <PaymentControlStatic
            status='unpaid'
            pendingStatus={null}
            saveState='saving'
            onSelect={NOOP}
            onConfirm={NOOP}
            onCancel={NOOP}
            paymentMethod='card'
        />
    ),
};

/** Success — the badge now reflects the confirmed new status (Paid). */
export const Success: Story = {
    name: 'Success — Badge Updated To New Status',
    render: () => (
        <PaymentControlStatic
            status='paid'
            pendingStatus={null}
            saveState='idle'
            onSelect={NOOP}
            onConfirm={NOOP}
            onCancel={NOOP}
            paymentMethod='card'
        />
    ),
};

/**
 * Refunded — the new status (236). The Refunded badge (amber, outlined) is
 * visually distinct from Paid (green) / Unpaid (grey) / Failed (red). Cash-on-
 * delivery order, to show the change is allowed regardless of method (235).
 */
export const Refunded: Story = {
    name: 'Refunded — Distinct New Badge (COD Order)',
    render: () => (
        <PaymentControlStatic
            status='refunded'
            pendingStatus={null}
            saveState='idle'
            onSelect={NOOP}
            onConfirm={NOOP}
            onCancel={NOOP}
            paymentMethod='cash on delivery'
        />
    ),
};

/** Error — the save failed; a destructive toast shows and the badge reverts. */
export const ErrorRevert: Story = {
    name: 'Error — Save Failed, Toast + Status Reverted',
    parameters: {
        docs: {
            description: {
                story: 'On a failed change the badge reverts to its previous value and a destructive Sonner toast (bottom-right) reports the failure — no inline error. Reuses the toast pattern of the admin delivery-status mutation.',
            },
        },
    },
    render: () => <PaymentControlErrorStatic revertedStatus='unpaid' paymentMethod='card' />,
};

/** Interactive error path — confirm a change to see the toast + revert live. */
export const ErrorFlow: Story = {
    name: 'Error Flow — Confirm Then Network Failure (Toast + Revert)',
    parameters: {
        docs: {
            description: {
                story: 'Pick a different status and confirm: the badge updates optimistically, then on the simulated failure it reverts and a destructive toast appears. The toast replaces the previous inline error.',
            },
        },
    },
    render: () => <PaymentControlHarness initialStatus='paid' paymentMethod='card' failOnConfirm />,
};

/**
 * Badge gallery — all four payment-status badges side by side, so the
 * visual distinction (236) is unmistakable in one view.
 */
export const BadgeVariants: Story = {
    name: 'Badge Variants — Paid / Unpaid / Failed / Refunded',
    render: () => (
        <div className='flex min-h-[200px] flex-wrap items-center gap-4 bg-background p-10'>
            {PAYMENT_STATUS_OPTIONS.map(option => (
                <div key={option.key} className='flex flex-col items-center gap-2'>
                    <PaymentStatusBadge paymentStatus={option.key} />
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50'>
                        {option.key}
                    </span>
                </div>
            ))}
        </div>
    ),
};
