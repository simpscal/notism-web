import { memo, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { REFUND_PAID_BANNER_DISMISSED_KEY } from '../constants';

import RefundPaidBanner, { type RefundPaidBannerData } from './refund-paid-banner';

import { ROUTES } from '@/app/constants';
import {
    type PaidRefundNotification,
    type PaymentSharedNotification,
    PaymentNotificationType,
    usePaymentSignalR,
} from '@/features/payment';

function readDismissedIds(): string[] {
    try {
        const stored = localStorage.getItem(REFUND_PAID_BANNER_DISMISSED_KEY);
        const parsed = stored ? (JSON.parse(stored) as unknown) : [];
        return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
        return [];
    }
}

function persistDismissedIds(ids: string[]): void {
    localStorage.setItem(REFUND_PAID_BANNER_DISMISSED_KEY, JSON.stringify(ids));
}

/**
 * Global refund-paid banner stack (story #246). Mounted once in the customer app
 * shell (ClientLayout). Subscribes to the PaymentHub refund-paid push, renders
 * one success Banner per not-yet-dismissed paid refund (newest first), routes to
 * the order on click, and persists dismissals to localStorage so a dismissed
 * refund stays dismissed across reloads and on re-push.
 */
function RefundPaidBannerStack() {
    const navigate = useNavigate();
    const [refunds, setRefunds] = useState<PaidRefundNotification[]>([]);
    const [dismissedIds, setDismissedIds] = useState<string[]>(() => readDismissedIds());

    const handleRefundPaid = useCallback((payload: PaidRefundNotification) => {
        setRefunds(previous => {
            if (previous.some(refund => refund.refundId === payload.refundId)) {
                return previous;
            }
            return [...previous, payload];
        });
    }, []);

    const handleNotification = useCallback(
        (payload: PaymentSharedNotification) => {
            if (payload.type !== PaymentNotificationType.RefundPaid) {
                return;
            }
            handleRefundPaid({
                refundId: payload.refundId,
                orderId: payload.orderId,
                orderRef: payload.orderRef,
                amount: payload.amount,
                sentDate: payload.timestamp,
            });
        },
        [handleRefundPaid]
    );

    usePaymentSignalR({ onNotification: handleNotification });

    const handleOpenOrder = useCallback(
        (orderId: string) => {
            navigate(`/${ROUTES.ORDERS.DETAIL(orderId)}`);
        },
        [navigate]
    );

    const handleDismiss = useCallback((refundId: string) => {
        setDismissedIds(previous => {
            if (previous.includes(refundId)) return previous;
            const next = [...previous, refundId];
            persistDismissedIds(next);
            return next;
        });
    }, []);

    const visibleRefunds = useMemo<RefundPaidBannerData[]>(() => {
        const dismissed = new Set(dismissedIds);
        return refunds
            .filter(refund => !dismissed.has(refund.refundId))
            .map(refund => ({
                refundId: refund.refundId,
                orderId: refund.orderId,
                orderRef: refund.orderRef,
                amount: refund.amount,
                sentDate: refund.sentDate,
            }))
            .reverse();
    }, [refunds, dismissedIds]);

    if (visibleRefunds.length === 0) {
        return null;
    }

    return (
        <div className='sticky top-0 z-[60]' role='status' aria-live='polite'>
            {visibleRefunds.map(refund => (
                <RefundPaidBanner
                    key={refund.refundId}
                    refund={refund}
                    onOpenOrder={handleOpenOrder}
                    onDismiss={handleDismiss}
                />
            ))}
        </div>
    );
}

export default memo(RefundPaidBannerStack);
