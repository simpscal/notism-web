import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { adminApi } from '@/apis';
import { PAGE_SIZE, ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import { Button } from '@/components/button';
import ErrorState from '@/components/error-state';
import { Skeleton } from '@/components/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TablePagination, TableRow } from '@/components/table';
import { REFUND_QUERY_KEYS, RefundStatusBadge, RefundStatusEnum } from '@/features/order';

const EMPTY_STATE_COL_SPAN = 7;
const SKELETON_ROWS = [1, 2, 3, 4, 5];

interface AdminRefundsTableProps {
    onRefundClick: (id: string) => void;
    status?: string;
}

function formatDateTime(value: string, language: string): string {
    return new Date(value).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function AdminRefundsTable({ onRefundClick, status }: AdminRefundsTableProps) {
    const { t, i18n } = useTranslation();
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [status]);

    const {
        data: refundsData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: [...REFUND_QUERY_KEYS.adminList(), { page, pageSize: PAGE_SIZE, status }] as const,
        queryFn: () =>
            adminApi.getRefunds({
                status,
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
        placeholderData: keepPreviousData,
    });

    const refunds = refundsData?.items || [];
    const totalCount = refundsData?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const handleViewClick = useCallback(
        (id: string) => () => {
            onRefundClick(id);
        },
        [onRefundClick]
    );

    const handleRetry = useCallback(() => {
        refetch();
    }, [refetch]);

    if (isLoading) {
        return (
            <div className='rounded-md border' data-testid='admin-refunds-skeleton'>
                <div className='space-y-3 p-4'>
                    {SKELETON_ROWS.map(row => (
                        <div key={row} className='flex items-center gap-4'>
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
        );
    }

    if (isError) {
        return (
            <div className='rounded-md border'>
                <ErrorState
                    className='py-16'
                    iconSize='sm'
                    title={t('admin.refunds.failedToLoad')}
                    description={t('common.tryAgainLater')}
                    action={
                        <Button variant='outline' onClick={handleRetry}>
                            {t('common.retry')}
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='rounded-md border overflow-auto flex-1 min-h-0 flex flex-col'>
                <Table className={refunds.length === 0 ? 'h-full' : undefined}>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='min-w-[110px]'>{t('admin.refunds.order')}</TableHead>
                            <TableHead className='min-w-[120px]'>{t('admin.refunds.amount')}</TableHead>
                            <TableHead className='min-w-[120px]'>{t('admin.refunds.status')}</TableHead>
                            <TableHead className='min-w-[200px]'>{t('admin.refunds.transferReference')}</TableHead>
                            <TableHead className='min-w-[150px]'>{t('admin.refunds.created')}</TableHead>
                            <TableHead className='min-w-[150px]'>{t('admin.refunds.paid')}</TableHead>
                            <TableHead className='min-w-[80px] text-right'>{t('admin.refunds.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className={refunds.length === 0 ? 'h-full' : undefined}>
                        {refunds.length > 0 ? (
                            refunds.map(refund => (
                                <TableRow key={refund.id}>
                                    <TableCell className='font-medium'>
                                        {refund.orderSlugId ? (
                                            <Link
                                                to={`/${ROUTES.ADMIN.ORDER_DETAIL(refund.orderSlugId)}`}
                                                className='font-mono text-primary underline-offset-4 hover:underline'
                                            >
                                                #{refund.orderSlugId}
                                            </Link>
                                        ) : (
                                            <span className='text-muted-foreground'>—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className='font-semibold'>{formatVnd(refund.amount)}</TableCell>
                                    <TableCell>
                                        <RefundStatusBadge status={refund.status as RefundStatusEnum} />
                                    </TableCell>
                                    <TableCell>
                                        {refund.transferReference ? (
                                            <code className='font-mono text-xs'>{refund.transferReference}</code>
                                        ) : (
                                            <span className='text-muted-foreground'>—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className='text-sm text-muted-foreground'>
                                        {formatDateTime(refund.createdAt, i18n.language)}
                                    </TableCell>
                                    <TableCell className='text-sm text-muted-foreground'>
                                        {refund.paidAt ? (
                                            formatDateTime(refund.paidAt, i18n.language)
                                        ) : (
                                            <span className='text-muted-foreground'>—</span>
                                        )}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Button
                                            variant='ghost'
                                            size='icon-sm'
                                            className='h-8 w-8'
                                            aria-label={t('admin.refunds.viewRefund')}
                                            onClick={handleViewClick(refund.id)}
                                        >
                                            <Eye className='h-4 w-4' />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={EMPTY_STATE_COL_SPAN}
                                    className='py-10 text-center text-muted-foreground'
                                >
                                    {t('admin.refunds.empty')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <TablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

export default memo(AdminRefundsTable);
