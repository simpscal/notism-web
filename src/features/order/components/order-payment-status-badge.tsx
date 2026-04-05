import { memo } from 'react';

import { Badge } from '@/components/badge';
import { PaymentStatusEnum } from '@/features/payment';

interface OrderPaymentStatusBadgeProps {
    paymentStatus: string;
}

function OrderPaymentStatusBadge({ paymentStatus }: OrderPaymentStatusBadgeProps) {
    if (paymentStatus === PaymentStatusEnum.Paid) {
        return <Badge variant='success'>Paid</Badge>;
    }

    return <Badge variant='secondary'>Pending Payment</Badge>;
}

export default memo(OrderPaymentStatusBadge);
