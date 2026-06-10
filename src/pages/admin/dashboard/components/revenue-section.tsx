import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

import { adminApi } from '@/apis';
import { formatVnd } from '@/app/utils/currency.utils';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/chart';
import ErrorState from '@/components/error-state';
import { Skeleton } from '@/components/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';
import type { DashboardRevenueGranularityViewModel, DashboardRevenuePointViewModel } from '@/features/admin';

const GRANULARITY_ORDER: readonly DashboardRevenueGranularityViewModel[] = ['year', 'month', 'day'];

const DEFAULT_GRANULARITY: DashboardRevenueGranularityViewModel = 'month';

const REVENUE_CHART_CONFIG = {
    revenue: { label: 'Revenue', color: 'var(--chart-1)' },
} satisfies ChartConfig;

/** Compact VND axis tick — e.g. "1.2B ₫", "95M ₫", "0 ₫" — keeps the Y axis legible. */
function formatVndCompact(amount: number): string {
    if (amount === 0) return '0 ₫';
    if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B ₫`;
    if (amount >= 1_000_000) return `${Math.round(amount / 1_000_000)}M ₫`;
    if (amount >= 1_000) return `${Math.round(amount / 1_000)}K ₫`;
    return `${amount} ₫`;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h2 className='mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{children}</h2>;
}

interface RevenueChartProps {
    granularity: DashboardRevenueGranularityViewModel;
    points: DashboardRevenuePointViewModel[];
    onGranularityChange: (granularity: DashboardRevenueGranularityViewModel) => void;
}

function RevenueChart({ granularity, points, onGranularityChange }: RevenueChartProps) {
    const { t } = useTranslation();

    const total = useMemo(() => points.reduce((sum, point) => sum + point.revenue, 0), [points]);
    const totalDisplay = formatVnd(total);
    const rangeLabel = t(`admin.dashboard.revenue.rangeLabel.${granularity}`);

    const handleValueChange = useCallback(
        (value: string) => {
            if (value) {
                onGranularityChange(value as DashboardRevenueGranularityViewModel);
            }
        },
        [onGranularityChange]
    );

    return (
        <Card>
            <CardContent className='pt-6'>
                <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='text-sm text-muted-foreground'>
                            {t('admin.dashboard.revenue.description', { range: rangeLabel })}
                        </p>
                        <p className='mt-1 text-2xl font-bold tracking-tight text-foreground tabular-nums'>
                            {totalDisplay}
                        </p>
                    </div>
                    <ToggleGroup
                        type='single'
                        value={granularity}
                        onValueChange={handleValueChange}
                        variant='outline'
                        size='sm'
                        aria-label={t('admin.dashboard.revenue.granularityAriaLabel')}
                        className='self-start sm:self-auto'
                    >
                        {GRANULARITY_ORDER.map(key => {
                            const label = t(`admin.dashboard.revenue.granularity.${key}`);

                            return (
                                <ToggleGroupItem
                                    key={key}
                                    value={key}
                                    aria-label={t('admin.dashboard.revenue.granularityOptionAriaLabel', { label })}
                                    className='px-3'
                                >
                                    {label}
                                </ToggleGroupItem>
                            );
                        })}
                    </ToggleGroup>
                </div>
                <ChartContainer
                    config={REVENUE_CHART_CONFIG}
                    role='img'
                    aria-label={t('admin.dashboard.revenue.chartAriaLabel', {
                        granularity: t(`admin.dashboard.revenue.granularity.${granularity}`).toLowerCase(),
                        total: totalDisplay,
                    })}
                    className='aspect-auto h-[300px] w-full'
                >
                    <BarChart accessibilityLayer data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                        <XAxis
                            dataKey='period'
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={granularity === 'day' ? 2 : 0}
                            minTickGap={4}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            width={56}
                            tickFormatter={value => formatVndCompact(Number(value))}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    formatter={value => formatVnd(Number(value))}
                                    labelFormatter={label =>
                                        t('admin.dashboard.revenue.tooltipLabel', { label: String(label) })
                                    }
                                />
                            }
                        />
                        <Bar
                            dataKey='revenue'
                            name='Revenue'
                            fill='var(--color-revenue)'
                            radius={[6, 6, 0, 0]}
                            minPointSize={2}
                        >
                            {points.map(point => (
                                <Cell
                                    key={point.period}
                                    aria-label={t('admin.dashboard.revenue.barAriaLabel', {
                                        label: point.period,
                                        value: formatVnd(point.revenue),
                                    })}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function RevenueSkeleton() {
    return (
        <Card>
            <CardContent className='pt-6'>
                <div className='mb-4 flex items-center justify-between'>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-56' />
                        <Skeleton className='h-7 w-40' />
                    </div>
                    {/* Granularity toggle placeholder */}
                    <Skeleton className='h-8 w-44 rounded-md' />
                </div>
                {/* Chart region placeholder */}
                <div className='flex h-[300px] items-end gap-3 px-2'>
                    {['h-1/3', 'h-2/3', 'h-1/2', 'h-3/4', 'h-2/5', 'h-full', 'h-1/4', 'h-3/5'].map((height, index) => (
                        <Skeleton key={index} className={`${height} w-full rounded-md`} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function RevenueError({ onRetry }: { onRetry: () => void }) {
    const { t } = useTranslation();

    return (
        <Card className='border-destructive/30'>
            <CardContent className='py-2'>
                <ErrorState
                    iconSize='sm'
                    icon={<AlertCircle className='h-10 w-10 text-destructive' />}
                    title={t('admin.dashboard.revenue.errorTitle')}
                    description={t('admin.dashboard.revenue.errorDescription')}
                    action={
                        <Button variant='outline' onClick={onRetry}>
                            <RefreshCw className='mr-2 h-4 w-4' />
                            {t('admin.dashboard.revenue.retry')}
                        </Button>
                    }
                />
            </CardContent>
        </Card>
    );
}

function RevenueSection() {
    const { t } = useTranslation();

    const [granularity, setGranularity] = useState<DashboardRevenueGranularityViewModel>(DEFAULT_GRANULARITY);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin', 'dashboard', 'revenue-series', granularity] as const,
        queryFn: () => adminApi.getDashboardRevenueSeries({ granularity }),
    });

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <section>
            <SectionHeading>{t('admin.dashboard.revenue.heading')}</SectionHeading>

            {isLoading ? (
                <RevenueSkeleton />
            ) : isError || !data ? (
                <RevenueError onRetry={handleRetry} />
            ) : (
                <RevenueChart granularity={granularity} points={data.points} onGranularityChange={setGranularity} />
            )}
        </section>
    );
}

export default memo(RevenueSection);
