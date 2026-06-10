import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    AlertCircle,
    ChefHat,
    ClipboardList,
    CircleDot,
    DollarSign,
    FolderOpen,
    LayoutDashboard,
    Loader,
    Moon,
    Receipt,
    RefreshCw,
    ShoppingBag,
    Users,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import ErrorState from '@/components/error-state';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Mirrors src/app/utils/currency.utils.ts — VND formatting used across the app. */
function formatVnd(amount: number): string {
    return amount.toLocaleString('en-US') + ' ₫';
}

// ---------------------------------------------------------------------------
// Domain shapes (mock only — matches the ACs' data shape, no real models)
// ---------------------------------------------------------------------------

type OrderStatusKey = 'new' | 'inProgress' | 'completed';

interface OrderStatusSummary {
    key: OrderStatusKey;
    label: string;
    icon: LucideIcon;
    count: number;
    /** Token-driven accent for the card icon chip. */
    accentClass: string;
}

interface TodaysMetrics {
    revenue: number;
    orderCount: number;
}

// ---------------------------------------------------------------------------
// Mock fixtures
// ---------------------------------------------------------------------------

const STATUS_META: Record<OrderStatusKey, { label: string; icon: LucideIcon; accentClass: string }> = {
    new: { label: 'New', icon: CircleDot, accentClass: 'bg-secondary text-secondary-foreground' },
    inProgress: { label: 'In Progress', icon: Loader, accentClass: 'bg-primary/10 text-primary' },
    completed: { label: 'Completed', icon: ClipboardList, accentClass: 'bg-success/15 text-success' },
};

function buildStatusSummaries(counts: Record<OrderStatusKey, number>): OrderStatusSummary[] {
    return (Object.keys(STATUS_META) as OrderStatusKey[]).map(key => ({
        key,
        ...STATUS_META[key],
        count: counts[key],
    }));
}

const STATUS_POPULATED = buildStatusSummaries({ new: 12, inProgress: 5, completed: 184 });
const STATUS_EMPTY = buildStatusSummaries({ new: 0, inProgress: 0, completed: 0 });

const METRICS_POPULATED: TodaysMetrics = { revenue: 4_185_000, orderCount: 17 };
const METRICS_EMPTY: TodaysMetrics = { revenue: 0, orderCount: 0 };

const TODAY_LABEL = '10 Jun 2026';

// ---------------------------------------------------------------------------
// Admin top navigation — reproduces layouts/admin/admin-toolbar-desktop.tsx
// so the active "Dashboard" entry (story 221) is shown faithfully.
// ---------------------------------------------------------------------------

interface NavItem {
    label: string;
    icon: LucideIcon;
    active: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true },
    { label: 'Orders', icon: ShoppingBag, active: false },
    { label: 'Foods', icon: ChefHat, active: false },
    { label: 'Categories', icon: FolderOpen, active: false },
    { label: 'Users', icon: Users, active: false },
];

function AdminTopNav() {
    return (
        <header className='sticky top-0 z-50 h-16 w-full border-b bg-background'>
            <div className='mx-auto flex h-full w-full max-w-7xl items-center px-6'>
                {/* Left — brand */}
                <div className='flex flex-1 items-center gap-2'>
                    <span className='text-lg font-semibold tracking-tight text-primary'>Notism</span>
                    <Badge
                        variant='secondary'
                        className='px-1.5 py-0 text-[10px] font-semibold uppercase tracking-wide'
                    >
                        Admin
                    </Badge>
                </div>

                {/* Center — nav links; Dashboard marked active (story 221) */}
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

                {/* Right — theme + avatar (placeholders; not changed by this sprint) */}
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
// Page shell
// ---------------------------------------------------------------------------

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='bg-background' style={{ height: '100vh', overflowY: 'auto' }}>
            <AdminTopNav />
            <main className='mx-auto w-full max-w-7xl px-6 py-8'>
                {/* Page header */}
                <div className='mb-8 flex items-center gap-2.5'>
                    <LayoutDashboard className='h-6 w-6 text-primary' />
                    <div>
                        <h1 className='text-2xl font-bold text-foreground'>Dashboard</h1>
                        <p className='mt-0.5 text-sm text-muted-foreground'>Operational overview for {TODAY_LABEL}</p>
                    </div>
                </div>

                {children}

                {/* Recent activity — placeholder; exists in current system, not changed by this sprint */}
                <div className='mt-8 flex h-[180px] items-center justify-center rounded-xl border border-dashed bg-muted/20'>
                    <span className='font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40'>
                        recent activity placeholder
                    </span>
                </div>
            </main>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h2 className='mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{children}</h2>;
}

// ---------------------------------------------------------------------------
// Today's metrics (story 220)
// ---------------------------------------------------------------------------

function MetricCard({
    icon: Icon,
    label,
    value,
    sublabel,
}: {
    icon: LucideIcon;
    label: string;
    value: string;
    sublabel: string;
}) {
    return (
        <Card>
            <CardHeader className='flex-row items-center justify-between gap-2 space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>{label}</CardTitle>
                <span className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <Icon className='h-4 w-4' />
                </span>
            </CardHeader>
            <CardContent>
                <p className='text-3xl font-bold tracking-tight text-foreground'>{value}</p>
                <p className='mt-1 text-xs text-muted-foreground'>{sublabel}</p>
            </CardContent>
        </Card>
    );
}

function MetricsSection({ metrics }: { metrics: TodaysMetrics }) {
    return (
        <section className='mb-8'>
            <SectionHeading>Today&apos;s sales</SectionHeading>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <MetricCard
                    icon={DollarSign}
                    label="Today's revenue"
                    value={formatVnd(metrics.revenue)}
                    sublabel={metrics.revenue === 0 ? 'No sales yet today' : 'Gross sales since midnight'}
                />
                <MetricCard
                    icon={Receipt}
                    label="Today's orders"
                    value={metrics.orderCount.toLocaleString('en-US')}
                    sublabel={metrics.orderCount === 0 ? 'No orders placed yet today' : 'Orders placed since midnight'}
                />
            </div>
        </section>
    );
}

function MetricsSkeleton() {
    return (
        <section className='mb-8'>
            <SectionHeading>Today&apos;s sales</SectionHeading>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                {[0, 1].map(i => (
                    <Card key={i}>
                        <CardHeader className='flex-row items-center justify-between gap-2 space-y-0 pb-2'>
                            <Skeleton className='h-4 w-28' />
                            <Skeleton className='h-8 w-8 rounded-full' />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className='h-9 w-40' />
                            <Skeleton className='mt-2 h-3 w-32' />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function SectionError({ title, description, onRetry }: { title: string; description: string; onRetry?: () => void }) {
    return (
        <Card className='border-destructive/30'>
            <CardContent className='py-2'>
                <ErrorState
                    iconSize='sm'
                    icon={<AlertCircle className='h-10 w-10 text-destructive' />}
                    title={title}
                    description={description}
                    action={
                        <Button variant='outline' onClick={onRetry}>
                            <RefreshCw className='mr-2 h-4 w-4' />
                            Retry
                        </Button>
                    }
                />
            </CardContent>
        </Card>
    );
}

function MetricsError() {
    return (
        <section className='mb-8'>
            <SectionHeading>Today&apos;s sales</SectionHeading>
            <SectionError
                title="Couldn't load today's metrics"
                description='Something went wrong fetching revenue and order totals. Please try again.'
            />
        </section>
    );
}

// ---------------------------------------------------------------------------
// Order status overview (story 219)
// ---------------------------------------------------------------------------

function StatusCard({ summary }: { summary: OrderStatusSummary }) {
    const Icon = summary.icon;
    return (
        <button
            type='button'
            className='group block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            aria-label={`${summary.label} orders: ${summary.count}. View filtered list.`}
        >
            <Card className='transition-colors group-hover:border-primary/40 group-hover:bg-accent/30'>
                <CardHeader className='flex-row items-center justify-between gap-2 space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium text-muted-foreground'>{summary.label}</CardTitle>
                    <span
                        className={['flex h-8 w-8 items-center justify-center rounded-full', summary.accentClass].join(
                            ' '
                        )}
                    >
                        <Icon className='h-4 w-4' />
                    </span>
                </CardHeader>
                <CardContent>
                    <p className='text-3xl font-bold tracking-tight text-foreground'>
                        {summary.count.toLocaleString('en-US')}
                    </p>
                    <p className='mt-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100'>
                        View orders →
                    </p>
                </CardContent>
            </Card>
        </button>
    );
}

function StatusSection({ statuses }: { statuses: OrderStatusSummary[] }) {
    return (
        <section>
            <SectionHeading>Orders by status</SectionHeading>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {statuses.map(summary => (
                    <StatusCard key={summary.key} summary={summary} />
                ))}
            </div>
        </section>
    );
}

function StatusSkeleton() {
    return (
        <section>
            <SectionHeading>Orders by status</SectionHeading>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {[0, 1, 2].map(i => (
                    <Card key={i}>
                        <CardHeader className='flex-row items-center justify-between gap-2 space-y-0 pb-2'>
                            <Skeleton className='h-4 w-24' />
                            <Skeleton className='h-8 w-8 rounded-full' />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className='h-9 w-16' />
                            <Skeleton className='mt-2 h-3 w-20' />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function StatusError() {
    return (
        <section>
            <SectionHeading>Orders by status</SectionHeading>
            <SectionError
                title="Couldn't load order status counts"
                description='We were unable to fetch the order status overview. Please try again.'
            />
        </section>
    );
}

// ---------------------------------------------------------------------------
// Story compositions
// ---------------------------------------------------------------------------

function DefaultStory() {
    return (
        <PageShell>
            <MetricsSection metrics={METRICS_POPULATED} />
            <Separator className='mb-8' />
            <StatusSection statuses={STATUS_POPULATED} />
        </PageShell>
    );
}

function EmptyStory() {
    return (
        <PageShell>
            <MetricsSection metrics={METRICS_EMPTY} />
            <Separator className='mb-8' />
            <StatusSection statuses={STATUS_EMPTY} />
        </PageShell>
    );
}

function LoadingStory() {
    return (
        <PageShell>
            <MetricsSkeleton />
            <Separator className='mb-8' />
            <StatusSkeleton />
        </PageShell>
    );
}

function ErrorStory() {
    return (
        <PageShell>
            <MetricsError />
            <Separator className='mb-8' />
            <StatusError />
        </PageShell>
    );
}

/** Partial — metrics resolved, status counts failed independently. */
function PartialStory() {
    return (
        <PageShell>
            <MetricsSection metrics={METRICS_POPULATED} />
            <Separator className='mb-8' />
            <StatusError />
        </PageShell>
    );
}

// ---------------------------------------------------------------------------
// Meta + Stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 5/Admin Dashboard Page',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    name: 'Default — Status Counts & Today’s Metrics',
    render: () => <DefaultStory />,
};

export const Empty: Story = {
    name: 'Empty — Zero Counts & No Sales Today',
    render: () => <EmptyStory />,
};

export const Loading: Story = {
    name: 'Loading — Skeleton Placeholders',
    render: () => <LoadingStory />,
};

export const Error: Story = {
    name: 'Error — Both Sections Failed (Retry)',
    render: () => <ErrorStory />,
};

export const Partial: Story = {
    name: 'Partial — Metrics Loaded, Status Counts Failed',
    render: () => <PartialStory />,
};
