import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    ChefHat,
    Clock,
    Copy,
    FolderOpen,
    LayoutDashboard,
    Moon,
    RotateCcw,
    ShoppingBag,
    Users,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import { Separator } from '@/components/separator';
import { Toaster } from '@/components/sonner';
import Spinner from '@/components/spinner';

// ---------------------------------------------------------------------------
// Implementation reference — stories 244 (approve) + 247 (retry), admin refund
// detail page. NEW page, route under admin (e.g. admin/refunds/{slugId}),
// opened from the Refunds ledger (story 245 / AdminRefundsLedger.stories.tsx).
//
// The page composes inside the existing AdminLayout (sticky admin top-nav,
// rendered here as a faithful AdminTopNav matching the dashboard surface). The
// refund-detail content is the NEW surface this story specifies:
//
//   • A refund summary (order ref, amount, created date, current status badge).
//   • A status-driven action region:
//       – Pending  → "Approve refund" (244). Confirm opens a Dialog; on confirm
//         the transfer is initiated automatically and the refund shows as
//         Processing.
//       – Processing → read-only, spinner, no actions (auto transfer in flight).
//       – Paid     → read-only transfer reference + paid date (244 / shown to
//         staff and customer). No actions.
//       – Failed   → failure reason shown (244) + "Retry refund" (247). Retry
//         re-initiates the transfer → Processing; success → Paid, failure →
//         back to Failed with the latest reason.
//
// Statuses here are the FULL admin set: Pending | Processing | Paid | Failed.
// (Customer order tracking only ever shows Pending | Paid — see the customer
// surface + <confirmations>.)
//
// Mock-only fixtures; local interaction harness only, no api/model imports.
// ---------------------------------------------------------------------------

/** Mirrors src/app/utils/currency.utils.ts — VND formatting used across the app. */
function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Refund domain (mock shapes — matches the ACs' data shape, not real models)
// ---------------------------------------------------------------------------

type RefundStatus = 'pending' | 'processing' | 'paid' | 'failed';

interface Refund {
    slugId: string;
    orderSlugId: string;
    amount: number;
    status: RefundStatus;
    createdDate: string;
    /** present once Paid (244). */
    transferReference: string | null;
    /** present once Paid (244). */
    paidDate: string | null;
    /** present when Failed (244 / 247). */
    failureReason: string | null;
}

interface StatusMeta {
    label: string;
    icon: LucideIcon;
    variant: 'warning' | 'secondary' | 'success' | 'destructive';
}

/** Icon-backed statuses (processing renders a spinner instead, handled below). */
const STATUS_META: Record<Exclude<RefundStatus, 'processing'>, StatusMeta> = {
    pending: { label: 'Pending', icon: Clock, variant: 'warning' },
    paid: { label: 'Paid', icon: CheckCircle2, variant: 'success' },
    failed: { label: 'Failed', icon: AlertTriangle, variant: 'destructive' },
};

function RefundStatusBadge({ status }: { status: RefundStatus }) {
    if (status === 'processing') {
        return (
            <Badge variant='secondary' className='gap-1'>
                <Spinner size='sm' />
                Processing
            </Badge>
        );
    }
    const meta = STATUS_META[status];
    const Icon = meta.icon;
    return (
        <Badge variant={meta.variant} className='gap-1'>
            <Icon className='h-3 w-3' />
            {meta.label}
        </Badge>
    );
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const REFUND_PENDING: Refund = {
    slugId: 'RF-7C21',
    orderSlugId: 'A1B2C3',
    amount: 485_000,
    status: 'pending',
    createdDate: '13 June 2026, 10:40',
    transferReference: null,
    paidDate: null,
    failureReason: null,
};

const REFUND_PROCESSING: Refund = { ...REFUND_PENDING, status: 'processing' };

const REFUND_PAID: Refund = {
    ...REFUND_PENDING,
    status: 'paid',
    transferReference: 'VCB-TRF-20260613-0099431',
    paidDate: '13 June 2026, 14:27',
};

const REFUND_FAILED: Refund = {
    ...REFUND_PENDING,
    status: 'failed',
    failureReason: 'Beneficiary account number rejected by the receiving bank (code 09 — invalid account).',
};

const RETRY_FAILED_MESSAGE = 'The transfer couldn’t be re-initiated. Please try again.';

// ---------------------------------------------------------------------------
// Admin top-nav — matches the dashboard surface shell.
// ---------------------------------------------------------------------------

interface NavItem {
    label: string;
    icon: LucideIcon;
    active: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, active: false },
    { label: 'Orders', icon: ShoppingBag, active: false },
    { label: 'Refunds', icon: RotateCcw, active: true },
    { label: 'Foods', icon: ChefHat, active: false },
    { label: 'Categories', icon: FolderOpen, active: false },
    { label: 'Users', icon: Users, active: false },
];

function AdminTopNav() {
    return (
        <header className='sticky top-0 z-50 h-16 w-full border-b bg-background'>
            <div className='mx-auto flex h-full w-full max-w-7xl items-center px-6'>
                <div className='flex flex-1 items-center gap-2'>
                    <span className='text-lg font-semibold tracking-tight text-primary'>Notism</span>
                    <Badge
                        variant='secondary'
                        className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'
                    >
                        Admin
                    </Badge>
                </div>
                <nav className='flex items-center gap-1'>
                    {NAV_ITEMS.map(item => (
                        <a
                            key={item.label}
                            href='#'
                            aria-current={item.active ? 'page' : undefined}
                            className={[
                                'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                                item.active
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                            ].join(' ')}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div className='flex flex-1 items-center justify-end gap-2'>
                    <button
                        aria-label='Toggle theme'
                        className='flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground'
                    >
                        <Moon className='h-4 w-4' />
                    </button>
                    <div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground'>
                        TM
                    </div>
                </div>
            </div>
        </header>
    );
}

// ---------------------------------------------------------------------------
// Refund summary — read-only facts, always shown.
// ---------------------------------------------------------------------------

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>{label}</span>
            <span className='font-medium'>{children}</span>
        </div>
    );
}

function RefundSummaryCard({ refund }: { refund: Refund }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Refund Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>Status</span>
                    <RefundStatusBadge status={refund.status} />
                </div>
                <Separator />
                <SummaryRow label='Refund ID'>
                    <code className='font-mono text-xs'>{refund.slugId}</code>
                </SummaryRow>
                <SummaryRow label='Order'>
                    <span className='font-mono text-primary'>#{refund.orderSlugId}</span>
                </SummaryRow>
                <SummaryRow label='Amount'>{formatVnd(refund.amount)}</SummaryRow>
                <SummaryRow label='Created'>{refund.createdDate}</SummaryRow>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Transfer record — read-only, shown once Paid (244).
// ---------------------------------------------------------------------------

function TransferRecordCard({ refund }: { refund: Refund }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transfer Record</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <SummaryRow label='Paid on'>{refund.paidDate}</SummaryRow>
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
                <p className='text-xs text-muted-foreground'>
                    The transfer completed automatically. This record is read-only.
                </p>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Failure card — shown when Failed (244 / 247).
// ---------------------------------------------------------------------------

function FailureCard({ reason }: { reason: string }) {
    return (
        <Card className='border-destructive/30'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2 text-destructive'>
                    <AlertTriangle className='h-4 w-4' />
                    Transfer Failed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='rounded-lg bg-destructive/10 p-3 text-sm text-destructive'>{reason}</div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Action region — status-driven primary action (244 / 247).
// ---------------------------------------------------------------------------

interface ActionPanelProps {
    refund: Refund;
    isBusy: boolean;
    onApprove: () => void;
    onRetry: () => void;
}

function ActionPanel({ refund, isBusy, onApprove, onRetry }: ActionPanelProps) {
    if (refund.status === 'pending') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Approve Refund</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                        Approving initiates the bank transfer automatically for the full refund amount.
                    </p>
                    <Button size='lg' className='w-full' onClick={onApprove} disabled={isBusy}>
                        {isBusy ? (
                            <>
                                <Spinner size='sm' />
                                Initiating…
                            </>
                        ) : (
                            'Approve refund'
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (refund.status === 'processing') {
        return (
            <Card>
                <CardContent className='flex items-center gap-3 py-6' role='status' aria-live='polite'>
                    <Spinner size='md' />
                    <div>
                        <div className='font-medium'>Transfer in progress</div>
                        <p className='text-sm text-muted-foreground'>
                            The bank transfer is being processed automatically. This may take a moment.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (refund.status === 'failed') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Retry Refund</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <p className='text-sm text-muted-foreground'>
                        Retrying re-initiates the bank transfer automatically. If it fails again, the latest failure
                        reason is recorded.
                    </p>
                    <Button size='lg' className='w-full' onClick={onRetry} disabled={isBusy}>
                        {isBusy ? (
                            <>
                                <Spinner size='sm' />
                                Retrying…
                            </>
                        ) : (
                            <>
                                <RotateCcw className='h-4 w-4' />
                                Retry refund
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Paid — no actions; the transfer record is the read-only outcome.
    return null;
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <AdminTopNav />
            <main className='mx-auto w-full max-w-4xl px-6 py-8'>
                <Button variant='ghost' className='mb-6 -ml-2' disabled>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Refunds
                </Button>
                <div className='mb-6'>
                    <h1 className='text-2xl font-bold text-foreground'>Refund detail</h1>
                    <p className='mt-0.5 text-sm text-muted-foreground'>
                        Approve, retry, and review the automatic bank transfer for this refund.
                    </p>
                </div>
                {children}
            </main>
            <Toaster />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Detail layout — summary + status-specific cards + action panel.
// ---------------------------------------------------------------------------

interface DetailProps {
    refund: Refund;
    isBusy: boolean;
    confirmOpen: boolean;
    onApproveClick: () => void;
    onConfirmApprove: () => void;
    onCancelApprove: () => void;
    onRetry: () => void;
}

function RefundDetail({
    refund,
    isBusy,
    confirmOpen,
    onApproveClick,
    onConfirmApprove,
    onCancelApprove,
    onRetry,
}: DetailProps) {
    return (
        <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
            <div className='space-y-6'>
                <RefundSummaryCard refund={refund} />
                {refund.status === 'paid' && <TransferRecordCard refund={refund} />}
                {refund.status === 'failed' && refund.failureReason && <FailureCard reason={refund.failureReason} />}
            </div>

            <div className='space-y-6'>
                <ActionPanel refund={refund} isBusy={isBusy} onApprove={onApproveClick} onRetry={onRetry} />
            </div>

            {/* Approve confirmation Dialog (244) — initiating a transfer is a
                consequential action, so confirm before it fires. */}
            <Dialog open={confirmOpen} onOpenChange={open => (!open ? onCancelApprove() : undefined)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve and send refund?</DialogTitle>
                        <DialogDescription>
                            This initiates a bank transfer of{' '}
                            <span className='font-medium text-foreground'>{formatVnd(refund.amount)}</span> to the
                            customer automatically for order{' '}
                            <span className='font-mono text-foreground'>#{refund.orderSlugId}</span>. This can&apos;t be
                            undone once sent.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant='outline' onClick={onCancelApprove} disabled={isBusy}>
                            Cancel
                        </Button>
                        <Button onClick={onConfirmApprove} disabled={isBusy}>
                            {isBusy ? 'Initiating…' : 'Approve & send'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interactive harness — drives approve / retry → processing → paid|failed.
// ---------------------------------------------------------------------------

interface HarnessProps {
    initial: Refund;
    /** Outcome of the auto transfer after approve/retry. */
    outcome?: 'paid' | 'failed';
    /** When true, approve/retry never resolves — stays Processing. */
    stickyProcessing?: boolean;
}

function RefundDetailHarness({ initial, outcome = 'paid', stickyProcessing = false }: HarnessProps) {
    const [refund, setRefund] = React.useState<Refund>(initial);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isBusy, setIsBusy] = React.useState(false);

    const settle = () => {
        if (stickyProcessing) return;
        window.setTimeout(() => {
            setRefund(current =>
                outcome === 'paid'
                    ? {
                          ...current,
                          status: 'paid',
                          transferReference: REFUND_PAID.transferReference,
                          paidDate: REFUND_PAID.paidDate,
                          failureReason: null,
                      }
                    : {
                          ...current,
                          status: 'failed',
                          failureReason: REFUND_FAILED.failureReason,
                      }
            );
            setIsBusy(false);
        }, 1100);
    };

    const startTransfer = () => {
        setIsBusy(true);
        setRefund(current => ({ ...current, status: 'processing' }));
        if (stickyProcessing) return; // hold in processing for the Processing story
        settle();
    };

    const handleApproveClick = () => setConfirmOpen(true);
    const handleCancelApprove = () => setConfirmOpen(false);
    const handleConfirmApprove = () => {
        setConfirmOpen(false);
        startTransfer();
    };

    const handleRetry = () => {
        if (outcome === 'failed') {
            // Simulate a re-initiate that fails to even start → toast (247-style
            // failure feedback, reusing the global toast pattern).
            toast.error(RETRY_FAILED_MESSAGE);
        }
        startTransfer();
    };

    return (
        <PageShell>
            <RefundDetail
                refund={refund}
                isBusy={isBusy}
                confirmOpen={confirmOpen}
                onApproveClick={handleApproveClick}
                onConfirmApprove={handleConfirmApprove}
                onCancelApprove={handleCancelApprove}
                onRetry={handleRetry}
            />
        </PageShell>
    );
}

const NOOP = () => undefined;

function StaticDetail(refund: Refund, confirmOpen = false, isBusy = false) {
    return (
        <PageShell>
            <RefundDetail
                refund={refund}
                isBusy={isBusy}
                confirmOpen={confirmOpen}
                onApproveClick={NOOP}
                onConfirmApprove={NOOP}
                onCancelApprove={NOOP}
                onRetry={NOOP}
            />
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Admin Refund Detail',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — a Pending refund with the Approve action (244). Approve → confirm
 *  → transfer initiates → Processing → Paid. */
export const PendingApprove: Story = {
    name: 'Default — Pending, Approve Flow (244)',
    render: () => <RefundDetailHarness initial={REFUND_PENDING} outcome='paid' />,
};

/** Approve confirmation Dialog, statically open. */
export const ApproveConfirmDialog: Story = {
    name: 'Approve Confirm Dialog (244)',
    render: () => StaticDetail(REFUND_PENDING, true),
};

/** Processing — the auto transfer is in flight; read-only, no actions (244 / 247). */
export const Processing: Story = {
    name: 'Loading — Processing The Transfer (244 / 247)',
    render: () => StaticDetail(REFUND_PROCESSING),
};

/** Paid — transfer reference + paid date recorded, shown read-only (244). */
export const Paid: Story = {
    name: 'Success — Paid, Transfer Record Read-Only (244)',
    render: () => StaticDetail(REFUND_PAID),
};

/** Failed — failure reason recorded + shown, with the Retry action (244 / 247). */
export const Failed: Story = {
    name: 'Failed — Reason Shown + Retry Available (244 / 247)',
    render: () => StaticDetail(REFUND_FAILED),
};

/** Retry success — from Failed, retry re-initiates → Processing → Paid (247). */
export const RetrySuccess: Story = {
    name: 'Retry Flow — Failed → Processing → Paid (247)',
    render: () => <RefundDetailHarness initial={REFUND_FAILED} outcome='paid' />,
};

/** Retry fails again — from Failed, retry re-initiates → Processing → Failed
 *  with the latest reason; a toast reports the failure (247). */
export const RetryFailsAgain: Story = {
    name: 'Retry Flow — Failed → Processing → Failed Again (247)',
    parameters: {
        docs: {
            description: {
                story: 'Retrying a Failed refund re-initiates the transfer (Processing). When it fails again the refund returns to Failed with the latest failure reason, and a destructive toast reports it. Reuses the global toast pattern.',
            },
        },
    },
    render: () => <RefundDetailHarness initial={REFUND_FAILED} outcome='failed' />,
};
