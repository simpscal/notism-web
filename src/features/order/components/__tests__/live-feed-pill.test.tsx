import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { PaymentSignalRStatus } from '../../hooks/use-notifications';
import LiveFeedPill from '../live-feed-pill';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

const t = (key: string) => i18n.t(key);

describe('LiveFeedPill', () => {
    it('renders the connecting state', () => {
        renderWithProviders(<LiveFeedPill status={PaymentSignalRStatus.Connecting} />);

        expect(screen.getByText(t('admin.newOrder.feed.connecting'))).toBeInTheDocument();
    });

    it('renders the live state', () => {
        renderWithProviders(<LiveFeedPill status={PaymentSignalRStatus.Live} />);

        expect(screen.getByText(t('admin.newOrder.feed.live'))).toBeInTheDocument();
    });

    it('renders the disconnected state with a reconnect action when provided', async () => {
        const onReconnect = vi.fn();
        renderWithProviders(<LiveFeedPill status={PaymentSignalRStatus.Disconnected} onReconnect={onReconnect} />);

        expect(screen.getByText(t('admin.newOrder.feed.disconnected'))).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: t('admin.newOrder.feed.reconnect') }));
        expect(onReconnect).toHaveBeenCalledTimes(1);
    });

    it('renders the disconnected state without a reconnect action when none is provided', () => {
        renderWithProviders(<LiveFeedPill status={PaymentSignalRStatus.Disconnected} />);

        expect(screen.getByText(t('admin.newOrder.feed.disconnected'))).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: t('admin.newOrder.feed.reconnect') })).not.toBeInTheDocument();
    });
});
