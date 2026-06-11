import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

import { adminApi } from '@/apis';
import { formatVnd } from '@/app/utils/currency.utils';
import { Button } from '@/components/button';
import { Card, CardContent } from '@/components/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/chart';
import ErrorState from '@/components/error-state';
import { Skeleton } from '@/components/skeleton';
import { getTodayWindowUtc } from '@/pages/admin/dashboard/utils';

function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h2 className='mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{children}</h2>;
}

interface SalesGaugeProps {
    config: ChartConfig;
    name: string;
    value: number;
    displayValue: string;
    color: string;
    accessibleName: string;
}

/**
 * A single figure rendered as its own bar gauge on its own scale, with the
 * exact formatted value shown as text. Revenue (VND) and order count carry
 * different units, so they are never plotted on a shared axis.
 */
function SalesGauge({ config, name, value, displayValue, color, accessibleName }: SalesGaugeProps) {
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

const REVENUE_CHART_CONFIG = {
    revenue: { label: "Today's revenue", color: 'var(--chart-1)' },
} satisfies ChartConfig;

const ORDERS_CHART_CONFIG = {
    orders: { label: "Today's orders", color: 'var(--chart-2)' },
} satisfies ChartConfig;

function MetricsSkeleton() {
    return (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {[0, 1].map(i => (
                <Card key={i}>
                    <CardContent className='pt-6'>
                        <div className='flex items-baseline justify-between gap-2'>
                            <Skeleton className='h-4 w-28' />
                            <Skeleton className='h-7 w-32' />
                        </div>
                        <Skeleton className='mt-3 h-16 w-full rounded-md' />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function MetricsError({ onRetry }: { onRetry: () => void }) {
    const { t } = useTranslation();

    return (
        <Card className='border-destructive/30'>
            <CardContent className='py-2'>
                <ErrorState
                    iconSize='sm'
                    icon={<AlertCircle className='h-10 w-10 text-destructive' />}
                    title={t('admin.dashboard.todaySales.errorTitle')}
                    description={t('admin.dashboard.todaySales.errorDescription')}
                    action={
                        <Button variant='outline' onClick={onRetry}>
                            <RefreshCw className='mr-2 h-4 w-4' />
                            {t('admin.dashboard.todaySales.retry')}
                        </Button>
                    }
                />
            </CardContent>
        </Card>
    );
}

function TodaySalesSection() {
    const { t } = useTranslation();

    // The client owns timezone conversion: compute today's local window once and
    // send it to the now-timezone-agnostic backend as UTC instants.
    const { startUtc, endUtc } = useMemo(() => getTodayWindowUtc(), []);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin', 'dashboard', 'today-sales', startUtc, endUtc] as const,
        queryFn: () => adminApi.getDashboardTodaySales({ startUtc, endUtc }),
    });

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    const revenueLabel = t('admin.dashboard.todaySales.revenueLabel');
    const ordersLabel = t('admin.dashboard.todaySales.ordersLabel');

    let body: React.ReactNode;

    if (isLoading) {
        body = <MetricsSkeleton />;
    } else if (isError || !data) {
        body = <MetricsError onRetry={handleRetry} />;
    } else {
        const revenueDisplay = formatVnd(data.revenue);
        const ordersDisplay = data.orderCount.toLocaleString('en-US');

        body = (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <SalesGauge
                    config={REVENUE_CHART_CONFIG}
                    name={revenueLabel}
                    value={data.revenue}
                    displayValue={revenueDisplay}
                    color='var(--chart-1)'
                    accessibleName={t('admin.dashboard.todaySales.revenueAriaLabel', {
                        value: revenueDisplay,
                    })}
                />
                <SalesGauge
                    config={ORDERS_CHART_CONFIG}
                    name={ordersLabel}
                    value={data.orderCount}
                    displayValue={ordersDisplay}
                    color='var(--chart-2)'
                    accessibleName={t('admin.dashboard.todaySales.ordersAriaLabel', {
                        value: ordersDisplay,
                    })}
                />
            </div>
        );
    }

    return (
        <section className='mb-8'>
            <SectionHeading>{t('admin.dashboard.todaySales.heading')}</SectionHeading>
            {body}
        </section>
    );
}

export default memo(TodaySalesSection);
