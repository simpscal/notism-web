import { DeliveryStatusEnum } from '../enums/delivery-status.enum';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { RefundStatusEnum } from '../enums/refund-status.enum';

import { buildSepayQrUrl, toNFormatGuid } from '@/features/payment';

const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;

export { toNFormatGuid } from '@/features/payment';

interface RefundVietQrParams {
    refundId: string;
    bankCode: string;
    accountNumber: string;
    amount: number;
    descriptionSuffix?: string;
}

/**
 * Admin refund VietQR builder (story #251 / #250). Mirrors the inbound VietQR builders
 * but targets SePay's hosted endpoint. `des` LEADS with the N-format refund id as the
 * first `-`-delimited token so the SePay outbound webhook auto-matches the refund.
 */
export function buildRefundVietQrUrl({
    refundId,
    bankCode,
    accountNumber,
    amount,
    descriptionSuffix,
}: RefundVietQrParams): string {
    const refundToken = toNFormatGuid(refundId);
    const des = descriptionSuffix ? `${refundToken}-${descriptionSuffix}` : refundToken;

    return buildSepayQrUrl({ bank: bankCode, acc: accountNumber, amount, des });
}

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
