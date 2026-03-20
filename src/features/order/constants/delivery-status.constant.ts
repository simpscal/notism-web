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
        colorClass: 'bg-secondary text-secondary-foreground border-secondary/50',
    },
    {
        key: DeliveryStatusEnum.Preparing,
        label: 'Preparing',
        icon: Package,
        colorClass: 'bg-primary/10 text-primary border-primary/20',
    },
    {
        key: DeliveryStatusEnum.OnTheWay,
        label: 'On the Way',
        icon: Truck,
        colorClass: 'bg-accent/10 text-accent-foreground border-accent/20',
    },
    {
        key: DeliveryStatusEnum.Delivered,
        label: 'Delivered',
        icon: CheckCircle2,
        colorClass: 'bg-success/15 text-success border-success/25',
    },
];
