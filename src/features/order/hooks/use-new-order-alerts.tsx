import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import NewOrderAlertToast from '../components/new-order-alert-toast';
import { type SharedNotification, PaymentNotificationType } from '../notification-signalr';

import { useNotifications, type PaymentSignalRStatus } from './use-notifications';

import { ROUTES } from '@/app/constants';
import { formatVnd } from '@/app/utils';

export interface UseNewOrderAlertsResult {
    status: PaymentSignalRStatus;
}

/**
 * Dashboard-scoped live new-order alerts (story #274). Subscribes to the shared
 * PaymentHub channel while the admin dashboard is mounted and surfaces a distinct,
 * persistent Sonner alert per `order-placed` push — keyed by order id so concurrent
 * orders never collapse and each is individually dismissable. Unmounting the
 * dashboard tears down the subscription, so no alert appears while it is closed.
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
            if (payload.type !== PaymentNotificationType.OrderPlaced) {
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
