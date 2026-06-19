import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/badge';
import { PaymentStatusEnum } from '@/features/order';

interface PaymentStatusBadgeProps {
    paymentStatus: PaymentStatusEnum;
}

function PaymentStatusBadge({ paymentStatus }: PaymentStatusBadgeProps) {
    const { t } = useTranslation();

    if (paymentStatus === PaymentStatusEnum.Paid) {
        return <Badge variant='success'>{t('payment.statuses.paid')}</Badge>;
    }

    if (paymentStatus === PaymentStatusEnum.Failed) {
        return <Badge variant='destructive'>{t('payment.statuses.failed')}</Badge>;
    }

    if (paymentStatus === PaymentStatusEnum.Refunded) {
        return <Badge variant='warning'>{t('payment.statuses.refunded')}</Badge>;
    }

    return <Badge variant='secondary'>{t('payment.statuses.unpaid')}</Badge>;
}

export default memo(PaymentStatusBadge);
