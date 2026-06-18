import { describe, expect, it } from 'vitest';

import { DeliveryStatusEnum } from '../../enums/delivery-status.enum';
import { PaymentMethodEnum } from '../../enums/payment-method.enum';
import { shouldShowRefundRequest } from '../refund.utils';

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
