import type { Meta, StoryObj } from '@storybook/react-vite';
import {
    AlertCircle,
    ChefHat,
    ClipboardList,
    CircleDot,
    FolderOpen,
    LayoutDashboard,
    Loader,
    Moon,
    RefreshCw,
    ShoppingBag,
    Users,
    type LucideIcon,
} from 'lucide-react';
import React from 'react';
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/chart';
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
}

interface TodaysMetrics {
    revenue: number;
    orderCount: number;
}

// ---------------------------------------------------------------------------
// Mock fixtures
// ---------------------------------------------------------------------------

const STATUS_META: Record<OrderStatusKey, { label: string; icon: LucideIcon }> = {
    new: { label: 'New', icon: CircleDot },
    inProgress: { label: 'In Progress', icon: Loader },
    completed: { label: 'Completed', icon: ClipboardList },
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
// Shared section error (chart region) — story 219 + 220 failure ACs
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Today's sales (story 220)
//
// Two figures with DIFFERENT units (VND revenue vs an order count) must not
// share one axis. Rendered as two independent single-value bar gauges, each
// with its own scale and clearly labelled value.
// ---------------------------------------------------------------------------

const REVENUE_CHART_CONFIG = {
    revenue: { label: "Today's revenue", color: 'var(--chart-1)' },
} satisfies ChartConfig;

const ORDERS_CHART_CONFIG = {
    orders: { label: "Today's orders", color: 'var(--chart-2)' },
} satisfies ChartConfig;

function SalesGauge({
    config,
    name,
    value,
    displayValue,
    color,
    accessibleName,
}: {
    config: ChartConfig;
    name: string;
    value: number;
    displayValue: string;
    color: string;
    accessibleName: string;
}) {
    const data = [{ name, value }];
    return (
        <Card>
            <CardContent className='pt-6'>
                <div className='flex items-baseline justify-between gap-2'>
                    <span className='text-sm font-medium text-muted-foreground'>{name}</span>
                    <span className='text-2xl font-bold tracking-tight text-foreground tabular-nums'>
                        {displayValue}
                    </span>
                </div>
                <ChartContainer
                    config={config}
                    role='img'
                    aria-label={accessibleName}
                    className='mt-3 aspect-auto h-16 w-full'
                >
                    <BarChart accessibilityLayer data={data} layout='vertical' margin={{ left: 0, right: 8 }}>
                        <XAxis type='number' hide domain={[0, 'dataMax']} />
                        <YAxis type='category' dataKey='name' hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey='value' name={name} radius={6} barSize={28}>
                            <Cell fill={color} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function MetricsSection({ metrics }: { metrics: TodaysMetrics }) {
    const revenueEmpty = metrics.revenue === 0;
    const ordersEmpty = metrics.orderCount === 0;
    return (
        <section className='mb-8'>
            <SectionHeading>Today&apos;s sales</SectionHeading>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <SalesGauge
                    config={REVENUE_CHART_CONFIG}
                    name="Today's revenue"
                    value={metrics.revenue}
                    displayValue={formatVnd(metrics.revenue)}
                    color='var(--chart-1)'
                    accessibleName={
                        revenueEmpty ? "Today's revenue: 0 ₫" : `Today's revenue: ${formatVnd(metrics.revenue)}`
                    }
                />
                <SalesGauge
                    config={ORDERS_CHART_CONFIG}
                    name="Today's orders"
                    value={metrics.orderCount}
                    displayValue={metrics.orderCount.toLocaleString('en-US')}
                    color='var(--chart-2)'
                    accessibleName={
                        ordersEmpty
                            ? "Today's orders: 0"
                            : `Today's orders: ${metrics.orderCount.toLocaleString('en-US')}`
                    }
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
                        <CardContent className='pt-6'>
                            <div className='flex items-baseline justify-between gap-2'>
                                <Skeleton className='h-4 w-28' />
                                <Skeleton className='h-7 w-32' />
                            </div>
                            {/* Chart region placeholder */}
                            <Skeleton className='mt-3 h-16 w-full rounded-md' />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
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
// Orders by status (story 219)
//
// Single bar chart comparing the order count per status. Each status — incl.
// zero-count — remains a labelled bar. Bars are clickable (drill-down
// affordance to the filtered orders list) with hover cursor + per-bar
// aria-label, and a legend so a non-engineer sees the click target.
// ---------------------------------------------------------------------------

const STATUS_CHART_CONFIG = {
    new: { label: 'New', color: 'var(--chart-2)' },
    inProgress: { label: 'In Progress', color: 'var(--chart-4)' },
    completed: { label: 'Completed', color: 'var(--chart-1)' },
} satisfies ChartConfig;

interface StatusDatum {
    key: OrderStatusKey;
    label: string;
    count: number;
    fill: string;
}

function StatusSection({ statuses }: { statuses: OrderStatusSummary[] }) {
    const data: StatusDatum[] = statuses.map(s => ({
        key: s.key,
        label: s.label,
        count: s.count,
        fill: `var(--color-${s.key})`,
    }));

    return (
        <section>
            <SectionHeading>Orders by status</SectionHeading>
            <Card>
                <CardContent className='pt-6'>
                    <p className='mb-4 text-sm text-muted-foreground'>
                        Live order count per status. Select a bar to view that status&apos;s filtered orders.
                    </p>
                    <ChartContainer
                        config={STATUS_CHART_CONFIG}
                        role='img'
                        aria-label='Order count by status. Select a bar to open the filtered orders list.'
                        className='aspect-auto h-[280px] w-full'
                    >
                        <BarChart accessibilityLayer data={data} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                            <XAxis dataKey='label' tickLine={false} axisLine={false} tickMargin={8} />
                            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey='key' />} />
                            <ChartLegend content={<ChartLegendContent nameKey='key' />} />
                            <Bar dataKey='count' radius={[6, 6, 0, 0]} className='cursor-pointer'>
                                <LabelList
                                    dataKey='count'
                                    position='top'
                                    className='fill-foreground text-xs font-semibold tabular-nums'
                                />
                                {data.map(d => (
                                    <Cell
                                        key={d.key}
                                        fill={d.fill}
                                        role='button'
                                        tabIndex={0}
                                        aria-label={`${d.label} orders: ${d.count}. View orders filtered to ${d.label}.`}
                                        className='cursor-pointer outline-none focus-visible:opacity-80 hover:opacity-80'
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </section>
    );
}

function StatusSkeleton() {
    return (
        <section>
            <SectionHeading>Orders by status</SectionHeading>
            <Card>
                <CardContent className='pt-6'>
                    <Skeleton className='mb-4 h-4 w-72' />
                    {/* Chart region placeholder */}
                    <div className='flex h-[280px] items-end gap-6 px-2'>
                        <Skeleton className='h-1/3 w-full rounded-md' />
                        <Skeleton className='h-1/4 w-full rounded-md' />
                        <Skeleton className='h-full w-full rounded-md' />
                    </div>
                </CardContent>
            </Card>
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

/** Partial — metrics resolved, status chart failed independently. */
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
    name: 'Default — Status Chart & Today’s Sales',
    render: () => <DefaultStory />,
};

export const Empty: Story = {
    name: 'Empty — Zero Counts & No Sales Today',
    render: () => <EmptyStory />,
};

export const Loading: Story = {
    name: 'Loading — Chart Skeleton Placeholders',
    render: () => <LoadingStory />,
};

export const Error: Story = {
    name: 'Error — Both Charts Failed (Retry)',
    render: () => <ErrorStory />,
};

export const Partial: Story = {
    name: 'Partial — Sales Loaded, Status Chart Failed',
    render: () => <PartialStory />,
};
