import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentStatusType } from '@/features/order';
import { Badge } from '@/uis/badge';

interface PaymentStatusBadgeProps {
    paymentStatus: PaymentStatusType;
}

function PaymentStatusBadge({ paymentStatus }: PaymentStatusBadgeProps) {
    const { t } = useTranslation();

    if (paymentStatus === PaymentStatusType.Paid) {
        return <Badge variant='success'>{t('payment.statuses.paid')}</Badge>;
    }

    if (paymentStatus === PaymentStatusType.Failed) {
        return <Badge variant='destructive'>{t('payment.statuses.failed')}</Badge>;
    }

    if (paymentStatus === PaymentStatusType.Refunded) {
        return <Badge variant='warning'>{t('payment.statuses.refunded')}</Badge>;
    }

    return <Badge variant='secondary'>{t('payment.statuses.unpaid')}</Badge>;
}

export default memo(PaymentStatusBadge);
