import { WifiOff } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import Spinner from '@/uis/spinner';

export type LiveFeedStatus = 'connecting' | 'live' | 'disconnected';

export interface LiveFeedPillLabels {
    connecting: string;
    live: string;
    disconnected: string;
    reconnect: string;
}

interface LiveFeedPillProps {
    status: LiveFeedStatus;
    labels?: Partial<LiveFeedPillLabels>;
    onReconnect?: () => void;
}

function LiveFeedPill({ status, labels, onReconnect }: LiveFeedPillProps) {
    const { t } = useTranslation();

    const connectingLabel = labels?.connecting ?? t('common.liveFeedPill.connecting');
    const liveLabel = labels?.live ?? t('common.liveFeedPill.live');
    const disconnectedLabel = labels?.disconnected ?? t('common.liveFeedPill.disconnected');
    const reconnectLabel = labels?.reconnect ?? t('common.liveFeedPill.reconnect');

    if (status === 'connecting') {
        return (
            <span className='inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground'>
                <Spinner size='xs' />
                {connectingLabel}
            </span>
        );
    }

    if (status === 'disconnected') {
        return (
            <span className='inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive'>
                <WifiOff className='h-3.5 w-3.5' aria-hidden />
                {disconnectedLabel}
                {onReconnect && (
                    <Button
                        size='sm'
                        variant='ghost'
                        className='h-6 px-2 text-xs text-destructive hover:bg-destructive/15 hover:text-destructive'
                        onClick={onReconnect}
                    >
                        {reconnectLabel}
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
            {liveLabel}
        </span>
    );
}

export default memo(LiveFeedPill);
