import { ExternalLink, ShoppingBag } from 'lucide-react';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Badge } from '@/uis/badge';
import { Button } from '@/uis/button';
import { Toast } from '@/uis/toast';

export interface NewOrderAlertData {
    /** Stable order id — used as the toast id so each order alert is distinct. */
    orderId: string;
    /** Customer-facing order number (the order slug) shown in the alert and used to open the order detail. */
    orderNumber: string;
    /** Time the order was placed, shown in the alert. */
    placedAt: string;
    /** Item count — light triage context. */
    itemCount: number;
    /** Order total, formatted for display. */
    total: string;
}

interface NewOrderAlertToastProps {
    order: NewOrderAlertData;
    /** Sonner toast id this card belongs to — used to dismiss it on view/close. */
    toastId: string | number;
    onViewOrder: (slugId: string) => void;
}

/**
 * New-order alert card bound to a Sonner toast. Owns the dismiss wiring (view →
 * navigate + dismiss, close → dismiss). Rendered inside `toast.custom(...)`.
 */
function NewOrderAlertToast({ order, toastId, onViewOrder }: NewOrderAlertToastProps) {
    const { t } = useTranslation();

    const handleViewOrder = useCallback(() => {
        onViewOrder(order.orderNumber);
        toast.dismiss(toastId);
    }, [onViewOrder, order.orderNumber, toastId]);

    const handleDismiss = useCallback(() => toast.dismiss(toastId), [toastId]);

    return (
        <Toast
            className='border-primary/30'
            dismissLabel={t('order.newOrderAlert.dismiss')}
            onDismiss={handleDismiss}
            icon={
                <span className='flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary'>
                    <ShoppingBag className='h-4 w-4' aria-hidden />
                </span>
            }
        >
            <div className='flex items-center gap-2'>
                <span className='text-sm font-semibold text-popover-foreground'>{t('order.newOrderAlert.title')}</span>
                <Badge variant='success' className='px-1.5 py-0 text-[10px] uppercase tracking-wide'>
                    {t('order.newOrderAlert.liveBadge')}
                </Badge>
            </div>
            <p className='mt-1 truncate font-mono text-sm font-semibold tracking-tight text-foreground'>
                {order.orderNumber}
            </p>
            <p className='mt-0.5 text-xs text-muted-foreground'>
                {t('order.newOrderAlert.meta', {
                    placedAt: order.placedAt,
                    itemCount: t('order.newOrderAlert.itemCount', { count: order.itemCount }),
                    total: order.total,
                })}
            </p>
            <div className='mt-3'>
                <Button size='sm' variant='outline' className='h-8' onClick={handleViewOrder}>
                    <ExternalLink className='mr-1.5 h-3.5 w-3.5' />
                    {t('order.newOrderAlert.viewOrder')}
                </Button>
            </div>
        </Toast>
    );
}

export default memo(NewOrderAlertToast);
