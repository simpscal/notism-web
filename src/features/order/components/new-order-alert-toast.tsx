import { memo, useCallback } from 'react';
import { toast } from 'sonner';

import NewOrderAlert, { type NewOrderAlertData } from './new-order-alert';

interface NewOrderAlertToastProps {
    order: NewOrderAlertData;
    /** Sonner toast id this card belongs to — used to dismiss it on view/close. */
    toastId: string | number;
    onViewOrder: (orderId: string) => void;
}

/**
 * Toast-bound wrapper for {@link NewOrderAlert}. Owns the Sonner dismiss wiring
 * (view → navigate + dismiss, close → dismiss) so the presentational card stays
 * free of toast concerns. Rendered inside `toast.custom(...)`.
 */
function NewOrderAlertToast({ order, toastId, onViewOrder }: NewOrderAlertToastProps) {
    const handleViewOrder = useCallback(
        (orderId: string) => {
            onViewOrder(orderId);
            toast.dismiss(toastId);
        },
        [onViewOrder, toastId]
    );

    const handleDismiss = useCallback(() => toast.dismiss(toastId), [toastId]);

    return <NewOrderAlert order={order} onViewOrder={handleViewOrder} onDismiss={handleDismiss} />;
}

export default memo(NewOrderAlertToast);
