import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/badge';
import { PaymentStatusEnum } from '@/features/payment';

interface PaymentStatusBadgeProps {
    paymentStatus: PaymentStatusEnum;
}

function PaymentStatusBadge({ paymentStatus }: PaymentStatusBadgeProps) {
    const { t } = useTranslation();

    if (paymentStatus === PaymentStatusEnum.Paid) {
        return <Badge variant='success'>{t('order.paymentStatuses.paid')}</Badge>;
    }

    if (paymentStatus === PaymentStatusEnum.Failed) {
        return <Badge variant='destructive'>{t('order.paymentStatuses.failed')}</Badge>;
    }

    return <Badge variant='secondary'>{t('order.paymentStatuses.unpaid')}</Badge>;
}

export default memo(PaymentStatusBadge);
