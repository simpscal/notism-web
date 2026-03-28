import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DELIVERY_STATUS } from '../constants';
import { DeliveryStatusEnum } from '../enums';
import type { OrderDeliveryStatusTimingViewModel } from '../models';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import Timeline from '@/components/timeline';

export interface OrderDeliveryStatusTimelineProps {
    deliveryStatus: string;
    deliveryStatusTiming: OrderDeliveryStatusTimingViewModel;
}

function OrderDeliveryStatusTimeline({
    deliveryStatus,
    deliveryStatusTiming: timing,
}: OrderDeliveryStatusTimelineProps) {
    const { t } = useTranslation();
    const currentStepIndex = useMemo(() => {
        const enumValue = deliveryStatus as DeliveryStatusEnum;
        return DELIVERY_STATUS.findIndex(step => step.key === enumValue);
    }, [deliveryStatus]);

    const items = useMemo(
        () =>
            DELIVERY_STATUS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let completedAt: string | null = null;
                if (step.key === DeliveryStatusEnum.Placed) completedAt = timing.orderPlacedCompletedAt;
                if (step.key === DeliveryStatusEnum.Preparing) completedAt = timing.preparingCompletedAt;
                if (step.key === DeliveryStatusEnum.OnTheWay) completedAt = timing.onTheWayCompletedAt;
                if (step.key === DeliveryStatusEnum.Delivered) completedAt = timing.deliveredCompletedAt;

                return {
                    title: t(step.label),
                    icon: step.icon,
                    isCompleted,
                    isCurrent,
                    completedAt,
                };
            }),
        [currentStepIndex, timing, t]
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('orderDetail.deliveryStatus')}</CardTitle>
                <CardDescription>{t('orderDetail.trackYourOrder')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Timeline items={items} />
            </CardContent>
        </Card>
    );
}

export default OrderDeliveryStatusTimeline;
