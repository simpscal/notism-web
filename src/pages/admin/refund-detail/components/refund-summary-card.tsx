import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { formatVnd } from '@/app/utils';
import { RefundStatusBadge, RefundStatusType } from '@/features/order';
import { Card, CardContent, CardHeader, CardTitle } from '@/uis/card';
import { Separator } from '@/uis/separator';

interface RefundSummaryCardProps {
    id: string;
    orderSlugId: string;
    amount: number;
    status: string;
    createdDate: string;
}

interface SummaryRowProps {
    label: string;
    children: React.ReactNode;
}

function SummaryRow({ label, children }: SummaryRowProps) {
    return (
        <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>{label}</span>
            <span className='font-medium'>{children}</span>
        </div>
    );
}

function RefundSummaryCard({ id, orderSlugId, amount, status, createdDate }: RefundSummaryCardProps) {
    const { t } = useTranslation();

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('admin.refundDetail.summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
                <div className='flex items-center justify-between'>
                    <span className='text-sm text-muted-foreground'>{t('admin.refundDetail.status')}</span>
                    <RefundStatusBadge status={status as RefundStatusType} />
                </div>
                <Separator />
                <SummaryRow label={t('admin.refundDetail.refundId')}>
                    <code className='font-mono text-xs'>{id}</code>
                </SummaryRow>
                <SummaryRow label={t('admin.refundDetail.order')}>
                    {orderSlugId ? (
                        <span className='font-mono text-primary'>#{orderSlugId}</span>
                    ) : (
                        <span className='text-muted-foreground'>—</span>
                    )}
                </SummaryRow>
                <SummaryRow label={t('admin.refundDetail.amount')}>{formatVnd(amount)}</SummaryRow>
                <SummaryRow label={t('admin.refundDetail.created')}>{createdDate}</SummaryRow>
            </CardContent>
        </Card>
    );
}

export default memo(RefundSummaryCard);
