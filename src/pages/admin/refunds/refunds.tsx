import { RotateCcw } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AdminRefundsTable from './components/admin-refunds-table';

import { ROUTES } from '@/app/constants';
import { RefundStatusEnum } from '@/features/order';
import { Tabs, TabsList, TabsTrigger } from '@/uis/tabs';

const STATUS_FILTER_ALL = 'all';

const STATUS_FILTERS: { key: string; label: string }[] = [
    { key: STATUS_FILTER_ALL, label: 'common.all' },
    { key: RefundStatusEnum.Pending, label: 'order.refund.statuses.pending' },
    { key: RefundStatusEnum.Paid, label: 'order.refund.statuses.paid' },
    { key: RefundStatusEnum.Failed, label: 'order.refund.statuses.failed' },
];

function AdminRefunds() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>(STATUS_FILTER_ALL);

    const handleStatusFilterChange = useCallback((value: string) => {
        setStatusFilter(value);
    }, []);

    const handleRefundClick = useCallback(
        (id: string) => {
            navigate(`/${ROUTES.ADMIN.REFUND_DETAIL(id)}`);
        },
        [navigate]
    );

    const statusParam = statusFilter === STATUS_FILTER_ALL ? undefined : statusFilter;

    return (
        <div className='flex flex-col h-full'>
            <div className='px-4 py-6 w-full'>
                <div className='mb-6 flex items-center gap-2.5'>
                    <RotateCcw className='h-6 w-6 text-primary' />
                    <div>
                        <h1 className='text-2xl font-bold'>{t('admin.refunds.title')}</h1>
                        <p className='mt-0.5 text-sm text-muted-foreground'>{t('admin.refunds.subtitle')}</p>
                    </div>
                </div>

                <Tabs value={statusFilter} onValueChange={handleStatusFilterChange}>
                    <TabsList>
                        {STATUS_FILTERS.map(filter => (
                            <TabsTrigger key={filter.key} value={filter.key}>
                                {t(filter.label)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>

            <div className='container mx-auto px-4 pb-6 min-h-0 flex-1'>
                <AdminRefundsTable status={statusParam} onRefundClick={handleRefundClick} />
            </div>
        </div>
    );
}

export default memo(AdminRefunds);
