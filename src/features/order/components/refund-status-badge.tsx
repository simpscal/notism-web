import { AlertTriangle, CheckCircle2, Clock, type LucideIcon } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { RefundStatusEnum } from '../enums';

import { Badge, type BadgeProps } from '@/components/badge';
import Spinner from '@/components/spinner';

interface RefundStatusBadgeProps {
    status: RefundStatusEnum;
}

interface RefundStatusMeta {
    label: string;
    icon: LucideIcon;
    variant: BadgeProps['variant'];
}

const STATUS_META: Record<Exclude<RefundStatusEnum, RefundStatusEnum.Processing>, RefundStatusMeta> = {
    [RefundStatusEnum.Pending]: { label: 'order.refund.statuses.pending', icon: Clock, variant: 'warning' },
    [RefundStatusEnum.Paid]: { label: 'order.refund.statuses.paid', icon: CheckCircle2, variant: 'success' },
    [RefundStatusEnum.Failed]: { label: 'order.refund.statuses.failed', icon: AlertTriangle, variant: 'destructive' },
};

function RefundStatusBadge({ status }: RefundStatusBadgeProps) {
    const { t } = useTranslation();

    if (status === RefundStatusEnum.Processing) {
        return (
            <Badge variant='secondary' className='gap-1'>
                <Spinner size='sm' />
                {t('order.refund.statuses.processing')}
            </Badge>
        );
    }

    const meta = STATUS_META[status];
    const Icon = meta.icon;

    return (
        <Badge variant={meta.variant} className='gap-1'>
            <Icon className='h-3 w-3' />
            {t(meta.label)}
        </Badge>
    );
}

export default memo(RefundStatusBadge);
