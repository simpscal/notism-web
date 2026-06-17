import { DeliveryStatusEnum } from '../enums/delivery-status.enum';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { RefundStatusEnum } from '../enums/refund-status.enum';

const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;

const SEPAY_QR_BASE_URL = 'https://qr.sepay.vn/img';

interface RefundVietQrParams {
    refundId: string;
    bankCode: string;
    accountNumber: string;
    amount: number;
    descriptionSuffix?: string;
}

/**
 * "N"-format GUID: 32 lowercase hex chars, no hyphens. The SePay outbound webhook
 * matches a refund by `content.Trim().Split('-')[0]` + `Guid.TryParseExact(.., "N")`,
 * so this is the exact token shape the transfer description must lead with (#250).
 */
function toNFormatGuid(refundId: string): string {
    return refundId.replace(/-/g, '').toLowerCase();
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

    const params = new URLSearchParams({
        bank: bankCode,
        acc: accountNumber,
        amount: String(amount),
        des,
    });

    return `${SEPAY_QR_BASE_URL}?${params.toString()}`;
}

interface RefundRequestEligibility {
    paymentMethod: string;
    deliveryStatus: string;
    deliveredCompletedAt: string | null;
    hasRefund: boolean;
}

/**
 * Whether the customer "Request refund" action should be shown (story #243).
 * Visible only for a bank-transfer order that is delivered, still within the 24h
 * post-delivery window, and has no refund yet.
 */
export function shouldShowRefundRequest({
    paymentMethod,
    deliveryStatus,
    deliveredCompletedAt,
    hasRefund,
}: RefundRequestEligibility): boolean {
    if (hasRefund) return false;
    if (paymentMethod !== PaymentMethodEnum.Banking) return false;
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
