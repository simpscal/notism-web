import { useQuery } from '@tanstack/react-query';
import { AlertCircle, DollarSign, Receipt, RefreshCw, type LucideIcon } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { adminApi } from '@/apis';
import { formatVnd } from '@/app/utils/currency.utils';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import ErrorState from '@/components/error-state';
import { Skeleton } from '@/components/skeleton';

function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h2 className='mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{children}</h2>;
}

interface MetricCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    sublabel: string;
}

function MetricCard({ icon: Icon, label, value, sublabel }: MetricCardProps) {
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

function MetricsSkeleton() {
    return (
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

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin', 'dashboard', 'today-sales'] as const,
        queryFn: () => adminApi.getDashboardTodaySales(),
    });

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <section className='mb-8'>
            <SectionHeading>{t('admin.dashboard.todaySales.heading')}</SectionHeading>

            {isLoading ? (
                <MetricsSkeleton />
            ) : isError || !data ? (
                <MetricsError onRetry={handleRetry} />
            ) : (
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    <MetricCard
                        icon={DollarSign}
                        label={t('admin.dashboard.todaySales.revenueLabel')}
                        value={formatVnd(data.revenue)}
                        sublabel={
                            data.revenue === 0
                                ? t('admin.dashboard.todaySales.revenueSublabelZero')
                                : t('admin.dashboard.todaySales.revenueSublabel')
                        }
                    />
                    <MetricCard
                        icon={Receipt}
                        label={t('admin.dashboard.todaySales.ordersLabel')}
                        value={data.orderCount.toLocaleString('en-US')}
                        sublabel={
                            data.orderCount === 0
                                ? t('admin.dashboard.todaySales.ordersSublabelZero')
                                : t('admin.dashboard.todaySales.ordersSublabel')
                        }
                    />
                </div>
            )}
        </section>
    );
}

export default memo(TodaySalesSection);
