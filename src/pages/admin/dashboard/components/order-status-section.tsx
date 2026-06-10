import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CircleDot, ClipboardList, Loader, RefreshCw, type LucideIcon } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { adminApi } from '@/apis';
import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/card';
import ErrorState from '@/components/error-state';
import { Skeleton } from '@/components/skeleton';
import type { DashboardOrderStatusSummaryViewModel } from '@/features/admin';

type OrderStatusBucketKey = keyof DashboardOrderStatusSummaryViewModel;

interface OrderStatusBucketMeta {
    key: OrderStatusBucketKey;
    labelKey: string;
    icon: LucideIcon;
    /** Token-driven accent for the card icon chip. */
    accentClass: string;
}

const ORDER_STATUS_BUCKETS: OrderStatusBucketMeta[] = [
    {
        key: 'new',
        labelKey: 'admin.dashboard.orderStatus.statuses.new',
        icon: CircleDot,
        accentClass: 'bg-secondary text-secondary-foreground',
    },
    {
        key: 'inProgress',
        labelKey: 'admin.dashboard.orderStatus.statuses.inProgress',
        icon: Loader,
        accentClass: 'bg-primary/10 text-primary',
    },
    {
        key: 'completed',
        labelKey: 'admin.dashboard.orderStatus.statuses.completed',
        icon: ClipboardList,
        accentClass: 'bg-success/15 text-success',
    },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h2 className='mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{children}</h2>;
}

interface StatusCardProps {
    meta: OrderStatusBucketMeta;
    count: number;
    onSelect: (bucketKey: OrderStatusBucketKey) => void;
}

function StatusCard({ meta, count, onSelect }: StatusCardProps) {
    const { t } = useTranslation();
    const Icon = meta.icon;
    const label = t(meta.labelKey);

    const handleClick = useCallback(() => onSelect(meta.key), [onSelect, meta.key]);

    return (
        <button
            type='button'
            onClick={handleClick}
            className='group block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            aria-label={t('admin.dashboard.orderStatus.cardAriaLabel', { label, count })}
        >
            <Card className='transition-colors group-hover:border-primary/40 group-hover:bg-accent/30'>
                <CardHeader className='flex-row items-center justify-between gap-2 space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium text-muted-foreground'>{label}</CardTitle>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full ${meta.accentClass}`}>
                        <Icon className='h-4 w-4' />
                    </span>
                </CardHeader>
                <CardContent>
                    <p className='text-3xl font-bold tracking-tight text-foreground'>{count.toLocaleString('en-US')}</p>
                    <p className='mt-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100'>
                        {t('admin.dashboard.orderStatus.viewOrders')}
                    </p>
                </CardContent>
            </Card>
        </button>
    );
}

function StatusSkeleton() {
    return (
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

    const handleSelect = useCallback(
        (bucketKey: OrderStatusBucketKey) => {
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
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                    {ORDER_STATUS_BUCKETS.map(meta => (
                        <StatusCard key={meta.key} meta={meta} count={data[meta.key]} onSelect={handleSelect} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default memo(OrderStatusSection);
