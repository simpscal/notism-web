import { PaymentStatusEnum } from '../enums';

export interface PaymentStatusOption {
    key: PaymentStatusEnum;
    label: string;
}

/**
 * Admin-selectable payment statuses for the order-detail control, in display
 * order. Mirrors the shape of DELIVERY_STATUS used by the delivery-status
 * Select. Refunded is intentionally excluded here (story #236).
 */
export const PAYMENT_STATUS_OPTIONS: PaymentStatusOption[] = [
    { key: PaymentStatusEnum.Paid, label: 'admin.orders.paymentStatus.options.paid' },
    { key: PaymentStatusEnum.Unpaid, label: 'admin.orders.paymentStatus.options.unpaid' },
    { key: PaymentStatusEnum.Failed, label: 'admin.orders.paymentStatus.options.failed' },
];
