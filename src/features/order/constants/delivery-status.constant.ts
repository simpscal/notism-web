import { CheckCircle2, Package, Truck, type LucideIcon } from 'lucide-react';

import { DeliveryStatusEnum } from '../enums';

export interface DeliveryStatusConfig {
    key: DeliveryStatusEnum;
    label: string;
    icon: LucideIcon;
    colorClass: string;
}

export const DELIVERY_STATUS: DeliveryStatusConfig[] = [
    {
        key: DeliveryStatusEnum.Placed,
        label: 'Order Placed',
        icon: CheckCircle2,
        colorClass: 'bg-blue-500 text-white border-blue-600',
    },
    {
        key: DeliveryStatusEnum.Preparing,
        label: 'Preparing',
        icon: Package,
        colorClass: 'bg-teal-500 text-white border-teal-600',
    },
    {
        key: DeliveryStatusEnum.OnTheWay,
        label: 'On the Way',
        icon: Truck,
        colorClass: 'bg-purple-500 text-white border-purple-600',
    },
    {
        key: DeliveryStatusEnum.Delivered,
        label: 'Delivered',
        icon: CheckCircle2,
        colorClass: 'bg-green-500 text-white border-green-600',
    },
];
