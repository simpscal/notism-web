import { DeliveryStatusEnum } from '../enums/delivery-status.enum';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { RefundStatusEnum } from '../enums/refund-status.enum';

const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;

interface RefundRequestEligibility {
    paymentMethod: string;
    deliveryStatus: string;
    deliveredCompletedAt: string | null;
    hasRefund: boolean;
}

const REFUND_ELIGIBLE_PAYMENT_METHODS: readonly string[] = [
    PaymentMethodEnum.Banking,
    PaymentMethodEnum.CashOnDelivery,
];

/**
 * Whether the customer "Request refund" action should be shown (story #243).
 * Visible only for a bank-transfer or cash-on-delivery order that is delivered,
 * still within the 24h post-delivery window, and has no refund yet.
 */
export function shouldShowRefundRequest({
    paymentMethod,
    deliveryStatus,
    deliveredCompletedAt,
    hasRefund,
}: RefundRequestEligibility): boolean {
    if (hasRefund) return false;
    if (!REFUND_ELIGIBLE_PAYMENT_METHODS.includes(paymentMethod)) return false;
    if (deliveryStatus !== DeliveryStatusEnum.Delivered) return false;
    if (!deliveredCompletedAt) return false;

    const deliveredAt = new Date(deliveredCompletedAt).getTime();
    if (Number.isNaN(deliveredAt)) return false;

    return Date.now() - deliveredAt <= REFUND_WINDOW_MS;
}

/**
 * Customer-visible refund status. The customer only ever sees Pending or Paid
 * (locked sprint-7 decision) — a Failed/Processing refund reads as Pending.
 */
export function toCustomerRefundStatus(status: string): RefundStatusEnum.Pending | RefundStatusEnum.Paid {
    return status === RefundStatusEnum.Paid ? RefundStatusEnum.Paid : RefundStatusEnum.Pending;
}
