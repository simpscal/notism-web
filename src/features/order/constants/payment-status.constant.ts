import { PaymentStatusEnum } from '../enums';

export interface PaymentStatusOption {
    key: PaymentStatusEnum;
    label: string;
}

export const PAYMENT_STATUS_OPTIONS: PaymentStatusOption[] = [
    { key: PaymentStatusEnum.Paid, label: 'payment.statuses.paid' },
    { key: PaymentStatusEnum.Unpaid, label: 'payment.statuses.unpaid' },
    { key: PaymentStatusEnum.Failed, label: 'payment.statuses.failed' },
    { key: PaymentStatusEnum.Refunded, label: 'payment.statuses.refunded' },
];
