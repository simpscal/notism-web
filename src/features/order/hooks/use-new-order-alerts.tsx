import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import NewOrderAlertToast from '../components/new-order-alert-toast';

import { ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';
import {
    NotificationType,
    type SharedNotification,
    useNotifications,
    type NotificationStatus,
} from '@/core/notification';

export interface UseNewOrderAlertsResult {
    status: NotificationStatus;
}

/**
 * Portal-wide live new-order alerts (story #274). Mounted once at the admin portal
 * shell (`AdminLayout`), it subscribes to the shared PaymentHub channel so the live
 * connection persists across navigation and alerts surface on every admin route. It
 * surfaces a distinct, persistent Sonner alert per `order-placed` push — keyed by
 * order id so concurrent orders never collapse and each is individually dismissable.
 * The subscription is torn down only when staff leave the portal entirely (the shell
 * unmounts), so no alert appears while the portal is closed.
 */
export function useNewOrderAlerts(): UseNewOrderAlertsResult {
    const navigate = useNavigate();

    const handleViewOrder = useCallback(
        (slugId: string) => {
            navigate(`/${ROUTES.ADMIN.ORDER_DETAIL(slugId)}`);
        },
        [navigate]
    );

    const handleNotification = useCallback(
        (payload: SharedNotification) => {
            if (payload.type !== NotificationType.OrderPlaced) {
                return;
            }

            const order = {
                orderId: payload.orderId,
                orderNumber: payload.orderNumber,
                placedAt: payload.placedAt,
                itemCount: payload.itemCount,
                total: formatVnd(payload.total),
            };

            toast.custom(id => <NewOrderAlertToast order={order} toastId={id} onViewOrder={handleViewOrder} />, {
                id: order.orderId,
                duration: Infinity,
            });
        },
        [handleViewOrder]
    );

    const { status } = useNotifications({ onNotification: handleNotification });

    return { status };
}
