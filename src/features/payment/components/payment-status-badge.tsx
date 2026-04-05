import { memo } from 'react';

import { Badge } from '@/components/badge';
import { PaymentStatusEnum } from '@/features/payment';

interface PaymentStatusBadgeProps {
    paymentStatus: PaymentStatusEnum;
}

function PaymentStatusBadge({ paymentStatus }: PaymentStatusBadgeProps) {
    if (paymentStatus === PaymentStatusEnum.Paid) {
        return <Badge variant='success'>Paid</Badge>;
    }

    return <Badge variant='secondary'>Pending Payment</Badge>;
}

export default memo(PaymentStatusBadge);
