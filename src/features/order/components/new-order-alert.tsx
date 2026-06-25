import { ExternalLink, ShoppingBag } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';

export interface NewOrderAlertData {
    /** Stable order id — used as the toast id so each order alert is distinct. */
    orderId: string;
    /** Customer-facing order number shown in the alert. */
    orderNumber: string;
    /** Time the order was placed, shown in the alert. */
    placedAt: string;
    /** Item count — light triage context. */
    itemCount: number;
    /** Order total, formatted for display. */
    total: string;
}

interface NewOrderAlertProps {
    order: NewOrderAlertData;
    onViewOrder: (orderId: string) => void;
    onDismiss: () => void;
}

function NewOrderAlert({ order, onViewOrder, onDismiss }: NewOrderAlertProps) {
    const { t } = useTranslation();

    const handleViewOrder = useCallback(() => onViewOrder(order.orderId), [onViewOrder, order.orderId]);

    return (
        <div className='flex w-[360px] max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-primary/30 bg-popover p-4 shadow-lg'>
            <span className='mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <ShoppingBag className='h-4 w-4' aria-hidden />
            </span>
            <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm font-semibold text-popover-foreground'>{t('admin.newOrder.title')}</span>
                    <Badge variant='success' className='px-1.5 py-0 text-[10px] uppercase tracking-wide'>
                        {t('admin.newOrder.liveBadge')}
                    </Badge>
                </div>
                <p className='mt-1 truncate font-mono text-sm font-semibold tracking-tight text-foreground'>
                    {order.orderNumber}
                </p>
                <p className='mt-0.5 text-xs text-muted-foreground'>
                    {t('admin.newOrder.meta', {
                        placedAt: order.placedAt,
                        itemCount: t('admin.newOrder.itemCount', { count: order.itemCount }),
                        total: order.total,
                    })}
                </p>
                <div className='mt-3'>
                    <Button size='sm' variant='outline' className='h-8' onClick={handleViewOrder}>
                        <ExternalLink className='mr-1.5 h-3.5 w-3.5' />
                        {t('admin.newOrder.viewOrder')}
                    </Button>
                </div>
            </div>
            <button
                type='button'
                aria-label={t('admin.newOrder.dismiss')}
                onClick={onDismiss}
                className='shrink-0 rounded-md p-1 text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            >
                <span aria-hidden className='text-base leading-none'>
                    &times;
                </span>
            </button>
        </div>
    );
}

export default memo(NewOrderAlert);
