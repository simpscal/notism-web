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
    QrCode,
    RotateCcw,
    ShoppingBag,
    Users,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/uis/dialog';
import ErrorState from '@/uis/error-state';
import { Separator } from '@/uis/separator';
import { Skeleton } from '@/uis/skeleton';
import { Toaster } from '@/uis/sonner';
import Spinner from '@/uis/spinner';

// ---------------------------------------------------------------------------
// Implementation reference — stories 244 (approve) + 247 (retry), admin refund
// detail page. NEW page, route under admin (e.g. admin/refunds/{slugId}),
// opened from the Refunds ledger (story 245 / AdminRefundsLedger.stories.tsx).
//
// The page composes inside the existing AdminLayout (sticky admin top-nav,
// rendered here as a faithful AdminTopNav matching the dashboard surface).
//
// LAYOUT (job-led, status-adaptive — behaviour unchanged from the prior
// version, only the visual structure/hierarchy):
//
//   • A status HERO strip leads the page: the current status badge, the refund
//     amount, and a one-line "what to do next" cue. Ops reads state + required
//     action first, before any facts.
//   • Below the hero, a two-region body whose EMPHASIS follows the job for the
//     current status (the regions stay consistent so the page never restructures
//     wholesale — only weight shifts):
//       – Pending / Failed → the ACTION is the job: the action card takes the
//         wide primary column; the read-only summary is the supporting rail.
//       – Processing → SCANNING THE QR is the job: the VietQR panel becomes a
//         wide focal card (large code beside its payload fields) spanning the
//         content, with the summary + transfer-in-progress note demoted beneath.
//       – Paid → the transfer record is the read-only outcome and leads; the
//         summary supports.
//
//   The status-driven action semantics are unchanged:
//       – Pending  → "Approve refund" (244). Confirm opens a Dialog; on confirm
//         the transfer is initiated automatically and the refund shows as
//         Processing.
//       – Processing → read-only, spinner, no actions (auto transfer in
//         flight) PLUS a SePay-hosted VietQR image (255) staff scan to send the
//         refund. The QR encodes the customer's payout account, the full order
//         total, and the refund id GUID as the FIRST token of the transfer
//         content (so the SePay outbound webhook auto-matches it — #250 parses
//         Split('-')[0] + Guid.TryParseExact("N")). Shown ONLY for Processing.
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

/**
 * Customer payout bank details captured in story 254. Used to build the VietQR
 * payment payload shown to staff while a refund is Processing (255).
 */
interface PayoutAccount {
    bankCode: string;
    accountNumber: string;
    accountHolderName: string;
}

interface Refund {
    /**
     * The refund's id GUID. This is the FIRST token of the VietQR transfer
     * content so the SePay outbound webhook can match the inbound transfer
     * (tech story #250: it parses Content.Trim().Split('-')[0] and
     * Guid.TryParseExact(token, "N", …)). Stored in "N" format — 32 hex
     * digits, no hyphens — so the first-token split yields the whole GUID.
     */
    id: string;
    slugId: string;
    orderSlugId: string;
    amount: number;
    status: RefundStatus;
    createdDate: string;
    /** customer's payout bank account — drives the VietQR payload (255). */
    payout: PayoutAccount;
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
                <Spinner size='sm' className='shrink-0' />
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
// Status hero — leads the page: status + amount + the next-step cue. Makes the
// current job unmistakable before any read-only facts.
// ---------------------------------------------------------------------------

const STATUS_CUE: Record<RefundStatus, string> = {
    pending: 'Awaiting approval — approve to initiate the bank transfer.',
    processing: 'Transfer in progress — scan the VietQR code below to send the refund.',
    paid: 'Refund paid — the bank transfer completed successfully.',
    failed: 'Transfer failed — review the reason and retry the transfer.',
};

/**
 * Subtle "Live" affordance — signals the detail is subscribed and re-renders on
 * an externally-pushed status change (no manual refresh; #245 live-update ACs).
 * Shown only while the refund is in a non-terminal state that can still flip
 * (Pending / Processing); a small pulsing dot communicates the live connection.
 */
function LiveIndicator() {
    return (
        <span className='inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
            <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-success' />
            </span>
            Live
        </span>
    );
}

function StatusHero({ refund, live = false }: { refund: Refund; live?: boolean }) {
    return (
        <Card
            className={
                refund.status === 'failed'
                    ? 'border-destructive/30'
                    : refund.status === 'processing'
                      ? 'border-primary/30'
                      : undefined
            }
        >
            <CardContent className='flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between'>
                <div className='space-y-2'>
                    <div className='flex items-center gap-3'>
                        <RefundStatusBadge status={refund.status} />
                        {live && (refund.status === 'pending' || refund.status === 'processing') && <LiveIndicator />}
                    </div>
                    <p className='text-sm text-muted-foreground'>{STATUS_CUE[refund.status]}</p>
                </div>
                <div className='shrink-0 text-left sm:text-right'>
                    <div className='text-xs uppercase tracking-wide text-muted-foreground'>Refund amount</div>
                    <div className='text-2xl font-bold tabular-nums text-foreground'>{formatVnd(refund.amount)}</div>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const PAYOUT_ACCOUNT: PayoutAccount = {
    bankCode: 'Vietcombank',
    accountNumber: '1023456789',
    accountHolderName: 'Nguyen Van A',
};

// Refund id in "N" format (no hyphens) — leads the VietQR transfer content so
// SePay's Split('-')[0] + Guid.TryParseExact(…, "N") matches the refund (#250).
const REFUND_ID = 'b1c7d2e3f4a5460789ab0123456789cd';

const REFUND_PENDING: Refund = {
    id: REFUND_ID,
    slugId: 'RF-7C21',
    orderSlugId: 'A1B2C3',
    amount: 485_000,
    status: 'pending',
    createdDate: '13 June 2026, 10:40',
    payout: PAYOUT_ACCOUNT,
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
// VietQR payment card — shown ONLY while Processing (255).
//
// The QR is a SePay-hosted VietQR image (https://qr.sepay.vn/img) built from
// the payout bank code + account number, the full order total as the transfer
// amount, and a transfer description whose FIRST token is the refund id GUID.
// Tech story #250 matches the inbound transfer by parsing
// Content.Trim().Split('-')[0] and Guid.TryParseExact(token, "N", …), so the
// description must LEAD with the "N"-format (dashless) refund id GUID — never a
// slug like "RF-7C21" (a slug's hyphen would truncate the parsed token).
//
// The card is hidden for Pending / Paid / Failed, and reappears when a Failed
// refund is retried back to Processing (the harness flips status → processing,
// so this card renders again with no extra logic).
//
// SePay's QR image endpoint mirrors the existing payment QR builder
// (src/features/payment/components/payment-qr.tsx) — see <confirmations> for
// the exact SePay URL/param contract to verify against the SePay account.
// ---------------------------------------------------------------------------

const SEPAY_QR_BASE_URL = 'https://qr.sepay.vn/img';

/**
 * Build the SePay-hosted VietQR image URL. The transfer description (`des`)
 * LEADS with the refund id GUID so SePay's outbound webhook auto-matches the
 * refund (#250). Amount is the full order total.
 */
function buildSepayQrUrl(refund: Refund): string {
    const params = new URLSearchParams({
        bank: refund.payout.bankCode,
        acc: refund.payout.accountNumber,
        amount: String(refund.amount),
        des: refund.id,
        template: 'compact',
    });
    return `${SEPAY_QR_BASE_URL}?${params.toString()}`;
}

function QrFieldRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className='flex items-start justify-between gap-3 text-sm'>
            <span className='shrink-0 text-muted-foreground'>{label}</span>
            <span className='text-right font-medium'>{children}</span>
        </div>
    );
}

function VietQrCard({ refund }: { refund: Refund }) {
    return (
        <Card className='border-primary/30'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <QrCode className='h-4 w-4 text-primary' />
                    Scan to pay refund
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Wide focal layout: the QR is the job while Processing, so it
                    leads at a generous size with its payload fields alongside on
                    wide screens (stacked on narrow). */}
                <div className='grid gap-6 md:grid-cols-[auto_1fr] md:items-start'>
                    <div className='flex flex-col items-center gap-3'>
                        {/* SePay-hosted VietQR image — encodes the payout account,
                            the full order total, and the refund id GUID as the
                            content (255). */}
                        <img
                            src={buildSepayQrUrl(refund)}
                            alt={`SePay VietQR payment code for refund ${refund.slugId}`}
                            className='h-64 w-64 max-w-full rounded-xl border border-border bg-white'
                        />
                        <span className='flex items-center gap-1.5 text-xs font-medium text-muted-foreground'>
                            <Spinner size='sm' className='shrink-0' />
                            Waiting for the transfer to be sent…
                        </span>
                    </div>

                    <div className='space-y-4'>
                        <p className='text-sm text-muted-foreground'>
                            Scan this VietQR code with a Vietnamese banking app to send the refund. The transfer
                            pre-fills with the customer&apos;s account, the full order total, and the refund id as the
                            content.
                        </p>

                        <div className='space-y-2 rounded-lg border bg-muted/30 p-4'>
                            <QrFieldRow label='Bank'>{refund.payout.bankCode}</QrFieldRow>
                            <QrFieldRow label='Account'>
                                <code className='font-mono text-xs'>{refund.payout.accountNumber}</code>
                            </QrFieldRow>
                            <QrFieldRow label='Holder'>{refund.payout.accountHolderName}</QrFieldRow>
                            <Separator />
                            <QrFieldRow label='Amount'>
                                <span className='font-semibold'>{formatVnd(refund.amount)}</span>
                            </QrFieldRow>
                            <QrFieldRow label='Content'>
                                <code className='break-all text-right font-mono text-xs text-primary'>{refund.id}</code>
                            </QrFieldRow>
                        </div>

                        <p className='text-xs text-muted-foreground'>
                            Keep the content starting with the refund id{' '}
                            <code className='break-all font-mono'>{refund.id}</code> so the payment is matched
                            automatically.
                        </p>
                    </div>
                </div>
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
                                <Spinner size='sm' className='shrink-0' />
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
                    <Spinner size='md' className='shrink-0' />
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
                                <Spinner size='sm' className='shrink-0' />
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
    /** When true, the detail is subscribed to live status pushes (#245): show the
     *  "Live" affordance and announce externally-pushed status changes. */
    live?: boolean;
    /** A11y announcement for the latest status change (drives the aria-live region). */
    liveAnnouncement?: string | null;
    onApproveClick: () => void;
    onConfirmApprove: () => void;
    onCancelApprove: () => void;
    onRetry: () => void;
}

function RefundDetail({
    refund,
    isBusy,
    confirmOpen,
    live = false,
    liveAnnouncement = null,
    onApproveClick,
    onConfirmApprove,
    onCancelApprove,
    onRetry,
}: DetailProps) {
    // Layout emphasis follows the job for the current status. The summary is a
    // consistent supporting rail in every status; only the lead region changes.
    const summary = <RefundSummaryCard refund={refund} />;

    return (
        <div className='space-y-6'>
            {/* Live status announcer (#245) — an externally-pushed Paid/Failed
                transition arrives WITHOUT any staff action; this polite aria-live
                region announces it so it reaches assistive tech without a refresh. */}
            <div role='status' aria-live='polite' className='sr-only'>
                {liveAnnouncement}
            </div>

            <StatusHero refund={refund} live={live} />

            {refund.status === 'processing' ? (
                // Processing → scanning the QR is the job: it leads full-width as
                // a focal panel; the supporting facts + in-progress note sit below.
                <>
                    {/* VietQR — shown only while Processing (255); hidden for
                        Pending / Paid / Failed, re-shown on retry → Processing. */}
                    <VietQrCard refund={refund} />
                    <div className='grid gap-6 lg:grid-cols-[1fr_1fr]'>
                        <ActionPanel refund={refund} isBusy={isBusy} onApprove={onApproveClick} onRetry={onRetry} />
                        {summary}
                    </div>
                </>
            ) : refund.status === 'paid' ? (
                // Paid → the transfer record is the read-only outcome and leads.
                <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
                    <TransferRecordCard refund={refund} />
                    {summary}
                </div>
            ) : (
                // Pending / Failed → the action is the job and takes the wide lead
                // column; failure reason (when present) sits above the action.
                <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
                    <div className='space-y-6'>
                        {refund.status === 'failed' && refund.failureReason && (
                            <FailureCard reason={refund.failureReason} />
                        )}
                        <ActionPanel refund={refund} isBusy={isBusy} onApprove={onApproveClick} onRetry={onRetry} />
                    </div>
                    {summary}
                </div>
            )}

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
    /**
     * Live push (#245): while staff PASSIVELY view (no approve/retry click), an
     * externally-confirmed payout flips the status on a timer that is independent
     * of the action handlers — standing in for the real-time/webhook-driven update
     * the Admin Refund Detail subscribes to in production. The detail re-renders
     * and announces via the aria-live region, with NO manual page refresh.
     */
    livePushTo?: 'paid' | 'failed';
    /** Delay before the live push arrives, ms. */
    livePushDelayMs?: number;
}

function RefundDetailHarness({
    initial,
    outcome = 'paid',
    stickyProcessing = false,
    livePushTo,
    livePushDelayMs = 1600,
}: HarnessProps) {
    const [refund, setRefund] = React.useState<Refund>(initial);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isBusy, setIsBusy] = React.useState(false);
    const [liveAnnouncement, setLiveAnnouncement] = React.useState<string | null>(null);

    // Passive live push — fires once on mount, on its OWN timer, with no staff
    // interaction. Mirrors a subscription/poll delivering an external status
    // change while the detail is simply open (#245 live-update ACs).
    React.useEffect(() => {
        if (!livePushTo) return;
        const timer = window.setTimeout(() => {
            setRefund(current => {
                // Ignore a stale push if staff already moved the refund elsewhere.
                if (current.status !== 'pending' && current.status !== 'processing') return current;
                return livePushTo === 'paid'
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
                      };
            });
            setLiveAnnouncement(
                livePushTo === 'paid'
                    ? 'Refund status updated to Paid. The transfer reference and paid date are now shown.'
                    : 'Refund status updated to Failed. Review the failure reason and retry the transfer.'
            );
        }, livePushDelayMs);
        return () => window.clearTimeout(timer);
    }, []);

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
                live={Boolean(livePushTo)}
                liveAnnouncement={liveAnnouncement}
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

/** Loading — the detail skeleton while the refund loads. Mirrors the post-load
 *  layout: a hero strip placeholder over a two-column body. */
function LoadingDetail() {
    return (
        <PageShell>
            <div className='space-y-6'>
                <Card>
                    <CardContent className='flex items-center justify-between py-6'>
                        <div className='space-y-2'>
                            <Skeleton className='h-6 w-28 rounded-full' />
                            <Skeleton className='h-4 w-72' />
                        </div>
                        <Skeleton className='h-9 w-32' />
                    </CardContent>
                </Card>
                <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
                    <Card>
                        <CardHeader>
                            <Skeleton className='h-5 w-40' />
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            <Skeleton className='h-4 w-full' />
                            <Skeleton className='h-10 w-full' />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className='h-5 w-36' />
                        </CardHeader>
                        <CardContent className='space-y-3'>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className='flex items-center justify-between'>
                                    <Skeleton className='h-4 w-20' />
                                    <Skeleton className='h-4 w-28' />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageShell>
    );
}

/** Error — the refund failed to load; reuses the shared ErrorState with a
 *  Retry action, matching the ledger surface's error pattern. */
function ErrorDetail() {
    return (
        <PageShell>
            <Card>
                <CardContent>
                    <ErrorState
                        className='py-16'
                        iconSize='sm'
                        title='Couldn’t load this refund'
                        description='Something went wrong fetching the refund detail. Please try again.'
                        action={
                            <Button variant='outline'>
                                <RotateCcw className='h-4 w-4' />
                                Retry
                            </Button>
                        }
                    />
                </CardContent>
            </Card>
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

/** Processing — the auto transfer is in flight; read-only, no actions, with the
 *  VietQR payment code shown for staff to scan (244 / 247 / 255). */
export const Processing: Story = {
    name: 'Processing — Transfer In Flight + VietQR (255)',
    parameters: {
        docs: {
            description: {
                story: 'While Processing, staff see a SePay-hosted VietQR image encoding the customer’s payout account, the full order total, and the refund id GUID as the FIRST token of the transfer content (so the SePay outbound webhook auto-matches via Split("-")[0] + Guid.TryParseExact("N"), per #250). The QR is shown ONLY for Processing — Pending, Paid, and Failed show no QR.',
            },
        },
    },
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

/** Retry success — from Failed, retry re-initiates → Processing → Paid (247).
 *  The VietQR code is hidden while Failed and reappears the moment retry flips
 *  the refund back to Processing (255). */
export const RetrySuccess: Story = {
    name: 'Retry Flow — Failed → Processing (QR Returns) → Paid (247 / 255)',
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

/** Live update → Paid (#245) — staff are PASSIVELY viewing a Pending refund (no
 *  approve/retry click). An externally-confirmed payout arrives on an independent
 *  timer and flips the status straight to Paid — the transfer reference and paid
 *  date appear and the aria-live region announces it, all WITHOUT a page refresh
 *  and without any staff action. A subtle "Live" indicator marks the connection. */
export const LiveUpdateToPaid: Story = {
    name: 'Live Update — Pending → Paid Without Refresh (245)',
    parameters: {
        docs: {
            description: {
                story: 'Staff open a refund and do nothing. An externally-confirmed payout (real-time/webhook-driven in production; modelled here as a status push on an independent timer) flips the status Pending → Paid with no manual refresh and no approve/retry click. The detail re-renders to the Paid transfer record and the polite aria-live region announces the change. Reload Storybook or re-select the story to replay the push.',
            },
        },
    },
    render: () => <RefundDetailHarness initial={REFUND_PENDING} livePushTo='paid' />,
};

/** Live update → Failed (#245) — the parallel transition: staff passively view a
 *  Processing refund and an externally-pushed payout FAILURE arrives on its own
 *  timer, flipping the status to Failed (with the failure reason + Retry) without
 *  any refresh or staff action. Announced via the aria-live region. */
export const LiveUpdateToFailed: Story = {
    name: 'Live Update — Processing → Failed Without Refresh (245)',
    parameters: {
        docs: {
            description: {
                story: 'The parallel live transition: while staff passively view a Processing refund, an externally-pushed payout failure arrives (independent of approve/retry) and the status flips to Failed without a page refresh — the failure reason and Retry action appear, and the aria-live region announces it. Reload or re-select the story to replay the push.',
            },
        },
    },
    render: () => <RefundDetailHarness initial={REFUND_PROCESSING} livePushTo='failed' />,
};

/** Loading — skeleton placeholder while the refund detail is fetched. */
export const Loading: Story = {
    name: 'Loading — Detail Skeleton',
    render: () => <LoadingDetail />,
};

/** Error — the refund detail failed to load; shared ErrorState + Retry. */
export const ErrorStateStory: Story = {
    name: 'Error — Failed To Load Refund',
    render: () => <ErrorDetail />,
};
