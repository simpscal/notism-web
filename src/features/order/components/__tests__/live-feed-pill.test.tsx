import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import LiveFeedPill from '../live-feed-pill';

import i18n from '@/app/i18n/i18n';
import { NotificationStatus } from '@/core/hooks';
import { getByI18nText, renderWithProviders } from '@/test/utils';

const t = (key: string) => i18n.t(key);

describe('LiveFeedPill', () => {
    it('renders the connecting state', () => {
        renderWithProviders(<LiveFeedPill status={NotificationStatus.Connecting} />);

        expect(getByI18nText('admin.newOrder.feed.connecting')).toBeInTheDocument();
    });

    it('renders the live state', () => {
        renderWithProviders(<LiveFeedPill status={NotificationStatus.Live} />);

        expect(getByI18nText('admin.newOrder.feed.live')).toBeInTheDocument();
    });

    it('renders the disconnected state with a reconnect action when provided', async () => {
        const onReconnect = vi.fn();
        renderWithProviders(<LiveFeedPill status={NotificationStatus.Disconnected} onReconnect={onReconnect} />);

        expect(getByI18nText('admin.newOrder.feed.disconnected')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: t('admin.newOrder.feed.reconnect') }));
        expect(onReconnect).toHaveBeenCalledTimes(1);
    });

    it('renders the disconnected state without a reconnect action when none is provided', () => {
        renderWithProviders(<LiveFeedPill status={NotificationStatus.Disconnected} />);

        expect(getByI18nText('admin.newOrder.feed.disconnected')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: t('admin.newOrder.feed.reconnect') })).not.toBeInTheDocument();
    });
});
