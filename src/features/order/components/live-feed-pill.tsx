import { WifiOff } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { PaymentSignalRStatus } from '../hooks/use-payment-signalr';

import { Button } from '@/components/button';
import Spinner from '@/components/spinner';

interface LiveFeedPillProps {
    status: PaymentSignalRStatus;
    onReconnect?: () => void;
}

function LiveFeedPill({ status, onReconnect }: LiveFeedPillProps) {
    const { t } = useTranslation();

    if (status === PaymentSignalRStatus.Connecting) {
        return (
            <span className='inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground'>
                <Spinner size='xs' />
                {t('admin.newOrder.feed.connecting')}
            </span>
        );
    }

    if (status === PaymentSignalRStatus.Disconnected) {
        return (
            <span className='inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive'>
                <WifiOff className='h-3.5 w-3.5' aria-hidden />
                {t('admin.newOrder.feed.disconnected')}
                {onReconnect && (
                    <Button
                        size='sm'
                        variant='ghost'
                        className='h-6 px-2 text-xs text-destructive hover:bg-destructive/15 hover:text-destructive'
                        onClick={onReconnect}
                    >
                        {t('admin.newOrder.feed.reconnect')}
                    </Button>
                )}
            </span>
        );
    }

    return (
        <span className='inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-medium text-success'>
            <span className='relative flex h-2 w-2'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60' />
                <span className='relative inline-flex h-2 w-2 rounded-full bg-success' />
            </span>
            {t('admin.newOrder.feed.live')}
        </span>
    );
}

export default memo(LiveFeedPill);
