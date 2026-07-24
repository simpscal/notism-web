import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DELIVERY_STATUS } from '../constants';
import { DeliveryStatusType } from '../types';

import type { OrderDeliveryStatusTimingModel } from '@/apis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/uis/card';
import Timeline from '@/uis/timeline';

export interface OrderDeliveryStatusTimelineProps {
    deliveryStatus: string;
    deliveryStatusTiming: OrderDeliveryStatusTimingModel;
}

function OrderDeliveryStatusTimeline({
    deliveryStatus,
    deliveryStatusTiming: timing,
}: OrderDeliveryStatusTimelineProps) {
    const { t } = useTranslation();
    const currentStepIndex = useMemo(() => {
        const enumValue = deliveryStatus as DeliveryStatusType;
        return DELIVERY_STATUS.findIndex(step => step.key === enumValue);
    }, [deliveryStatus]);

    const items = useMemo(
        () =>
            DELIVERY_STATUS.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                let completedAt: string | null = null;
                if (step.key === DeliveryStatusType.Placed) completedAt = timing.orderPlacedCompletedAt;
                if (step.key === DeliveryStatusType.Preparing) completedAt = timing.preparingCompletedAt;
                if (step.key === DeliveryStatusType.OnTheWay) completedAt = timing.onTheWayCompletedAt;
                if (step.key === DeliveryStatusType.Delivered) completedAt = timing.deliveredCompletedAt;

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
                <CardTitle>{t('order.deliveryStatus')}</CardTitle>
                <CardDescription>{t('order.trackYourOrder')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Timeline items={items} />
            </CardContent>
        </Card>
    );
}

export default OrderDeliveryStatusTimeline;
