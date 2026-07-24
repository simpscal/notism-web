import { CheckCircle2, Package, Truck, type LucideIcon } from 'lucide-react';

import { DeliveryStatusType } from '../types';

export interface DeliveryStatusConfig {
    key: DeliveryStatusType;
    label: string;
    icon: LucideIcon;
    colorClass: string;
}

export const DELIVERY_STATUS: DeliveryStatusConfig[] = [
    {
        key: DeliveryStatusType.Placed,
        label: 'order.deliveryStatuses.orderPlaced',
        icon: CheckCircle2,
        colorClass: 'bg-secondary text-secondary-foreground border-secondary/50',
    },
    {
        key: DeliveryStatusType.Preparing,
        label: 'order.deliveryStatuses.preparing',
        icon: Package,
        colorClass: 'bg-primary/10 text-primary border-primary/20',
    },
    {
        key: DeliveryStatusType.OnTheWay,
        label: 'order.deliveryStatuses.onTheWay',
        icon: Truck,
        colorClass: 'bg-accent/10 text-accent-foreground border-accent/20',
    },
    {
        key: DeliveryStatusType.Delivered,
        label: 'order.deliveryStatuses.delivered',
        icon: CheckCircle2,
        colorClass: 'bg-success/15 text-success border-success/25',
    },
];
