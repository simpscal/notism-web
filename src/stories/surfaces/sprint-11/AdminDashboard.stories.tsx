import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlertCircle, LayoutDashboard, RefreshCw } from 'lucide-react';
import React from 'react';

import { cn } from '@/app/utils/tailwind.utils';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import ErrorState from '@/components/error-state';
import { Separator } from '@/components/separator';
import { Skeleton } from '@/components/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

// ---------------------------------------------------------------------------
// Surface — Admin dashboard (route /admin/dashboard), restyled on-theme.
//
// Business functionality is UNCHANGED from the current dashboard
// (src/pages/admin/dashboard): the same three metric clusters, the same data
// shapes, the same section states. This story only restyles them to
// DESIGN_THEME.md, matching the elevation + floating-toolbar reference:
//
//   • Elevation is soft and minimal — ONE gentle step per level:
//       dark ambient frame → large-radius light-gray shell → white content
//       panel (hairline + faint shadow) → white metric cards (hairline,
//       little/no shadow). No heavy rings or drop shadows.
//   • The admin nav is NOT this surface's concern — it is owned by the
//     AdminAppShell surface (shared NavBar). This dashboard is
//     a page body rendered inside that shell, so the nav region here is a
//     labeled, muted sticky placeholder, not a re-implemented bar.
//   • Metric clusters render as on-theme cards — large rounding (rounded-3xl),
//     clear eyebrow → heading → body hierarchy, comfortable density.
//   • Price emphasis is crimson (theme: "every price and running total is
//     crimson") — today's revenue + the revenue-over-time total.
//   • The status-bearing cluster (orders by status) uses a CONSISTENT status
//     colour per state AND a word label — never colour alone (theme Do/Don't).
//
// Mock-only fixtures. No api/model/state/i18n imports — copy is inlined from
// en.json (admin.dashboard.*) so the story is fully self-contained.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Domain shapes (mock only — mirrors the dashboard's response shapes)
// ---------------------------------------------------------------------------

interface TodaySales {
    revenue: number;
    orderCount: number;
}

type OrderStatusKey = 'new' | 'inProgress' | 'completed';

interface OrderStatusSummary {
    new: number;
    inProgress: number;
    completed: number;
}

type Granularity = 'year' | 'month' | 'day';

interface RevenuePoint {
    period: string;
    revenue: number;
}

// ---------------------------------------------------------------------------
// Fixtures — VND figures + status counts in the shape the real sections read.
// ---------------------------------------------------------------------------

const TODAY_SALES: TodaySales = { revenue: 4_820_000, orderCount: 63 };

const STATUS_SUMMARY: OrderStatusSummary = { new: 7, inProgress: 12, completed: 44 };

const REVENUE_SERIES: Record<Granularity, RevenuePoint[]> = {
    year: [
        { period: '2022', revenue: 640_000_000 },
        { period: '2023', revenue: 910_000_000 },
        { period: '2024', revenue: 1_180_000_000 },
        { period: '2025', revenue: 1_540_000_000 },
        { period: '2026', revenue: 880_000_000 },
    ],
    month: [
        { period: 'Jan', revenue: 96_000_000 },
        { period: 'Feb', revenue: 112_000_000 },
        { period: 'Mar', revenue: 88_000_000 },
        { period: 'Apr', revenue: 134_000_000 },
        { period: 'May', revenue: 150_000_000 },
        { period: 'Jun', revenue: 121_000_000 },
        { period: 'Jul', revenue: 168_000_000 },
    ],
    day: [
        { period: 'Mon', revenue: 4_100_000 },
        { period: 'Tue', revenue: 5_320_000 },
        { period: 'Wed', revenue: 3_680_000 },
        { period: 'Thu', revenue: 6_240_000 },
        { period: 'Fri', revenue: 7_910_000 },
        { period: 'Sat', revenue: 9_450_000 },
        { period: 'Sun', revenue: 4_820_000 },
    ],
};

// ---------------------------------------------------------------------------
// Formatting helpers (mirror the app's currency + compact-axis utils).
// ---------------------------------------------------------------------------

function formatVnd(amount: number): string {
    return `${amount.toLocaleString('en-US')} ₫`;
}

function formatVndCompact(amount: number): string {
    if (amount === 0) return '0 ₫';
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B ₫`;
    if (amount >= 1_000_000) return `${Math.round(amount / 1_000_000)}M ₫`;
    if (amount >= 1_000) return `${Math.round(amount / 1_000)}K ₫`;
    return `${amount} ₫`;
}

const TODAY_LABEL = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// ---------------------------------------------------------------------------
// Status role map — each order state maps to ONE consistent, NON-RED colour and
// always ships alongside a WORD label, so state is never conveyed by colour
// alone and red is never spent on a status (theme §8: positive → green, and the
// two-tone rule reserves red for revenue). new → teal (info), inProgress →
// amber (active), completed → success green (done).
// ---------------------------------------------------------------------------

const STATUS_ORDER: readonly OrderStatusKey[] = ['new', 'inProgress', 'completed'];

const STATUS_META: Record<OrderStatusKey, { label: string; color: string; blurb: string }> = {
    new: { label: 'New', color: 'var(--chart-2)', blurb: 'Awaiting the kitchen' },
    inProgress: { label: 'In progress', color: 'var(--chart-4)', blurb: 'Being prepared now' },
    completed: { label: 'Completed', color: 'var(--success)', blurb: 'Handed off today' },
};

// ---------------------------------------------------------------------------
// Admin nav placeholder — the admin chrome is NOT this surface's concern. The
// portal-wide top nav is owned by the AdminAppShell surface, where it is the
// shared, domain-blind NavBar. This dashboard is a PAGE body
// rendered inside that shell, so the nav region here is a labeled, muted
// placeholder (sticky, dashed hairline, mono uppercase label) rather than a
// re-implemented bar — mirroring the placeholder rule and keeping a single
// source of truth for the admin nav in AdminAppShell.stories.tsx.
// ---------------------------------------------------------------------------

function AdminNavPlaceholder() {
    return (
        <div
            className='sticky top-0 z-30 flex h-14 shrink-0 items-center rounded-3xl border border-dashed border-border bg-card/60 px-4'
            aria-hidden
        >
            <span className='font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground'>
                Admin nav placeholder — NavBar variant=&quot;admin&quot; (AdminAppShell)
            </span>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------

/** Eyebrow micro-label — UPPERCASE, letter-spaced, muted (theme §3). */
function Eyebrow({ children }: { children: React.ReactNode }) {
    return <p className='mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground'>{children}</p>;
}

/**
 * Section header — the app-wide pattern (theme §6): eyebrow micro-label + H2
 * section title on the left, a single optional utility on the right, with an
 * optional description line beneath. H2 is 20–22px SemiBold (theme §3).
 */
function SectionHeader({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow: string;
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className='mb-5'>
            <div className='flex items-end justify-between gap-3'>
                <div>
                    <Eyebrow>{eyebrow}</Eyebrow>
                    <h2 className='text-xl font-semibold tracking-tight text-foreground sm:text-[22px]'>{title}</h2>
                </div>
                {action}
            </div>
            {description ? <p className='mt-2 max-w-2xl text-sm text-muted-foreground'>{description}</p> : null}
        </div>
    );
}

/** A word-labelled, colour-coded status chip — colour + word together. */
function StatusChip({ status }: { status: OrderStatusKey }) {
    const meta = STATUS_META[status];
    return (
        <span className='inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-foreground'>
            <span aria-hidden className='h-2 w-2 rounded-full' style={{ backgroundColor: meta.color }} />
            {meta.label}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Cluster 1 — Today's sales (two metric cards). Revenue value is crimson
// (price emphasis); order count is near-black. Each metric carries a slim
// rounded progress rail as a quiet, on-theme "gauge". Cards are white with a
// hairline and no drop shadow — one gentle step below the white content panel.
// ---------------------------------------------------------------------------

function MetricGauge({
    label,
    value,
    accent,
    fill,
}: {
    label: string;
    value: string;
    accent: 'primary' | 'foreground';
    fill: number;
}) {
    return (
        <Card className='rounded-3xl shadow-none'>
            <CardContent>
                <div className='flex items-baseline justify-between gap-3'>
                    <span className='text-sm font-medium text-muted-foreground'>{label}</span>
                    <span
                        className={cn(
                            'text-3xl font-bold tracking-tight tabular-nums',
                            accent === 'primary' ? 'text-primary' : 'text-foreground'
                        )}
                    >
                        {value}
                    </span>
                </div>
                <div className='mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted'>
                    <div
                        className='h-full rounded-full'
                        style={{
                            width: `${Math.min(100, Math.max(6, fill))}%`,
                            backgroundColor: accent === 'primary' ? 'var(--primary)' : 'var(--foreground)',
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

function TodaySalesCluster({ data }: { data: TodaySales }) {
    return (
        <section>
            <SectionHeader eyebrow='Today' title="Today's sales" />
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                <MetricGauge label="Today's revenue" value={formatVnd(data.revenue)} accent='primary' fill={72} />
                <MetricGauge
                    label="Today's orders"
                    value={data.orderCount.toLocaleString('en-US')}
                    accent='foreground'
                    fill={52}
                />
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Cluster 2 — Orders by status (the status-bearing metric). One on-theme card
// per state: a word-labelled status chip + the consistent status colour + the
// count. Selecting a card opens that status's filtered orders (mirrors the
// source navigate-on-select behaviour).
// ---------------------------------------------------------------------------

function StatusMetricCard({
    status,
    count,
    onSelect,
}: {
    status: OrderStatusKey;
    count: number;
    onSelect: (status: OrderStatusKey) => void;
}) {
    const meta = STATUS_META[status];
    return (
        <Card
            role='button'
            tabIndex={0}
            aria-label={`${meta.label} orders: ${count}. View orders filtered to ${meta.label}.`}
            onClick={() => onSelect(status)}
            className='relative cursor-pointer overflow-hidden rounded-3xl shadow-none transition-colors hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
        >
            {/* consistent status accent — decorative rail; the word chip carries meaning */}
            <span aria-hidden className='absolute inset-x-0 top-0 h-1' style={{ backgroundColor: meta.color }} />
            <CardContent>
                <div className='flex items-center justify-between gap-3'>
                    <StatusChip status={status} />
                    <span className='text-3xl font-bold tabular-nums text-foreground'>{count}</span>
                </div>
                <p className='mt-3 text-sm text-muted-foreground'>{meta.blurb}</p>
            </CardContent>
        </Card>
    );
}

function OrderStatusCluster({ data }: { data: OrderStatusSummary }) {
    const handleSelect = React.useCallback((status: OrderStatusKey) => {
        // In the app this routes to /admin/orders?status={status}; mocked here.
        void status;
    }, []);

    return (
        <section>
            <SectionHeader
                eyebrow='Operations'
                title='Orders by status'
                description="Live order count per status. Select a card to view that status's filtered orders."
            />
            <div className='grid grid-cols-1 gap-5 sm:grid-cols-3'>
                {STATUS_ORDER.map(key => (
                    <StatusMetricCard key={key} status={key} count={data[key]} onSelect={handleSelect} />
                ))}
            </div>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Cluster 3 — Revenue over time. Total is crimson (running total); a word-based
// granularity toggle switches the series; a quiet on-theme bar rail visualises
// each period.
// ---------------------------------------------------------------------------

const GRANULARITY_ORDER: readonly Granularity[] = ['year', 'month', 'day'];
const GRANULARITY_LABEL: Record<Granularity, string> = { year: 'Year', month: 'Month', day: 'Day' };
const RANGE_LABEL: Record<Granularity, string> = { year: 'per year', month: 'per month', day: 'per day' };

function RevenueBars({ points }: { points: RevenuePoint[] }) {
    const max = Math.max(...points.map(p => p.revenue), 1);
    return (
        <div className='mt-6 flex h-[220px] items-end gap-3'>
            {points.map(point => (
                <div key={point.period} className='flex min-w-0 flex-1 flex-col items-center gap-2'>
                    <div className='flex w-full flex-1 items-end'>
                        <div
                            className='w-full rounded-t-xl bg-foreground transition-all'
                            style={{ height: `${Math.max(4, (point.revenue / max) * 100)}%` }}
                            title={`${point.period}: ${formatVnd(point.revenue)}`}
                        />
                    </div>
                    <span className='truncate text-xs text-muted-foreground'>{point.period}</span>
                    <span className='truncate text-[10px] tabular-nums text-muted-foreground/70'>
                        {formatVndCompact(point.revenue)}
                    </span>
                </div>
            ))}
        </div>
    );
}

function RevenueCluster() {
    const [granularity, setGranularity] = React.useState<Granularity>('month');
    const points = REVENUE_SERIES[granularity];
    const total = points.reduce((sum, p) => sum + p.revenue, 0);

    const toggle = (
        <ToggleGroup
            type='single'
            value={granularity}
            onValueChange={value => value && setGranularity(value as Granularity)}
            variant='segmented'
            size='sm'
            aria-label='Revenue granularity'
            className='self-start sm:self-auto'
        >
            {GRANULARITY_ORDER.map(key => (
                <ToggleGroupItem key={key} value={key} className='px-3'>
                    {GRANULARITY_LABEL[key]}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );

    return (
        <section>
            <SectionHeader eyebrow='Trends' title='Revenue over time' action={toggle} />
            <Card className='rounded-3xl shadow-none'>
                <CardContent>
                    <p className='text-sm text-muted-foreground'>
                        Total revenue per period — {RANGE_LABEL[granularity]}.
                    </p>
                    {/* Running total — crimson price accent (theme §3: prices are accent-primary bold) */}
                    <p className='mt-1 text-3xl font-bold tracking-tight tabular-nums text-primary'>
                        {formatVnd(total)}
                    </p>
                    <RevenueBars points={points} />
                </CardContent>
            </Card>
        </section>
    );
}

// ---------------------------------------------------------------------------
// Loading + error variants for a cluster (mirror the source per-section
// skeleton + ErrorState boundaries, restyled to the theme's rounding).
// ---------------------------------------------------------------------------

function ClusterSkeleton({ columns }: { columns: 2 | 3 }) {
    return (
        <div className={`grid grid-cols-1 gap-5 ${columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
            {Array.from({ length: columns }).map((_, i) => (
                <Card key={i} className='rounded-3xl shadow-none'>
                    <CardContent>
                        <div className='flex items-center justify-between gap-3'>
                            <Skeleton className='h-6 w-28 rounded-full' />
                            <Skeleton className='h-8 w-16' />
                        </div>
                        <Skeleton className='mt-4 h-2.5 w-full rounded-full' />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function ClusterError({ title, description }: { title: string; description: string }) {
    return (
        <Card className='rounded-3xl border-destructive/30 shadow-none'>
            <CardContent className='py-2'>
                <ErrorState
                    iconSize='sm'
                    icon={<AlertCircle className='h-10 w-10 text-destructive' />}
                    title={title}
                    description={description}
                    action={
                        <Button variant='outline'>
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
// Portal shell — soft, minimal elevation, one gentle step per level:
//
//   dark ambient frame (fills the viewport)
//     → large-radius light-gray shell (fills the frame, flex column)
//        → sticky admin-nav placeholder (pinned, margin all around)
//        → scrollable body: white content panel (hairline + faint shadow)
//           → white metric cards (hairline, no shadow)
//
// The shell fills the viewport; only the body scrolls (single scrollbar); the
// nav region stays pinned. Sizing uses min-h / flex, never fixed heights.
// ---------------------------------------------------------------------------

function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex h-screen w-full flex-col bg-[oklch(0.22_0.01_60)] p-3 sm:p-5'>
            <div className='mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-[2rem] bg-muted'>
                {/* Admin nav — owned by AdminAppShell; a muted sticky placeholder here */}
                <div className='shrink-0 p-3 sm:p-4'>
                    <AdminNavPlaceholder />
                </div>

                {/* Scrollable body — the only scroll region */}
                <div className='min-h-0 flex-1 overflow-y-auto px-3 pb-3 sm:px-4 sm:pb-4'>
                    {/* Content panel — a surface level, not a floating panel: hairline only,
                        NO shadow (theme §4 reserves the soft shadow for floating panels). */}
                    <div className='rounded-3xl border bg-card p-6 sm:p-10'>
                        {/* Dashboard header — the surface's own heading (H1 + date) */}
                        <div className='mb-8 flex items-center gap-3'>
                            <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground text-background'>
                                <LayoutDashboard className='h-5 w-5' aria-hidden />
                            </span>
                            <div>
                                <h1 className='text-2xl font-bold tracking-tight text-foreground'>Dashboard</h1>
                                <p className='mt-0.5 text-sm text-muted-foreground'>
                                    Operational overview for {TODAY_LABEL}
                                </p>
                            </div>
                        </div>

                        <div className='space-y-8'>{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Meta + stories
// ---------------------------------------------------------------------------

const meta = {
    title: 'Surfaces/Sprint 11/Admin Dashboard',
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
} satisfies Meta<{ variant: string }>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default — the full dashboard on-theme: the sticky admin-nav placeholder pinned above
 * a scrollable body, today's-sales metric cards (revenue in crimson), the
 * status-bearing "orders by status" cluster (each state carries a consistent
 * colour AND a word label), and revenue-over-time with a word-based granularity
 * toggle. Every cluster is a large-radius card with a clear eyebrow → heading →
 * body hierarchy.
 */
export const Default: Story = {
    name: 'Default — On-Theme Metric Dashboard',
    render: () => (
        <DashboardShell>
            <TodaySalesCluster data={TODAY_SALES} />
            <Separator />
            <OrderStatusCluster data={STATUS_SUMMARY} />
            <Separator />
            <RevenueCluster />
        </DashboardShell>
    ),
};

/**
 * Status focus — the order-state cluster on its own, showing that each state is
 * conveyed by a consistent status colour AND a word label together, never by
 * colour alone (theme Do/Don't). Zero-count states still read clearly.
 */
export const StatusFocus: Story = {
    name: 'Status — Order-State Cluster (Colour + Word)',
    render: () => (
        <DashboardShell>
            <OrderStatusCluster data={{ new: 9, inProgress: 5, completed: 0 }} />
        </DashboardShell>
    ),
};

/**
 * Loading — each cluster owns its own boundary; here the sales + status clusters
 * render on-theme skeletons while their data resolves.
 */
export const Loading: Story = {
    name: 'Loading — Cluster Skeletons',
    render: () => (
        <DashboardShell>
            <section>
                <SectionHeader eyebrow='Today' title="Today's sales" />
                <ClusterSkeleton columns={2} />
            </section>
            <Separator />
            <section>
                <SectionHeader eyebrow='Operations' title='Orders by status' />
                <ClusterSkeleton columns={3} />
            </section>
        </DashboardShell>
    ),
};

/**
 * Error — a cluster failed to load. The boundary shows an on-theme error card
 * with a Retry action, while the other clusters keep rendering (independent
 * per-section boundaries, mirroring the source).
 */
export const Error: Story = {
    name: 'Error — Cluster Load Failure',
    render: () => (
        <DashboardShell>
            <TodaySalesCluster data={TODAY_SALES} />
            <Separator />
            <section>
                <SectionHeader eyebrow='Operations' title='Orders by status' />
                <ClusterError
                    title="Couldn't load order status counts"
                    description='We were unable to fetch the order status overview. Please try again.'
                />
            </section>
        </DashboardShell>
    ),
};
