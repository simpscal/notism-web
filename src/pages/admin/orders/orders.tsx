import { Grid3x3, LayoutGrid } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AdminOrdersKanban from './components/admin-orders-kanban';
import AdminOrdersTable from './components/admin-orders-table';

import { ROUTES } from '@/app/constants';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

type ViewMode = 'kanban' | 'grid';

function AdminOrders() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<ViewMode>('kanban');

    const handleOrderClick = useCallback(
        (slugId: string) => {
            navigate(`/${ROUTES.ADMIN.ORDERS}/${slugId}`);
        },
        [navigate]
    );

    return (
        <div className='flex flex-col h-full'>
            <div className='px-4 py-6 w-full'>
                <div className='mb-6 flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold'>{t('admin.orders.title')}</h1>
                        <p className='mt-1 text-sm text-muted-foreground'>{t('admin.orders.subtitle')}</p>
                    </div>
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

            {viewMode === 'kanban' ? (
                <div className='flex-1 overflow-auto min-h-0'>
                    <AdminOrdersKanban onOrderClick={handleOrderClick} />
                </div>
            ) : (
                <div className='container mx-auto px-4 pb-6 min-h-0 flex-1'>
                    <AdminOrdersTable onOrderClick={handleOrderClick} />
                </div>
            )}
        </div>
    );
}

export default memo(AdminOrders);
