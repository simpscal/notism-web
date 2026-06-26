import { describe, expect, it } from 'vitest';

import { NotificationType, type NewOrderNotificationPayload, type SharedNotification } from '../notification-signalr';

describe('SharedNotification narrowing', () => {
    it('narrows an order-placed payload by type to NewOrderNotificationPayload', () => {
        const notification: SharedNotification = {
            type: NotificationType.OrderPlaced,
            orderId: 'order-id',
            orderNumber: 'ORD-2026-001',
            placedAt: '2026-06-25T10:00:00.000Z',
            total: 320_000,
            itemCount: 3,
            timestamp: '2026-06-25T10:00:00.000Z',
        };

        expect(notification.type).toBe('order-placed');

        if (notification.type === NotificationType.OrderPlaced) {
            // Within this branch the payload narrows to NewOrderNotificationPayload,
            // so the order-specific fields are accessible without a cast.
            const order: NewOrderNotificationPayload = notification;

            expect(order.orderNumber).toBe('ORD-2026-001');
            expect(order.total).toBe(320_000);
            expect(order.itemCount).toBe(3);
            expect(order.placedAt).toBe('2026-06-25T10:00:00.000Z');
        } else {
            throw new Error('order-placed payload should narrow by type');
        }
    });

    it('keeps existing payment and refund payloads narrowable alongside order-placed', () => {
        const notifications: SharedNotification[] = [
            {
                type: NotificationType.Success,
                orderId: 'order-id',
                slugId: 'ORD-ABC123',
                message: 'Payment succeeded',
                timestamp: '2026-06-25T10:00:00.000Z',
            },
            {
                type: NotificationType.RefundStatusChanged,
                refundId: 'refund-id',
                status: 'paid',
                timestamp: '2026-06-25T10:00:00.000Z',
            },
            {
                type: NotificationType.OrderPlaced,
                orderId: 'order-id',
                orderNumber: 'ORD-2026-002',
                placedAt: '2026-06-25T10:00:00.000Z',
                total: 100_000,
                itemCount: 1,
                timestamp: '2026-06-25T10:00:00.000Z',
            },
        ];

        const orderPlaced = notifications.filter(n => n.type === NotificationType.OrderPlaced);

        expect(orderPlaced).toHaveLength(1);
        expect(orderPlaced[0].orderNumber).toBe('ORD-2026-002');
    });
});
