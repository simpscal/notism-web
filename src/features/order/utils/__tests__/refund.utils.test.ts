import { describe, expect, it } from 'vitest';

import { DeliveryStatusEnum } from '../../enums/delivery-status.enum';
import { PaymentMethodEnum } from '../../enums/payment-method.enum';
import { buildRefundVietQrUrl, shouldShowRefundRequest } from '../refund.utils';

const REFUND_ID = '3f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8';
const N_FORMAT = '3f1a2b3c4d5e6f708192a3b4c5d6e7f8';

const PAYOUT = {
    refundId: REFUND_ID,
    bankCode: 'VCB',
    accountNumber: '1234567890',
    amount: 250000,
};

describe('buildRefundVietQrUrl', () => {
    it('targets the SePay hosted VietQR endpoint with bank/acc/amount/des params', () => {
        const url = new URL(buildRefundVietQrUrl(PAYOUT));

        expect(`${url.origin}${url.pathname}`).toBe('https://qr.sepay.vn/img');
        expect(url.searchParams.get('bank')).toBe('VCB');
        expect(url.searchParams.get('acc')).toBe('1234567890');
        expect(url.searchParams.get('amount')).toBe('250000');
        expect(url.searchParams.get('des')).not.toBeNull();
    });

    it('leads des with the "N"-format (32-hex, no hyphen) refund id so the first Split("-")[0] token matches', () => {
        const url = new URL(buildRefundVietQrUrl(PAYOUT));
        const des = url.searchParams.get('des') ?? '';

        // Mirror the backend: content.Trim().Split('-')[0] then Guid.TryParseExact(token, "N")
        const token = des.trim().split('-')[0];

        expect(token).toBe(N_FORMAT);
        expect(token).toMatch(/^[0-9a-f]{32}$/);
        expect(token).not.toContain('-');
    });

    it('preserves the N-format token as the first segment even with a suffix appended', () => {
        const url = new URL(buildRefundVietQrUrl({ ...PAYOUT, descriptionSuffix: 'REFUND' }));
        const des = url.searchParams.get('des') ?? '';
        const [token, suffix] = des.split('-');

        expect(token).toBe(N_FORMAT);
        expect(suffix).toBe('REFUND');
    });

    it('normalises an already hyphen-less / mixed-case refund id to lowercase N-format', () => {
        const url = new URL(buildRefundVietQrUrl({ ...PAYOUT, refundId: N_FORMAT.toUpperCase() }));
        const token = (url.searchParams.get('des') ?? '').split('-')[0];

        expect(token).toBe(N_FORMAT);
    });
});

describe('shouldShowRefundRequest', () => {
    const withinWindow = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const beyondWindow = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

    const base = {
        deliveryStatus: DeliveryStatusEnum.Delivered,
        deliveredCompletedAt: withinWindow,
        hasRefund: false,
    };

    it('shows for a delivered bank-transfer order within 24h with no refund', () => {
        expect(shouldShowRefundRequest({ ...base, paymentMethod: PaymentMethodEnum.Banking })).toBe(true);
    });

    it('shows for a delivered cash-on-delivery order within 24h with no refund', () => {
        expect(shouldShowRefundRequest({ ...base, paymentMethod: PaymentMethodEnum.CashOnDelivery })).toBe(true);
    });

    it('hides a cash-on-delivery order beyond the 24h window', () => {
        expect(
            shouldShowRefundRequest({
                ...base,
                paymentMethod: PaymentMethodEnum.CashOnDelivery,
                deliveredCompletedAt: beyondWindow,
            })
        ).toBe(false);
    });

    it('hides for an unknown payment method', () => {
        expect(shouldShowRefundRequest({ ...base, paymentMethod: 'wallet' })).toBe(false);
    });
});
