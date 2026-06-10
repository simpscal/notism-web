import { useQuery } from '@tanstack/react-query';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts';

import { adminApi } from '@/apis';
import { ROUTES } from '@/app/constants';
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
import { Skeleton } from '@/components/skeleton';
import type { DashboardOrderStatusSummaryViewModel } from '@/features/admin';

type OrderStatusBucketKey = keyof DashboardOrderStatusSummaryViewModel;

const ORDER_STATUS_BUCKETS: readonly OrderStatusBucketKey[] = ['new', 'inProgress', 'completed'];

/** Per-status colour tokens, per the design contract. */
const STATUS_CHART_CONFIG = {
    new: { label: 'New', color: 'var(--chart-2)' },
    inProgress: { label: 'In Progress', color: 'var(--chart-4)' },
    completed: { label: 'Completed', color: 'var(--chart-1)' },
} satisfies ChartConfig;

interface StatusDatum {
    key: OrderStatusBucketKey;
    label: string;
    count: number;
    fill: string;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h2 className='mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{children}</h2>;
}

interface StatusChartProps {
    data: StatusDatum[];
    /** Curried factory: returns the click handler for a given status bucket. */
    onSelect: (bucketKey: OrderStatusBucketKey) => () => void;
}

function StatusChart({ data, onSelect }: StatusChartProps) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardContent className='pt-6'>
                <p className='mb-4 text-sm text-muted-foreground'>{t('admin.dashboard.orderStatus.description')}</p>
                <ChartContainer
                    config={STATUS_CHART_CONFIG}
                    role='img'
                    aria-label={t('admin.dashboard.orderStatus.chartAriaLabel')}
                    className='aspect-auto h-[280px] w-full'
                >
                    <BarChart accessibilityLayer data={data} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
                        <XAxis dataKey='label' tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey='key' />} />
                        <ChartLegend content={<ChartLegendContent nameKey='key' />} />
                        <Bar dataKey='count' radius={[6, 6, 0, 0]} minPointSize={3} className='cursor-pointer'>
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
                                    aria-label={t('admin.dashboard.orderStatus.barAriaLabel', {
                                        label: d.label,
                                        count: d.count,
                                    })}
                                    className='cursor-pointer outline-none hover:opacity-80 focus-visible:opacity-80'
                                    onClick={onSelect(d.key)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

function StatusSkeleton() {
    return (
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
    );
}

function StatusError({ onRetry }: { onRetry: () => void }) {
    const { t } = useTranslation();

    return (
        <Card className='border-destructive/30'>
            <CardContent className='py-2'>
                <ErrorState
                    iconSize='sm'
                    icon={<AlertCircle className='h-10 w-10 text-destructive' />}
                    title={t('admin.dashboard.orderStatus.errorTitle')}
                    description={t('admin.dashboard.orderStatus.errorDescription')}
                    action={
                        <Button variant='outline' onClick={onRetry}>
                            <RefreshCw className='mr-2 h-4 w-4' />
                            {t('admin.dashboard.orderStatus.retry')}
                        </Button>
                    }
                />
            </CardContent>
        </Card>
    );
}

function OrderStatusSection() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin', 'dashboard', 'order-status-summary'] as const,
        queryFn: () => adminApi.getDashboardOrderStatusSummary(),
    });

    const chartData = useMemo<StatusDatum[]>(() => {
        if (!data) {
            return [];
        }

        return ORDER_STATUS_BUCKETS.map(key => ({
            key,
            label: t(`admin.dashboard.orderStatus.statuses.${key}`),
            count: data[key],
            fill: `var(--color-${key})`,
        }));
    }, [data, t]);

    const handleSelect = useCallback(
        (bucketKey: OrderStatusBucketKey) => () => {
            navigate(`/${ROUTES.ADMIN.ORDERS}?status=${bucketKey}`);
        },
        [navigate]
    );

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <section>
            <SectionHeading>{t('admin.dashboard.orderStatus.heading')}</SectionHeading>

            {isLoading ? (
                <StatusSkeleton />
            ) : isError || !data ? (
                <StatusError onRetry={handleRetry} />
            ) : (
                <StatusChart data={chartData} onSelect={handleSelect} />
            )}
        </section>
    );
}

export default memo(OrderStatusSection);
