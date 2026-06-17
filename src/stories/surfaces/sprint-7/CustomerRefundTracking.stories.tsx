import type { Meta, StoryObj } from '@storybook/react-vite';
import { CheckCircle2, Clock, Copy, Landmark, TriangleAlert } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';
import Spinner from '@/components/spinner';

// ---------------------------------------------------------------------------
// Implementation reference — stories 242, 243, 246 (customer order tracking).
//
// The customer order-tracking page already exists (src/pages/order-detail/
// order-detail.tsx, route orders/{id}). The refund capability appears in the
// RIGHT-COLUMN sidebar action card (src/pages/order-detail/components/
// order-action-card.tsx), which today holds order id / date / status + a
// "Cancel order" action. This sprint adds, ON THAT CARD, a refund region:
//
//   • 243 — a "Request refund" action, shown ONLY for a delivered bank-transfer
//     order within 24h of delivery that has NO refund yet. Confirming opens a
//     Dialog (mirrors the existing cancel-confirm Dialog on the same card).
//   • 242 / 243 — once a refund exists (created on cancel OR on request), the
//     action is REPLACED by a refund-status panel showing "Refund pending".
//   • 246 — when the refund is Paid the panel shows the transfer reference and
//     the date the refund was sent.
//   • 242 — a refund created on cancellation reads as "Refund pending" like any
//     other pending refund. BUT when that cancel-initiated refund is created
//     while the customer has no bank details on file, it cannot be sent — it is
//     HELD awaiting bank details: tracking shows a "bank details needed" panel
//     with an "Add bank details" action routing to the customer's general bank/
//     payment settings (story 254 — settings/payment, same target as the
//     request-refund dialog's button).
//   • 243 (amended) — confirming "Request refund" with NO bank details on file
//     does NOT create a refund; the confirm dialog instead prompts the customer
//     to add their bank details first, with an "Add bank details" action routing
//     to the customer's general bank/payment settings (story 254 — the Payment
//     section of the account settings, settings/payment).
//
// Visibility rules captured below (shouldShowRequestAction): no action for COD
// orders, for not-yet-delivered orders, beyond the 24h window, or when a refund
// already exists (its status replaces the action — 243 final AC).
//
// Everything else on the page (nav, hero, checkout progress, delivery timeline,
// order-items card) is unchanged → rendered as labelled placeholders so the
// reviewer sees the refund region in real page context, not in isolation.
//
// Mock-only fixtures; no state management beyond the local interaction harness,
// no api/model imports.
// ---------------------------------------------------------------------------

/** Mirrors src/app/utils/currency.utils.ts — VND formatting used across the app. */
function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Refund domain (mock shapes — matches the ACs' data shape, not real models)
// ---------------------------------------------------------------------------

/**
 * Customer-visible refund status. A Failed refund is intentionally NOT surfaced
 * to the customer as "Failed" — see <confirmations>. To the customer a refund
 * in flight always reads as Pending; Paid is the terminal customer-visible
 * state. A cancel-initiated refund created while the customer has NO bank
 * details on file cannot be sent — it is HELD awaiting bank details, and the
 * customer is prompted to add them so the refund can proceed.
 */
type CustomerRefundStatus = 'pending' | 'held' | 'paid';

interface CustomerRefund {
    status: CustomerRefundStatus;
    amount: number;
    /** ISO-ish display string; present once Paid (246). */
    transferReference: string | null;
    /** Date the refund was sent; present once Paid (246). */
    sentDate: string | null;
}

interface OrderContext {
    slugId: string;
    orderDate: string;
    totalAmount: number;
    paymentMethod: 'banking' | 'cash on delivery';
    /** delivery state — refund request requires a delivered order (243). */
    delivered: boolean;
    /** within the 24h post-delivery window (243). */
    withinRefundWindow: boolean;
    /** whether the customer has refund-payout bank details on file (242 / 243). */
    hasBankDetails: boolean;
    refund: CustomerRefund | null;
}

/**
 * Request-refund action visibility (243). Shown only when: paid by bank
 * transfer, delivered, within 24h, and no refund exists yet. A refund that
 * already exists replaces the action with its status (handled in the card).
 */
function shouldShowRequestAction(order: OrderContext): boolean {
    return order.paymentMethod === 'banking' && order.delivered && order.withinRefundWindow && order.refund === null;
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const BASE_ORDER: OrderContext = {
    slugId: 'A1B2C3',
    orderDate: '12 June 2026, 09:02',
    totalAmount: 485_000,
    paymentMethod: 'banking',
    delivered: true,
    withinRefundWindow: true,
    hasBankDetails: true,
    refund: null,
};

const REFUND_PENDING: CustomerRefund = {
    status: 'pending',
    amount: 485_000,
    transferReference: null,
    sentDate: null,
};

const REFUND_HELD: CustomerRefund = {
    status: 'held',
    amount: 485_000,
    transferReference: null,
    sentDate: null,
};

const REFUND_PAID: CustomerRefund = {
    status: 'paid',
    amount: 485_000,
    transferReference: 'VCB-TRF-20260613-0099431',
    sentDate: '13 June 2026, 14:27',
};

// ---------------------------------------------------------------------------
// Refund status panel — shown once a refund exists (242 / 246).
// Replaces the "Request refund" action.
// ---------------------------------------------------------------------------

function RefundStatusPanel({ refund, onAddBankDetails }: { refund: CustomerRefund; onAddBankDetails: () => void }) {
    const isPaid = refund.status === 'paid';
    const isHeld = refund.status === 'held';

    return (
        <div className='rounded-lg border bg-muted/30 p-4' role='status' aria-live='polite'>
            <div className='mb-3 flex items-center justify-between'>
                <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>Refund</span>
                {isPaid ? (
                    <Badge variant='success' className='gap-1'>
                        <CheckCircle2 className='h-3 w-3' />
                        Refund sent
                    </Badge>
                ) : isHeld ? (
                    <Badge variant='warning' className='gap-1'>
                        <TriangleAlert className='h-3 w-3' />
                        Bank details needed
                    </Badge>
                ) : (
                    <Badge variant='warning' className='gap-1'>
                        <Clock className='h-3 w-3' />
                        Refund pending
                    </Badge>
                )}
            </div>

            <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Amount</span>
                    <span className='font-semibold'>{formatVnd(refund.amount)}</span>
                </div>

                {isPaid ? (
                    <>
                        <div className='flex justify-between'>
                            <span className='text-muted-foreground'>Sent on</span>
                            <span className='font-medium'>{refund.sentDate}</span>
                        </div>
                        <Separator />
                        <div>
                            <div className='mb-1 text-xs text-muted-foreground'>Transfer reference</div>
                            <div className='flex items-center gap-2'>
                                <code className='flex-1 truncate rounded bg-muted px-2 py-1 font-mono text-xs'>
                                    {refund.transferReference}
                                </code>
                                <Button variant='ghost' size='icon-sm' aria-label='Copy transfer reference'>
                                    <Copy className='h-3.5 w-3.5' />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : isHeld ? (
                    <>
                        <p className='text-xs text-muted-foreground'>
                            We can&apos;t send your refund yet — we don&apos;t have a bank account on file. Add your
                            bank details and we&apos;ll send it to that account.
                        </p>
                        <Separator />
                        <Button variant='default' size='sm' className='w-full' onClick={onAddBankDetails}>
                            <Landmark className='h-4 w-4' />
                            Add bank details
                        </Button>
                    </>
                ) : (
                    <p className='text-xs text-muted-foreground'>
                        We&apos;ve started your refund to your bank account. You&apos;ll be notified once it&apos;s
                        sent.
                    </p>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// The CHANGED card — customer order action card with the refund region.
//
// Mirrors src/pages/order-detail/components/order-action-card.tsx: a sticky
// sidebar Card with order id / date / status, primary "Continue shopping", and
// the existing cancel-confirm Dialog. The refund region is added below.
// ---------------------------------------------------------------------------

interface RefundActionCardProps {
    order: OrderContext;
    /** Drives the request-confirm Dialog. */
    confirmOpen: boolean;
    /** True while the request is being submitted (optimistic → pending). */
    isRequesting: boolean;
    onRequestClick: () => void;
    onConfirmRequest: () => void;
    onCancelRequest: () => void;
    /** Routes to the customer's general bank/payment settings (254 — settings/payment). */
    onAddBankDetails: () => void;
}

function RefundActionCard({
    order,
    confirmOpen,
    isRequesting,
    onRequestClick,
    onConfirmRequest,
    onCancelRequest,
    onAddBankDetails,
}: RefundActionCardProps) {
    const showRequest = shouldShowRequestAction(order);

    return (
        <Card className='sticky top-4'>
            <CardHeader>
                <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                <div className='space-y-3 text-sm'>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            Order ID
                        </div>
                        <div className='font-mono rounded bg-muted px-2 py-1 text-sm'>{order.slugId}</div>
                    </div>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            Placed on
                        </div>
                        <div className='font-medium'>{order.orderDate}</div>
                    </div>
                    <div>
                        <div className='mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                            Status
                        </div>
                        <Badge variant='outline' className='flex w-fit items-center gap-1.5'>
                            <CheckCircle2 className='h-3 w-3' />
                            Delivered
                        </Badge>
                    </div>
                </div>
            </CardContent>

            <CardContent className='pt-0'>
                <div className='space-y-2'>
                    <Button variant='default' size='lg' className='w-full'>
                        Continue shopping
                    </Button>

                    {/* Refund region — request action OR status panel (243 final AC:
                        an existing refund's status REPLACES the action). */}
                    {order.refund ? (
                        <RefundStatusPanel refund={order.refund} onAddBankDetails={onAddBankDetails} />
                    ) : showRequest ? (
                        <Button
                            variant='outline'
                            size='lg'
                            className='w-full'
                            onClick={onRequestClick}
                            disabled={isRequesting}
                        >
                            {isRequesting ? (
                                <>
                                    <Spinner size='sm' />
                                    Requesting…
                                </>
                            ) : (
                                'Request refund'
                            )}
                        </Button>
                    ) : null}
                </div>
            </CardContent>

            {/* Request-refund confirmation Dialog (243). When the customer has no
                bank details on file, it does NOT create a refund — it prompts
                them to add their bank details first (243 amended). */}
            <Dialog open={confirmOpen} onOpenChange={open => (!open ? onCancelRequest() : undefined)}>
                <DialogContent>
                    {order.hasBankDetails ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>Request a refund?</DialogTitle>
                                <DialogDescription>
                                    We&apos;ll start a refund of{' '}
                                    <span className='font-medium text-foreground'>{formatVnd(order.totalAmount)}</span>{' '}
                                    to the bank account on file. Refunds are usually sent within a few business days.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='outline' onClick={onCancelRequest} disabled={isRequesting}>
                                    Not now
                                </Button>
                                <Button onClick={onConfirmRequest} disabled={isRequesting}>
                                    {isRequesting ? 'Requesting…' : 'Request refund'}
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle>Add your bank details first</DialogTitle>
                                <DialogDescription>
                                    We don&apos;t have a bank account on file to send your refund to. Add your bank
                                    details, then request the refund again.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant='outline' onClick={onCancelRequest}>
                                    Not now
                                </Button>
                                <Button onClick={onAddBankDetails}>
                                    <Landmark className='h-4 w-4' />
                                    Add bank details
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
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
// Page shell — composes the changed action card into the full order-tracking
// page, with the rest of the page as placeholders.
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <NavPlaceholder />

            {/* Hero / checkout progress — placeholder; exists in current system, not changed by this sprint */}
            <BlockPlaceholder label='order hero + checkout progress placeholder' height={140} />

            <div className='container mx-auto max-w-5xl px-4 py-6 sm:py-8'>
                <div className='space-y-6'>
                    {/* Order header — placeholder; exists in current system, not changed by this sprint */}
                    <BlockPlaceholder label='order header placeholder' height={80} />

                    <div className='grid gap-6 lg:grid-cols-3'>
                        <div className='space-y-6 lg:col-span-2'>
                            {/* Delivery status timeline — placeholder; not changed this sprint */}
                            <BlockPlaceholder label='delivery status timeline placeholder' height={160} />
                            {/* Order items card — placeholder; not changed this sprint */}
                            <BlockPlaceholder label='order items card placeholder' height={220} />
                        </div>

                        {/* Right column — the CHANGED refund region lives here */}
                        <div className='lg:col-span-1'>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — drives Request → Dialog → confirm → pending flow.
// ---------------------------------------------------------------------------

function RefundTrackingHarness({ initialOrder }: { initialOrder: OrderContext }) {
    const [order, setOrder] = React.useState<OrderContext>(initialOrder);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isRequesting, setIsRequesting] = React.useState(false);

    const handleRequestClick = () => setConfirmOpen(true);
    const handleCancelRequest = () => setConfirmOpen(false);

    const handleConfirmRequest = () => {
        setConfirmOpen(false);
        setIsRequesting(true);
        window.setTimeout(() => {
            setIsRequesting(false);
            // Refund created with status Pending; tracking now shows "Refund pending" (243).
            setOrder(previous => ({ ...previous, refund: REFUND_PENDING }));
        }, 700);
    };

    // Routes to the customer's general bank/payment settings (254 —
    // settings/payment). In the story we simulate the return trip: details
    // added → the order gains bank details so the customer can request again.
    const handleAddBankDetails = () => {
        setConfirmOpen(false);
        setOrder(previous => ({ ...previous, hasBankDetails: true }));
    };

    return (
        <PageShell>
            <RefundActionCard
                order={order}
                confirmOpen={confirmOpen}
                isRequesting={isRequesting}
                onRequestClick={handleRequestClick}
                onConfirmRequest={handleConfirmRequest}
                onCancelRequest={handleCancelRequest}
                onAddBankDetails={handleAddBankDetails}
            />
        </PageShell>
    );
}

const NOOP = () => undefined;

function StaticCard(order: OrderContext, confirmOpen = false) {
    return (
        <PageShell>
            <RefundActionCard
                order={order}
                confirmOpen={confirmOpen}
                isRequesting={false}
                onRequestClick={NOOP}
                onConfirmRequest={NOOP}
                onCancelRequest={NOOP}
                onAddBankDetails={NOOP}
            />
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Customer Refund Tracking',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — delivered bank-transfer order within 24h, no refund: the
 *  "Request refund" action is shown (243). Click it to run the full flow. */
export const RequestAvailable: Story = {
    name: 'Default — Request Refund Available (243)',
    render: () => <RefundTrackingHarness initialOrder={BASE_ORDER} />,
};

/** Confirmation dialog statically open, so reviewers see the exact copy. */
export const RequestConfirmDialog: Story = {
    name: 'Request Confirm Dialog — Awaiting Confirm (243)',
    render: () => StaticCard(BASE_ORDER, true),
};

/** Refund pending — created on cancellation (242) or after request (243);
 *  the action is replaced by the "Refund pending" status panel. */
export const RefundPending: Story = {
    name: 'Refund Pending — Status Replaces Action (242 / 246)',
    render: () => StaticCard({ ...BASE_ORDER, refund: REFUND_PENDING }),
};

/** Refund paid — transfer reference + sent date shown read-only (246). */
export const RefundPaid: Story = {
    name: 'Refund Paid — Transfer Reference + Sent Date (246)',
    render: () => StaticCard({ ...BASE_ORDER, refund: REFUND_PAID }),
};

/** No action — delivered but more than 24h after delivery: no "Request refund"
 *  (243 negative AC). */
export const OutsideWindow: Story = {
    name: 'No Action — Beyond 24h Window (243)',
    render: () => StaticCard({ ...BASE_ORDER, withinRefundWindow: false }),
};

/** No action — not paid by bank transfer (cash on delivery): no "Request
 *  refund" (242 / 243 negative ACs). */
export const NonBankTransfer: Story = {
    name: 'No Action — Cash On Delivery Order (242 / 243)',
    render: () => StaticCard({ ...BASE_ORDER, paymentMethod: 'cash on delivery' }),
};

/** Request with no bank details — confirming "Request refund" when no bank
 *  details are on file does NOT create a refund; the dialog prompts the
 *  customer to add their bank details first (243 amended). Dialog shown open. */
export const RequestNeedsBankDetails: Story = {
    name: 'Request Prompt — Add Bank Details First (243)',
    parameters: {
        docs: {
            description: {
                story: 'Confirming "Request refund" with no bank details on file does not create a refund. The dialog prompts the customer to add their bank details first; the "Add bank details" action routes to the customer\'s general bank/payment settings (story 254 — the Payment section of the account settings, settings/payment).',
            },
        },
    },
    render: () => StaticCard({ ...BASE_ORDER, hasBankDetails: false }, true),
};

/** Loading — the order-tracking page skeleton while the order loads. */
export const Loading: Story = {
    name: 'Loading — Skeleton State',
    render: () => (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <NavPlaceholder />
            <Skeleton className='h-[140px] w-full rounded-none' />
            <div className='container mx-auto max-w-5xl px-4 py-6 sm:py-8'>
                <div className='space-y-6'>
                    <Skeleton className='h-[80px] w-full rounded-xl' />
                    <div className='grid gap-6 lg:grid-cols-3'>
                        <div className='space-y-6 lg:col-span-2'>
                            <Skeleton className='h-[160px] w-full rounded-xl' />
                            <Skeleton className='h-[220px] w-full rounded-xl' />
                        </div>
                        <div className='lg:col-span-1'>
                            <Card className='sticky top-4'>
                                <CardHeader>
                                    <Skeleton className='h-5 w-36' />
                                </CardHeader>
                                <CardContent className='space-y-4'>
                                    <Skeleton className='h-12 w-full' />
                                    <Skeleton className='h-12 w-full' />
                                    <Skeleton className='h-12 w-full' />
                                </CardContent>
                                <CardContent className='space-y-2 pt-0'>
                                    <Skeleton className='h-11 w-full' />
                                    <Skeleton className='h-11 w-full' />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
};

/** Retry-after-cancel reference — a cancelled order's refund (created on
 *  cancellation, 242) shown to the customer. Always reads as Pending until Paid;
 *  a behind-the-scenes Failed retry is never surfaced as "Failed". */
export const CancelledOrderRefund: Story = {
    name: 'Cancelled Order — Refund Pending On Cancel (242)',
    parameters: {
        docs: {
            description: {
                story: 'When a paid bank-transfer order is cancelled, a full-total refund is created with status Pending and tracking shows "Refund pending". To the customer this looks identical to a requested refund — RotateCcw marks it as a cancellation-driven refund only in this caption, not in the UI.',
            },
        },
    },
    render: () =>
        StaticCard({
            ...BASE_ORDER,
            delivered: false,
            withinRefundWindow: false,
            hasBankDetails: true,
            refund: REFUND_PENDING,
        }),
};

/** Refund held — a cancel-initiated refund created while the customer has no
 *  bank details on file cannot be sent; tracking shows a "bank details needed"
 *  panel with an "Add bank details" action that routes to the customer's
 *  general bank/payment settings (story 254 — settings/payment, the same target
 *  as the request-refund dialog's button). */
export const RefundHeldNeedsBankDetails: Story = {
    name: 'Refund Held — Bank Details Needed (242)',
    parameters: {
        docs: {
            description: {
                story: 'When a paid bank-transfer order is cancelled but the customer has no bank account on file, the full-total refund is created but cannot be sent — it is held awaiting bank details. Tracking shows a "bank details needed" panel; the "Add bank details" action routes to the customer\'s general bank/payment settings (story 254 — settings/payment, the same target as the request-refund dialog\'s button).',
            },
        },
    },
    render: () =>
        StaticCard({
            ...BASE_ORDER,
            delivered: false,
            withinRefundWindow: false,
            hasBankDetails: false,
            refund: REFUND_HELD,
        }),
};
