import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertTriangle, CheckCircle2, Clock, Eye, Moon, RotateCcw, type LucideIcon } from 'lucide-react';
import React from 'react';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import ErrorState from '@/uis/error-state';
import { Skeleton } from '@/uis/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/uis/table';
import { Tabs, TabsList, TabsTrigger } from '@/uis/tabs';

// ---------------------------------------------------------------------------
// Implementation reference — story 245 (Refunds ledger), admin reconcile view.
//
// NEW admin page, route under admin (e.g. admin/refunds), composed inside the
// existing AdminLayout (sticky admin top-nav, rendered here as the same
// AdminTopNav as the dashboard / refund-detail surfaces).
//
// The ledger lists ALL refunds with: order reference, amount, status, transfer
// reference, and created / paid dates (245 AC 1). A status filter (Pending /
// Paid / Failed, plus All) narrows the list (245 AC 2). Each row opens the
// refund detail to approve / retry / view the transfer reference
// (245 AC 3 → AdminRefundDetail.stories.tsx).
//
// The table mirrors the existing admin-orders-table pattern (src/pages/admin/
// orders/components/admin-orders-table.tsx): Table primitives + a per-row Eye
// "view" action. The status filter is rendered as Tabs (a small fixed set of
// buckets), echoing the dashboard's view-mode toggles.
//
// Mock-only fixtures; local filter state only, no api/model imports.
// ---------------------------------------------------------------------------

/** Mirrors src/app/utils/currency.utils.ts — VND formatting used across the app. */
function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Refund domain (mock shapes — matches the ACs' data shape, not real models)
// ---------------------------------------------------------------------------

type RefundStatus = 'pending' | 'paid' | 'failed';

interface RefundRow {
    slugId: string;
    orderSlugId: string;
    amount: number;
    status: RefundStatus;
    /** present once Paid (245). */
    transferReference: string | null;
    createdDate: string;
    /** present once Paid (245). */
    paidDate: string | null;
    /** present when Failed — surfaced under the Failed filter (247 AC 3). */
    failureReason: string | null;
}

const STATUS_META: Record<
    RefundStatus,
    { label: string; icon: LucideIcon; variant: 'warning' | 'success' | 'destructive' }
> = {
    pending: { label: 'Pending', icon: Clock, variant: 'warning' },
    paid: { label: 'Paid', icon: CheckCircle2, variant: 'success' },
    failed: { label: 'Failed', icon: AlertTriangle, variant: 'destructive' },
};

function RefundStatusBadge({ status }: { status: RefundStatus }) {
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

const REFUNDS: RefundRow[] = [
    {
        slugId: 'RF-9F02',
        orderSlugId: 'A1B2C3',
        amount: 485_000,
        status: 'pending',
        transferReference: null,
        createdDate: '13 Jun 2026, 10:40',
        paidDate: null,
        failureReason: null,
    },
    {
        slugId: 'RF-7C21',
        orderSlugId: 'D4E5F6',
        amount: 1_250_000,
        status: 'paid',
        transferReference: 'VCB-TRF-20260613-0099431',
        createdDate: '12 Jun 2026, 16:02',
        paidDate: '13 Jun 2026, 09:18',
        failureReason: null,
    },
    {
        slugId: 'RF-5A88',
        orderSlugId: 'G7H8I9',
        amount: 320_000,
        status: 'failed',
        transferReference: null,
        createdDate: '12 Jun 2026, 11:51',
        paidDate: null,
        failureReason: 'Beneficiary account number rejected by the receiving bank (code 09).',
    },
    {
        slugId: 'RF-3B14',
        orderSlugId: 'J1K2L3',
        amount: 95_000,
        status: 'paid',
        transferReference: 'VCB-TRF-20260611-0088210',
        createdDate: '11 Jun 2026, 19:30',
        paidDate: '12 Jun 2026, 08:05',
        failureReason: null,
    },
    {
        slugId: 'RF-1D77',
        orderSlugId: 'M4N5O6',
        amount: 660_000,
        status: 'pending',
        transferReference: null,
        createdDate: '11 Jun 2026, 14:12',
        paidDate: null,
        failureReason: null,
    },
    {
        slugId: 'RF-0E45',
        orderSlugId: 'P7Q8R9',
        amount: 210_000,
        status: 'failed',
        transferReference: null,
        createdDate: '10 Jun 2026, 09:44',
        paidDate: null,
        failureReason: 'Transfer timed out at the bank gateway. Retry available.',
    },
];

// ---------------------------------------------------------------------------
// Status filter (245 AC 2 / 247 AC 3) — All + the three statuses.
// ---------------------------------------------------------------------------

type StatusFilter = 'all' | RefundStatus;

const FILTERS: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'paid', label: 'Paid' },
    { key: 'failed', label: 'Failed' },
];

function applyFilter(rows: RefundRow[], filter: StatusFilter): RefundRow[] {
    if (filter === 'all') return rows;
    return rows.filter(r => r.status === filter);
}

// ---------------------------------------------------------------------------
// Admin top-nav — matches the dashboard / refund-detail surfaces.
// ---------------------------------------------------------------------------

interface NavItem {
    label: string;
    active: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', active: false },
    { label: 'Orders', active: false },
    { label: 'Refunds', active: true },
    { label: 'Foods', active: false },
    { label: 'Categories', active: false },
    { label: 'Users', active: false },
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
// Ledger table (245 AC 1) — order ref, amount, status, transfer ref, dates +
// a per-row view action (245 AC 3).
// ---------------------------------------------------------------------------

function LedgerTable({ rows }: { rows: RefundRow[] }) {
    return (
        <div className='rounded-md border overflow-auto'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='min-w-[110px]'>Order</TableHead>
                        <TableHead className='min-w-[120px]'>Amount</TableHead>
                        <TableHead className='min-w-[120px]'>Status</TableHead>
                        <TableHead className='min-w-[200px]'>Transfer reference</TableHead>
                        <TableHead className='min-w-[150px]'>Created</TableHead>
                        <TableHead className='min-w-[150px]'>Paid</TableHead>
                        <TableHead className='min-w-[80px] text-right'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.length > 0 ? (
                        rows.map(row => (
                            <TableRow key={row.slugId}>
                                <TableCell className='font-medium'>
                                    <a href='#' className='font-mono text-primary underline-offset-4 hover:underline'>
                                        #{row.orderSlugId}
                                    </a>
                                </TableCell>
                                <TableCell className='font-semibold'>{formatVnd(row.amount)}</TableCell>
                                <TableCell>
                                    <RefundStatusBadge status={row.status} />
                                </TableCell>
                                <TableCell>
                                    {row.transferReference ? (
                                        <code className='font-mono text-xs'>{row.transferReference}</code>
                                    ) : (
                                        <span className='text-muted-foreground'>—</span>
                                    )}
                                </TableCell>
                                <TableCell className='text-sm text-muted-foreground'>{row.createdDate}</TableCell>
                                <TableCell className='text-sm text-muted-foreground'>
                                    {row.paidDate ?? <span className='text-muted-foreground'>—</span>}
                                </TableCell>
                                <TableCell className='text-right'>
                                    <Button variant='ghost' size='icon-sm' className='h-8 w-8' aria-label='View refund'>
                                        <Eye className='h-4 w-4' />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className='py-10 text-center text-muted-foreground'>
                                No refunds with this status.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <AdminTopNav />
            <main className='mx-auto w-full max-w-7xl px-6 py-8'>
                <div className='mb-6 flex items-center gap-2.5'>
                    <RotateCcw className='h-6 w-6 text-primary' />
                    <div>
                        <h1 className='text-2xl font-bold text-foreground'>Refunds</h1>
                        <p className='mt-0.5 text-sm text-muted-foreground'>
                            Reconcile every refund — approve, retry, and view transfer references.
                        </p>
                    </div>
                </div>
                {children}
            </main>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interactive ledger — Tabs filter drives the visible rows (245 AC 2).
// ---------------------------------------------------------------------------

function LedgerHarness({ initialRows = REFUNDS }: { initialRows?: RefundRow[] }) {
    const [filter, setFilter] = React.useState<StatusFilter>('all');
    const rows = applyFilter(initialRows, filter);

    return (
        <PageShell>
            <Tabs value={filter} onValueChange={value => setFilter(value as StatusFilter)} className='mb-4'>
                <TabsList>
                    {FILTERS.map(f => (
                        <TabsTrigger key={f.key} value={f.key}>
                            {f.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <LedgerTable rows={rows} />
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 7/Admin Refunds Ledger',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — all refunds listed with order ref, amount, status, transfer ref,
 *  and created / paid dates (245 AC 1). Use the tabs to filter (245 AC 2). */
export const AllRefunds: Story = {
    name: 'Default — All Refunds Listed (245)',
    render: () => <LedgerHarness />,
};

/** Pending filter — only Pending refunds (245 AC 2). */
export const PendingFilter: Story = {
    name: 'Filtered — Pending Only (245)',
    render: () => (
        <PageShell>
            <Tabs value='pending' className='mb-4'>
                <TabsList>
                    {FILTERS.map(f => (
                        <TabsTrigger key={f.key} value={f.key}>
                            {f.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <LedgerTable rows={applyFilter(REFUNDS, 'pending')} />
        </PageShell>
    ),
};

/** Failed filter — Failed refunds with their failure reason recorded (247 AC 3). */
export const FailedFilter: Story = {
    name: 'Filtered — Failed Only, With Reason (245 / 247)',
    parameters: {
        docs: {
            description: {
                story: 'The Failed filter surfaces every Failed refund. Each carries its failure reason (shown in full on the refund detail) so staff can decide whether to retry — satisfies 247 AC 3.',
            },
        },
    },
    render: () => (
        <PageShell>
            <Tabs value='failed' className='mb-4'>
                <TabsList>
                    {FILTERS.map(f => (
                        <TabsTrigger key={f.key} value={f.key}>
                            {f.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <LedgerTable rows={applyFilter(REFUNDS, 'failed')} />
        </PageShell>
    ),
};

/** Empty — a filter that matches no refunds. */
export const EmptyFilter: Story = {
    name: 'Empty — No Refunds For Filter',
    render: () => (
        <PageShell>
            <Tabs value='paid' className='mb-4'>
                <TabsList>
                    {FILTERS.map(f => (
                        <TabsTrigger key={f.key} value={f.key}>
                            {f.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <LedgerTable rows={[]} />
        </PageShell>
    ),
};

/** Loading — the ledger skeleton while refunds load. */
export const Loading: Story = {
    name: 'Loading — Skeleton State',
    render: () => (
        <PageShell>
            <Skeleton className='mb-4 h-9 w-72 rounded-lg' />
            <div className='rounded-md border'>
                <div className='space-y-3 p-4'>
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className='flex items-center gap-4'>
                            <Skeleton className='h-4 w-20' />
                            <Skeleton className='h-4 w-24' />
                            <Skeleton className='h-6 w-24 rounded-full' />
                            <Skeleton className='h-4 flex-1' />
                            <Skeleton className='h-4 w-28' />
                            <Skeleton className='h-8 w-8 rounded-md' />
                        </div>
                    ))}
                </div>
            </div>
        </PageShell>
    ),
};

/** Error — the ledger failed to load. */
export const ErrorStateStory: Story = {
    name: 'Error — Failed To Load Refunds',
    render: () => (
        <PageShell>
            <Tabs value='all' className='mb-4'>
                <TabsList>
                    {FILTERS.map(f => (
                        <TabsTrigger key={f.key} value={f.key}>
                            {f.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
            <div className='rounded-md border'>
                <ErrorState
                    className='py-16'
                    title='Couldn’t load refunds'
                    description='Something went wrong fetching the refunds ledger. Please try again.'
                    action={<Button variant='outline'>Retry</Button>}
                />
            </div>
        </PageShell>
    ),
};
