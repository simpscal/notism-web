import { LayoutDashboard } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import OrderStatusSection from './components/order-status-section';

function formatTodayLabel(): string {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Dashboard() {
    const { t } = useTranslation();

    return (
        <div className='mx-auto w-full max-w-7xl px-6 py-8'>
            {/* Page header */}
            <div className='mb-8 flex items-center gap-2.5'>
                <LayoutDashboard className='h-6 w-6 text-primary' />
                <div>
                    <h1 className='text-2xl font-bold text-foreground'>{t('admin.dashboard.title')}</h1>
                    <p className='mt-0.5 text-sm text-muted-foreground'>
                        {t('admin.dashboard.subtitle', { date: formatTodayLabel() })}
                    </p>
                </div>
            </div>

            {/* Sections container — story #220's "Today's sales" metrics section slots here, above the
                status section (followed by a Separator). For this story we render only the status overview. */}
            <OrderStatusSection />
        </div>
    );
}

export default memo(Dashboard);
