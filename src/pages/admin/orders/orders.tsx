import { Grid3x3, LayoutGrid } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AdminOrdersKanban from './components/admin-orders-kanban';
import AdminOrdersTable from './components/admin-orders-table';

import { ROUTES } from '@/app/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';
import { PaymentStatusEnum } from '@/features/payment';

type ViewMode = 'kanban' | 'grid';

const PAYMENT_STATUS_ALL = 'all';

function AdminOrders() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>(PAYMENT_STATUS_ALL);

    const handleOrderClick = useCallback(
        (slugId: string) => {
            navigate(`/${ROUTES.ADMIN.ORDERS}/${slugId}`);
        },
        [navigate]
    );

    const handlePaymentStatusChange = useCallback((value: string) => {
        setPaymentStatusFilter(value);
    }, []);

    const paymentStatusParam = paymentStatusFilter === PAYMENT_STATUS_ALL ? undefined : paymentStatusFilter;

    return (
        <div className='flex flex-col h-full'>
            <div className='px-4 py-6 w-full'>
                <div className='mb-6 flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold'>{t('admin.orders.title')}</h1>
                        <p className='mt-1 text-sm text-muted-foreground'>{t('admin.orders.subtitle')}</p>
                    </div>
                    <div className='flex flex-wrap items-center gap-3'>
                        <Select value={paymentStatusFilter} onValueChange={handlePaymentStatusChange}>
                            <SelectTrigger className='w-[180px] border-input' aria-label='Filter by payment status'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={PAYMENT_STATUS_ALL}>{t('order.paymentStatuses.all')}</SelectItem>
                                <SelectItem value={PaymentStatusEnum.Paid}>
                                    {t('order.paymentStatuses.paid')}
                                </SelectItem>
                                <SelectItem value={PaymentStatusEnum.Unpaid}>
                                    {t('order.paymentStatuses.unpaid')}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <ToggleGroup
                            type='single'
                            value={viewMode}
                            onValueChange={value => value && setViewMode(value as ViewMode)}
                        >
                            <ToggleGroupItem value='kanban' aria-label='Kanban view'>
                                <LayoutGrid className='h-4 w-4' />
                            </ToggleGroupItem>
                            <ToggleGroupItem value='grid' aria-label='Grid view'>
                                <Grid3x3 className='h-4 w-4' />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                <div className='flex-1 overflow-auto min-h-0'>
                    <AdminOrdersKanban onOrderClick={handleOrderClick} paymentStatus={paymentStatusParam} />
                </div>
            ) : (
                <div className='container mx-auto px-4 pb-6 min-h-0 flex-1'>
                    <AdminOrdersTable onOrderClick={handleOrderClick} paymentStatus={paymentStatusParam} />
                </div>
            )}
        </div>
    );
}

export default memo(AdminOrders);
