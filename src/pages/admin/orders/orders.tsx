import { Grid3x3, LayoutGrid } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import AdminOrdersKanban from './components/admin-orders-kanban';
import AdminOrdersTable from './components/admin-orders-table';

import { ROUTES } from '@/app/constants';
import { DeliveryStatusType, PaymentStatusType } from '@/features/order';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/uis/select';
import { ToggleGroup, ToggleGroupItem } from '@/uis/toggle-group';

type ViewMode = 'kanban' | 'grid';

const PAYMENT_STATUS_ALL = 'all';

/** Maps a status bucket key to the delivery statuses it covers in the kanban. */
const STATUS_BUCKET_TO_DELIVERY_STATUSES: Record<string, DeliveryStatusType[]> = {
    new: [DeliveryStatusType.Placed],
    inProgress: [DeliveryStatusType.Preparing, DeliveryStatusType.OnTheWay],
    completed: [DeliveryStatusType.Delivered],
};

function AdminOrders() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const statusBucket = searchParams.get('status');
    const highlightedStatuses = useMemo(
        () => (statusBucket ? (STATUS_BUCKET_TO_DELIVERY_STATUSES[statusBucket] ?? []) : []),
        [statusBucket]
    );
    // A status bucket in the URL targets delivery-status columns, so default to the kanban view.
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

    const handleViewModeChange = useCallback((value: string) => {
        if (value) {
            setViewMode(value as ViewMode);
        }
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
                                <SelectItem value={PAYMENT_STATUS_ALL}>{t('common.all')}</SelectItem>
                                <SelectItem value={PaymentStatusType.Paid}>{t('payment.statuses.paid')}</SelectItem>
                                <SelectItem value={PaymentStatusType.Unpaid}>{t('payment.statuses.unpaid')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <ToggleGroup type='single' value={viewMode} onValueChange={handleViewModeChange}>
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
                    <AdminOrdersKanban
                        onOrderClick={handleOrderClick}
                        paymentStatus={paymentStatusParam}
                        highlightedStatuses={highlightedStatuses}
                    />
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
