import { LayoutDashboard } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import OrderStatusSection from './components/order-status-section';
import RevenueSection from './components/revenue-section';
import TodaySalesSection from './components/today-sales-section';

import { Separator } from '@/components/separator';
import LiveFeedPill from '@/features/order/components/live-feed-pill';
import { useNewOrderAlerts } from '@/features/order/hooks/use-new-order-alerts';

function formatTodayLabel(): string {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Dashboard() {
    const { t } = useTranslation();

    // Dashboard-scoped live new-order feed (story #274): subscribes while this page
    // is mounted, surfaces a distinct alert per incoming order, and tears down on
    // unmount so no alert appears while the dashboard is closed.
    const { status: liveFeedStatus } = useNewOrderAlerts();

    return (
        <div className='mx-auto w-full max-w-7xl px-6 py-8'>
            {/* Page header */}
            <div className='mb-8 flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-2.5'>
                    <LayoutDashboard className='h-6 w-6 text-primary' />
                    <div>
                        <h1 className='text-2xl font-bold text-foreground'>{t('admin.dashboard.title')}</h1>
                        <p className='mt-0.5 text-sm text-muted-foreground'>
                            {t('admin.dashboard.subtitle', { date: formatTodayLabel() })}
                        </p>
                    </div>
                </div>
                <LiveFeedPill status={liveFeedStatus} />
            </div>

            {/* Sections container — the "Today's sales" metrics section sits above the status section,
                separated by a divider. Each section owns its own loading/error boundary independently. */}
            <TodaySalesSection />
            <Separator className='mb-8' />
            <OrderStatusSection />
            <Separator className='my-8' />
            <RevenueSection />
        </div>
    );
}

export default memo(Dashboard);
