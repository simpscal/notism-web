import { PaymentStatusType } from '../types';

export interface PaymentStatusOption {
    key: PaymentStatusType;
    label: string;
}

export const PAYMENT_STATUS_OPTIONS: PaymentStatusOption[] = [
    { key: PaymentStatusType.Paid, label: 'payment.statuses.paid' },
    { key: PaymentStatusType.Unpaid, label: 'payment.statuses.unpaid' },
    { key: PaymentStatusType.Failed, label: 'payment.statuses.failed' },
    { key: PaymentStatusType.Refunded, label: 'payment.statuses.refunded' },
];
