import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { DeliveryStatusEnum } from '../enums';

import { Badge, type BadgeProps } from '@/components/badge';

interface OrderDeliveryStatusBadgeProps {
    status: DeliveryStatusEnum;
}

interface DeliveryStatusMeta {
    label: string;
    variant: BadgeProps['variant'];
}

const STATUS_META: Record<DeliveryStatusEnum, DeliveryStatusMeta> = {
    [DeliveryStatusEnum.Placed]: { label: 'order.deliveryStatuses.orderPlaced', variant: 'secondary' },
    [DeliveryStatusEnum.Preparing]: { label: 'order.deliveryStatuses.preparing', variant: 'warning' },
    [DeliveryStatusEnum.OnTheWay]: { label: 'order.deliveryStatuses.onTheWay', variant: 'warning' },
    [DeliveryStatusEnum.Delivered]: { label: 'order.deliveryStatuses.delivered', variant: 'success' },
};

function OrderDeliveryStatusBadge({ status }: OrderDeliveryStatusBadgeProps) {
    const { t } = useTranslation();

    const meta = STATUS_META[status];

    if (!meta) {
        return <Badge variant='secondary'>{status}</Badge>;
    }

    return <Badge variant={meta.variant}>{t(meta.label)}</Badge>;
}

export default memo(OrderDeliveryStatusBadge);
