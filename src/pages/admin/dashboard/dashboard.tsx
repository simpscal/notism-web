import { LayoutDashboard } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import OrderStatusSection from './components/order-status-section';
import TodaySalesSection from './components/today-sales-section';

import { Separator } from '@/components/separator';

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

            {/* Sections container — the "Today's sales" metrics section sits above the status section,
                separated by a divider. Each section owns its own loading/error boundary independently. */}
            <TodaySalesSection />
            <Separator className='mb-8' />
            <OrderStatusSection />
        </div>
    );
}

export default memo(Dashboard);
