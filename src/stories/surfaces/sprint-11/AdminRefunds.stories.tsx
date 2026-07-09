import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    Clock,
    Copy,
    Eye,
    QrCode,
    RotateCcw,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';

import { cn } from '@/app/utils/tailwind.utils';
import { Badge, type BadgeProps } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/dialog';
import ErrorState from '@/components/error-state';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';
import Spinner from '@/components/spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/tabs';

// ---------------------------------------------------------------------------
// Admin refunds — list (grouped by status via filter chips) + refund detail
// (summary / VietQR / transfer records + confirm dialog), conformed to
// DESIGN_THEME.md. Behaviour is unchanged from src/pages/admin/refunds/ and
// src/pages/admin/refund-detail/ — same statuses, tabs, cards and confirm flow.
//
// The admin top nav is owned by the AdminAppShell (which carries the shared
// NavBar), so it is a labelled sticky placeholder here rather
// than a re-implemented bar — consistent with sibling AdminOrderDetail.
//
// Design-system conformance (DESIGN_THEME.md):
//   • Two-tone: RED (`primary`) is reserved for REFUND AMOUNTS / PRICES only —
//     it is the one loudest thing per screen. Every structural action (filter
//     tabs, Approve / Retry, dialog confirm) is BLACK (`selected` token).
//     The refund-status filter is a real selection — Tabs with aria-current,
//     never a Button in a selected style. Status is a WORD label + one
//     consistent colour per state — never red, never colour alone.
//   • Named components: Filter Chips group the list by status; Summary / VietQR
//     / Transfer render as white cards; the refund summary follows the Summary
//     Panel pattern (rows → dashed divider → bold total); order refs render as
//     mono Tag Pills.
//   • Spacing / shape (§4): card radius 20–24px, hairline borders, a single
//     soft shadow on FLOATING surfaces only (list panel, dialogs). The layout is
//     FULL-BLEED / edge-to-edge on the app canvas (bg-muted) — no dark ambient
//     frame, no enclosing floating shell; white cards float directly on the
//     canvas, one gentle step of elevation.
//   • States (§8): hover darkens ~8%; the destructive/irreversible confirm is
//     set APART in an explicit dialog, never adjacent to the trigger.
//
// Mock-only fixtures. No api / model / store / router / i18n imports.
// ---------------------------------------------------------------------------

// One soft shadow, floating surfaces only (§4 elevation).
const SOFT_SHADOW = 'shadow-[0_4px_20px_rgba(0,0,0,0.05)]';

// ---------------------------------------------------------------------------
// Domain shapes (mock only — mirrors the refund surfaces' data shape)
// ---------------------------------------------------------------------------

type RefundStatus = 'pending' | 'processing' | 'paid' | 'failed';

interface RefundRow {
    id: string;
    orderSlugId: string | null;
    amount: number;
    status: RefundStatus;
    transferReference: string | null;
    createdAt: string;
    paidAt: string | null;
}

interface RefundDetail extends RefundRow {
    bankCode: string | null;
    accountNumber: string | null;
    accountHolderName: string | null;
    failureReason: string | null;
}

// ---------------------------------------------------------------------------
// Mock fixtures — VND amounts + `ORD-YYYYMMDD-NNNN` refs mirror the app.
// ---------------------------------------------------------------------------

const formatVnd = (amount: number) => `${amount.toLocaleString('en-US')} ₫`;

const REFUNDS: RefundRow[] = [
    {
        id: 'rf-11-0007',
        orderSlugId: 'ORD-20260703-1088',
        amount: 285000,
        status: 'pending',
        transferReference: null,
        createdAt: '3 Jul 2026, 09:12',
        paidAt: null,
    },
    {
        id: 'rf-11-0006',
        orderSlugId: 'ORD-20260703-1081',
        amount: 96000,
        status: 'pending',
        transferReference: null,
        createdAt: '3 Jul 2026, 08:47',
        paidAt: null,
    },
    {
        id: 'rf-11-0005',
        orderSlugId: 'ORD-20260702-1074',
        amount: 612000,
        status: 'processing',
        transferReference: null,
        createdAt: '2 Jul 2026, 19:33',
        paidAt: null,
    },
    {
        id: 'rf-11-0004',
        orderSlugId: 'ORD-20260702-1069',
        amount: 148000,
        status: 'paid',
        transferReference: 'FT26183994201',
        createdAt: '2 Jul 2026, 14:05',
        paidAt: '2 Jul 2026, 14:21',
    },
    {
        id: 'rf-11-0003',
        orderSlugId: 'ORD-20260701-1052',
        amount: 330000,
        status: 'paid',
        transferReference: 'FT26182881034',
        createdAt: '1 Jul 2026, 11:40',
        paidAt: '1 Jul 2026, 11:58',
    },
    {
        id: 'rf-11-0002',
        orderSlugId: 'ORD-20260701-1041',
        amount: 74000,
        status: 'failed',
        transferReference: null,
        createdAt: '1 Jul 2026, 10:02',
        paidAt: null,
    },
];

const PENDING_DETAIL: RefundDetail = {
    ...REFUNDS[0],
    bankCode: null,
    accountNumber: null,
    accountHolderName: null,
    failureReason: null,
};

const PROCESSING_DETAIL: RefundDetail = {
    ...REFUNDS[2],
    bankCode: 'Vietcombank',
    accountNumber: '0071000654321',
    accountHolderName: 'Nguyen Van An',
    failureReason: null,
};

const PAID_DETAIL: RefundDetail = {
    ...REFUNDS[3],
    bankCode: 'Techcombank',
    accountNumber: '19035678240117',
    accountHolderName: 'Tran Thi Mai',
    failureReason: null,
};

const FAILED_DETAIL: RefundDetail = {
    ...REFUNDS[5],
    bankCode: 'ACB',
    accountNumber: '2451080339',
    accountHolderName: 'Le Hoang Long',
    failureReason:
        'Beneficiary account number could not be verified by the receiving bank. Confirm the account and retry.',
};

// ---------------------------------------------------------------------------
// Price — the ONLY red on the screen. Every refund amount routes through here.
// ---------------------------------------------------------------------------

function Price({ amount, className }: { amount: number; className?: string }) {
    return <span className={cn('font-bold text-primary tabular-nums', className)}>{formatVnd(amount)}</span>;
}

// Mono Tag Pill (§5 Promo/Tag Pill) — order refs, references. Never red.
function TagPill({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-foreground',
                className
            )}
        >
            {children}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Status meta — one WORD + one consistent colour per state (word + colour,
// never colour alone, NEVER red — red is reserved for amounts). Mirrors the
// features/order RefundStatusBadge mapping.
// ---------------------------------------------------------------------------

const STATUS_META: Record<
    RefundStatus,
    { label: string; variant: BadgeProps['variant']; icon: LucideIcon | null; className?: string }
> = {
    pending: { label: 'Pending', variant: 'warning', icon: Clock },
    processing: { label: 'Processing', variant: 'secondary', icon: null },
    paid: { label: 'Paid', variant: 'success', icon: CheckCircle2 },
    // Failed reads as a neutral, terminal INK chip — attention without red.
    failed: {
        label: 'Failed',
        variant: 'outline',
        icon: AlertTriangle,
        className: 'border-foreground/25 bg-foreground/[0.06] text-foreground',
    },
};

function StatusBadge({ status }: { status: RefundStatus }) {
    const meta = STATUS_META[status];
    const Icon = meta.icon;
    return (
        <Badge variant={meta.variant} className={cn('gap-1', meta.className)}>
            {status === 'processing' ? <Spinner size='sm' /> : Icon ? <Icon className='h-3 w-3' /> : null}
            {meta.label}
        </Badge>
    );
}

// ---------------------------------------------------------------------------
// Nav placeholder — the admin top nav is owned by the AdminAppShell (which
// carries the shared NavBar); this surface does not re-implement
// it. It renders as a labelled, muted, dashed sticky bar pinned at the top of
// the shell — consistent with sibling AdminOrderDetail.
// ---------------------------------------------------------------------------

function NavPlaceholder() {
    return (
        <div className='sticky top-0 z-20 shrink-0 px-3 pt-3 sm:px-5 sm:pt-5'>
            <div className='bg-card/60 flex h-14 items-center justify-center rounded-full border border-dashed border-border'>
                <span className='text-muted-foreground/60 font-mono text-[10px] uppercase tracking-widest'>
                    admin top nav placeholder
                </span>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Shell — FULL-BLEED. No dark ambient frame, no enclosing floating light shell.
// A single edge-to-edge column on the app's neutral canvas (bg-muted): the nav
// placeholder is pinned at the top and only the refunds content scrolls beneath
// it (single scroll region, no double scrollbars). White floating surfaces
// (list panel, cards, dialogs) flow directly on the canvas, never inside a
// rounded shell.
// ---------------------------------------------------------------------------

function AdminShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-muted flex h-screen w-full flex-col overflow-hidden'>
            <NavPlaceholder />

            {/* Only the refunds content scrolls */}
            <div className='min-h-0 flex-1 overflow-y-auto'>{children}</div>
        </div>
    );
}

// Page header — neutral round glyph (no decorative red), title + subtitle.
function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className='mb-6 flex items-center gap-3'>
            <span className='bg-foreground/5 text-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-full'>
                <RotateCcw className='h-5 w-5' aria-hidden />
            </span>
            <div>
                <h1 className='text-foreground text-2xl font-bold tracking-tight'>{title}</h1>
                <p className='text-muted-foreground mt-0.5 text-sm'>{subtitle}</p>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// LIST — refunds grouped by status via FILTER CHIPS (§5). Table for admin
// scanning volume; amount is the only red; status is word + consistent colour.
// ---------------------------------------------------------------------------

const STATUS_TABS: { key: 'all' | RefundStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'paid', label: 'Paid' },
    { key: 'failed', label: 'Failed' },
];

// Filter chip — pill, white outline idle, solid BLACK when selected (§5).
const CHIP_CLASS = cn(
    'h-9 flex-none rounded-full border border-border bg-card px-4 text-sm font-medium text-muted-foreground shadow-none transition-colors',
    'hover:border-foreground/30 hover:text-foreground',
    'data-[state=active]:border-transparent data-[state=active]:bg-selected data-[state=active]:text-selected-foreground data-[state=active]:shadow-none'
);

function RefundsList({ rows = REFUNDS, tab: initialTab = 'all' }: { rows?: RefundRow[]; tab?: 'all' | RefundStatus }) {
    const [tab, setTab] = React.useState<'all' | RefundStatus>(initialTab);
    const visible = tab === 'all' ? rows : rows.filter(r => r.status === tab);

    const countFor = (key: 'all' | RefundStatus) =>
        key === 'all' ? rows.length : rows.filter(r => r.status === key).length;

    return (
        <div className='px-3 py-6 sm:px-5'>
            <PageHeader title='Refunds' subtitle='Triage and process customer refund requests.' />

            <Tabs value={tab} onValueChange={value => setTab(value as 'all' | RefundStatus)} className='mb-5'>
                <TabsList className='h-auto flex-wrap justify-start gap-2 bg-transparent p-0'>
                    {STATUS_TABS.map(item => (
                        <TabsTrigger key={item.key} value={item.key} className={CHIP_CLASS}>
                            {item.label}
                            <span className='text-current/60 ml-1 text-xs tabular-nums'>{countFor(item.key)}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Floating white list panel — hairline + one soft shadow */}
            <div className={cn('bg-card overflow-hidden rounded-3xl border border-border', SOFT_SHADOW)}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='min-w-[130px]'>Order</TableHead>
                            <TableHead className='min-w-[120px]'>Amount</TableHead>
                            <TableHead className='min-w-[130px]'>Status</TableHead>
                            <TableHead className='min-w-[180px]'>Transfer reference</TableHead>
                            <TableHead className='min-w-[150px]'>Created</TableHead>
                            <TableHead className='min-w-[150px]'>Paid</TableHead>
                            <TableHead className='min-w-[70px] text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {visible.length > 0 ? (
                            visible.map(refund => (
                                <TableRow key={refund.id}>
                                    <TableCell className='font-medium'>
                                        {refund.orderSlugId ? (
                                            <TagPill>#{refund.orderSlugId}</TagPill>
                                        ) : (
                                            <span className='text-muted-foreground'>—</span>
                                        )}
                                    </TableCell>
                                    {/* Amount — the one red (price emphasis, §2) */}
                                    <TableCell>
                                        <Price amount={refund.amount} />
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={refund.status} />
                                    </TableCell>
                                    <TableCell>
                                        {refund.transferReference ? (
                                            <code className='text-foreground font-mono text-xs'>
                                                {refund.transferReference}
                                            </code>
                                        ) : (
                                            <span className='text-muted-foreground'>—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className='text-muted-foreground text-sm'>{refund.createdAt}</TableCell>
                                    <TableCell className='text-muted-foreground text-sm'>
                                        {refund.paidAt ?? <span className='text-muted-foreground'>—</span>}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Button
                                            variant='ghost'
                                            size='icon-sm'
                                            className='h-8 w-8 rounded-full'
                                            aria-label={`View refund ${refund.id}`}
                                        >
                                            <Eye className='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className='text-muted-foreground py-16 text-center'>
                                    No refunds in this group yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function RefundsListSkeleton() {
    return (
        <div className='px-3 py-6 sm:px-5'>
            <div className='mb-6 flex items-center gap-3'>
                <Skeleton className='h-11 w-11 rounded-full' />
                <div className='space-y-2'>
                    <Skeleton className='h-6 w-40' />
                    <Skeleton className='h-4 w-64' />
                </div>
            </div>
            <div className='mb-5 flex gap-2'>
                {[1, 2, 3, 4, 5].map(chip => (
                    <Skeleton key={chip} className='h-9 w-20 rounded-full' />
                ))}
            </div>
            <div className={cn('bg-card space-y-3 rounded-3xl border border-border p-4', SOFT_SHADOW)}>
                {[1, 2, 3, 4, 5].map(row => (
                    <div key={row} className='flex items-center gap-4'>
                        <Skeleton className='h-6 w-28 rounded-full' />
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-6 w-24 rounded-full' />
                        <Skeleton className='h-4 flex-1' />
                        <Skeleton className='h-4 w-28' />
                        <Skeleton className='h-8 w-8 rounded-full' />
                    </div>
                ))}
            </div>
        </div>
    );
}

function RefundsListError() {
    return (
        <div className='px-3 py-6 sm:px-5'>
            <PageHeader title='Refunds' subtitle='Triage and process customer refund requests.' />
            <div className={cn('bg-card rounded-3xl border border-border', SOFT_SHADOW)}>
                <ErrorState
                    className='py-16'
                    iconSize='sm'
                    title="We couldn't load refunds"
                    description='Check your connection and try again.'
                    action={<Button variant='outline'>Try again</Button>}
                />
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// DETAIL cards — white cards, radius 24, hairline border, no drop shadow.
// ---------------------------------------------------------------------------

// Shared white-card shape for the detail surface (§4).
const CARD_CLASS = 'rounded-3xl border-border shadow-none';

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>{label}</span>
            <span className='text-foreground font-medium'>{children}</span>
        </div>
    );
}

// Summary Panel pattern (§5): rows → dashed divider → bold total row.
function SummaryCard({ refund }: { refund: RefundDetail }) {
    return (
        <Card className={CARD_CLASS}>
            <CardHeader>
                <CardTitle>Refund summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>Status</span>
                    <StatusBadge status={refund.status} />
                </div>
                <Separator />
                <SummaryRow label='Refund ID'>
                    <code className='font-mono text-xs'>{refund.id}</code>
                </SummaryRow>
                <SummaryRow label='Order'>
                    {refund.orderSlugId ? (
                        <TagPill>#{refund.orderSlugId}</TagPill>
                    ) : (
                        <span className='text-muted-foreground'>—</span>
                    )}
                </SummaryRow>
                <SummaryRow label='Requested'>{refund.createdAt}</SummaryRow>

                {/* Dashed divider → bold total row (Summary Panel pattern) */}
                <div className='border-border border-t border-dashed pt-3' />
                <div className='flex items-center justify-between'>
                    <span className='text-foreground text-base font-semibold'>Refund total</span>
                    <Price amount={refund.amount} className='text-lg' />
                </div>
            </CardContent>
        </Card>
    );
}

// A deterministic faux-QR (no network) — stands in for the live VietQR image.
function FauxQr() {
    const cells = React.useMemo(() => Array.from({ length: 144 }, (_, i) => (i * 37 + 11) % 5 < 2), []);
    return (
        <div className='border-border grid h-64 w-64 max-w-full grid-cols-12 gap-0.5 rounded-2xl border bg-white p-3'>
            {cells.map((filled, i) => (
                <div key={i} className={filled ? 'rounded-[1px] bg-neutral-900' : 'bg-transparent'} />
            ))}
        </div>
    );
}

function QrFieldRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className='flex items-start justify-between gap-3 text-sm'>
            <span className='text-muted-foreground shrink-0'>{label}</span>
            <span className='text-foreground text-right font-medium'>{children}</span>
        </div>
    );
}

function VietQrCard({ refund }: { refund: RefundDetail }) {
    const contentToken = `NOTISM${refund.id.replace(/-/g, '').toUpperCase()}`;
    return (
        <Card className={CARD_CLASS}>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <QrCode className='text-foreground h-4 w-4' />
                    Scan to pay refund
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='grid gap-6 md:grid-cols-[auto_1fr] md:items-start'>
                    <div className='flex flex-col items-center gap-3'>
                        <FauxQr />
                        <span className='text-muted-foreground flex items-center gap-1.5 text-xs font-medium'>
                            <Spinner size='sm' className='shrink-0' />
                            Waiting for transfer confirmation
                        </span>
                    </div>
                    <div className='space-y-4'>
                        <p className='text-muted-foreground text-sm'>
                            Scan with your banking app to send the refund to the customer&apos;s account.
                        </p>
                        <div className='bg-muted/40 border-border space-y-2 rounded-2xl border p-4'>
                            <QrFieldRow label='Bank'>{refund.bankCode}</QrFieldRow>
                            <QrFieldRow label='Account'>
                                <code className='font-mono text-xs'>{refund.accountNumber}</code>
                            </QrFieldRow>
                            <QrFieldRow label='Account holder'>{refund.accountHolderName}</QrFieldRow>
                            <Separator />
                            <QrFieldRow label='Amount'>
                                <Price amount={refund.amount} />
                            </QrFieldRow>
                            <QrFieldRow label='Transfer note'>
                                <code className='text-foreground break-all text-right font-mono text-xs'>
                                    {contentToken}
                                </code>
                            </QrFieldRow>
                        </div>
                        <p className='text-muted-foreground text-xs'>
                            Keep the transfer note <code className='break-all font-mono'>{contentToken}</code> so the
                            payment reconciles automatically.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function TransferRecordCard({ refund }: { refund: RefundDetail }) {
    return (
        <Card className={CARD_CLASS}>
            <CardHeader>
                <CardTitle>Transfer record</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='flex items-center justify-between text-sm'>
                    <span className='text-muted-foreground'>Paid on</span>
                    <span className='text-foreground font-medium'>{refund.paidAt}</span>
                </div>
                <Separator />
                <div>
                    <div className='text-muted-foreground mb-1 text-xs tracking-wide uppercase'>Transfer reference</div>
                    <div className='flex items-center gap-2'>
                        <code className='bg-muted flex-1 truncate rounded-lg px-2 py-1 font-mono text-xs'>
                            {refund.transferReference}
                        </code>
                        <Button variant='ghost' size='icon-sm' aria-label='Copy transfer reference'>
                            <Copy className='h-3.5 w-3.5' />
                        </Button>
                    </div>
                </div>
                <p className='text-muted-foreground text-xs'>
                    This refund has been paid out. The reference links to the bank transfer.
                </p>
            </CardContent>
        </Card>
    );
}

// Failure card — amber CAUTION accent (needs action / retry), never red;
// red stays reserved for the amount.
function FailureCard({ refund }: { refund: RefundDetail }) {
    return (
        <Card className={cn(CARD_CLASS, 'border-warning/30')}>
            <CardHeader>
                <CardTitle className='text-warning flex items-center gap-2'>
                    <AlertTriangle className='h-4 w-4' />
                    Refund failed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='bg-warning/10 border-warning/20 text-foreground rounded-2xl border p-3 text-sm'>
                    {refund.failureReason}
                </div>
            </CardContent>
        </Card>
    );
}

// Action panel — the structural (BLACK) primary. The irreversible confirm is
// set apart in an explicit dialog, never adjacent to this trigger.
function ActionPanel({
    refund,
    onApprove,
    onRetry,
}: {
    refund: RefundDetail;
    onApprove?: () => void;
    onRetry?: () => void;
}) {
    if (refund.status === 'pending') {
        return (
            <Card className={CARD_CLASS}>
                <CardHeader>
                    <CardTitle>Approve this refund</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <p className='text-muted-foreground text-sm'>
                        Approving generates a VietQR so you can pay the customer.
                    </p>
                    <Button size='lg' className='w-full' onClick={onApprove}>
                        Approve refund
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (refund.status === 'processing') {
        return (
            <Card className={CARD_CLASS}>
                <CardContent className='flex items-center gap-3 py-6' role='status' aria-live='polite'>
                    <Spinner size='md' className='flex-shrink-0' />
                    <div>
                        <div className='text-foreground font-medium'>Waiting for payment</div>
                        <p className='text-muted-foreground text-sm'>
                            Scan the QR and confirm the transfer to complete this refund.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (refund.status === 'failed') {
        return (
            <Card className={CARD_CLASS}>
                <CardHeader>
                    <CardTitle>Retry this refund</CardTitle>
                </CardHeader>
                <CardContent className='space-y-3'>
                    <p className='text-muted-foreground text-sm'>
                        Fix the account details with the customer, then retry the payout.
                    </p>
                    <Button size='lg' className='w-full' onClick={onRetry}>
                        <RotateCcw className='h-4 w-4' />
                        Retry refund
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={CARD_CLASS}>
            <CardContent className='flex items-center gap-3 py-6'>
                <CheckCircle2 className='text-success h-5 w-5 shrink-0' />
                <div>
                    <div className='text-foreground font-medium'>Refund complete</div>
                    <p className='text-muted-foreground text-sm'>
                        The customer has been paid. No further action needed.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// DETAIL surface — mirrors refund-detail.tsx composition. `openConfirm` drives
// the explicit approve confirm dialog for the ConfirmDialog story.
// ---------------------------------------------------------------------------

function RefundDetailSurface({ refund, openConfirm = false }: { refund: RefundDetail; openConfirm?: boolean }) {
    const [confirmOpen, setConfirmOpen] = React.useState(openConfirm);
    const [retryOpen, setRetryOpen] = React.useState(false);

    return (
        <div className='px-3 py-6 sm:px-5'>
            <Button variant='ghost' className='mb-6'>
                <ArrowLeft className='h-4 w-4' />
                Back to refunds
            </Button>

            <div className='mb-6'>
                <h1 className='text-foreground text-2xl font-bold tracking-tight'>Refund detail</h1>
                <p className='text-muted-foreground mt-0.5 text-sm'>
                    Review the request and process the payout to the customer.
                </p>
            </div>

            <div className='grid gap-6 lg:grid-cols-[1.4fr_1fr]'>
                <div className='space-y-6'>
                    {refund.status === 'processing' && <VietQrCard refund={refund} />}
                    <SummaryCard refund={refund} />
                    {refund.status === 'paid' && refund.transferReference && <TransferRecordCard refund={refund} />}
                    {refund.status === 'failed' && refund.failureReason && <FailureCard refund={refund} />}
                </div>

                <div className='space-y-6'>
                    <ActionPanel
                        refund={refund}
                        onApprove={() => setConfirmOpen(true)}
                        onRetry={() => setRetryOpen(true)}
                    />
                </div>
            </div>

            {/* Explicit approve confirm — set APART in a dialog: a caution header,
                the red amount inline, Cancel held away from the commit action */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <AlertTriangle className='text-warning h-4 w-4' />
                            Approve this refund?
                        </DialogTitle>
                        <DialogDescription>
                            This generates a VietQR to pay <Price amount={refund.amount} /> for order{' '}
                            {refund.orderSlugId ?? '—'}. You can&apos;t undo an approval.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='gap-2 sm:justify-between'>
                        <Button variant='outline' onClick={() => setConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setConfirmOpen(false)}>Approve refund</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={retryOpen} onOpenChange={setRetryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <AlertTriangle className='text-warning h-4 w-4' />
                            Retry this refund?
                        </DialogTitle>
                        <DialogDescription>
                            This retries the payout of <Price amount={refund.amount} /> for order{' '}
                            {refund.orderSlugId ?? '—'}.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className='gap-2 sm:justify-between'>
                        <Button variant='outline' onClick={() => setRetryOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => setRetryOpen(false)}>Retry refund</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Admin Refunds',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * List — Default. Refund requests grouped by status via filter chips; each row
 * shows its status as a WORD label with a consistent colour, and every amount is
 * the one red. Switch chips to filter the group.
 */
export const List: Story = {
    name: 'List — Grouped By Status Chips',
    render: () => (
        <AdminShell>
            <RefundsList />
        </AdminShell>
    ),
};

/** List — Empty group (e.g. no failed refunds). One quiet, dead-end-free message. */
export const ListEmpty: Story = {
    name: 'List — Empty Group',
    render: () => (
        <AdminShell>
            <RefundsList rows={REFUNDS.filter(r => r.status !== 'failed')} tab='failed' />
        </AdminShell>
    ),
};

/** List — Loading. Skeleton rows while the refunds load. */
export const ListLoading: Story = {
    name: 'List — Loading',
    render: () => (
        <AdminShell>
            <RefundsListSkeleton />
        </AdminShell>
    ),
};

/** List — Error. Load failed, with a single Try again action. */
export const ListError: Story = {
    name: 'List — Error',
    render: () => (
        <AdminShell>
            <RefundsListError />
        </AdminShell>
    ),
};

/**
 * Detail — Pending. Summary Panel + the BLACK structural primary (Approve refund).
 * The confirm is NOT here; it opens in an explicit dialog, set apart from this action.
 */
export const Detail: Story = {
    name: 'Detail — Pending (Approve)',
    render: () => (
        <AdminShell>
            <RefundDetailSurface refund={PENDING_DETAIL} />
        </AdminShell>
    ),
};

/**
 * Detail — Confirm dialog. The explicit approve confirmation, set apart from the
 * trigger: Cancel (outline) held away from the black Approve refund commit.
 */
export const DetailConfirm: Story = {
    name: 'Detail — Confirm Dialog',
    render: () => (
        <AdminShell>
            <RefundDetailSurface refund={PENDING_DETAIL} openConfirm />
        </AdminShell>
    ),
};

/**
 * Detail — Processing with VietQR. The on-theme QR white card + payout details
 * while the transfer is awaited (partial state).
 */
export const DetailQr: Story = {
    name: 'Detail — Processing (VietQR)',
    render: () => (
        <AdminShell>
            <RefundDetailSurface refund={PROCESSING_DETAIL} />
        </AdminShell>
    ),
};

/** Detail — Paid. Transfer record card with the reference; refund complete (success). */
export const DetailPaid: Story = {
    name: 'Detail — Paid (Transfer Record)',
    render: () => (
        <AdminShell>
            <RefundDetailSurface refund={PAID_DETAIL} />
        </AdminShell>
    ),
};

/** Detail — Failed. Failure card + the Retry refund action. */
export const DetailFailed: Story = {
    name: 'Detail — Failed (Retry)',
    render: () => (
        <AdminShell>
            <RefundDetailSurface refund={FAILED_DETAIL} />
        </AdminShell>
    ),
};
