import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import HeldRefundReminderBannerContainer from '../held-refund-reminder-banner-container';

import { orderApi } from '@/apis';
import i18n from '@/app/i18n/i18n';
import type { HeldRefundViewModel } from '@/features/order/models';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigateMock };
});

const HELD_ONE: HeldRefundViewModel = {
    refundId: 'rfd-7001',
    orderRef: 'ORD-20260613-0099',
    amount: 485_000,
};

const HELD_TWO: HeldRefundViewModel = {
    refundId: 'rfd-7002',
    orderRef: 'ORD-20260611-0063',
    amount: 215_000,
};

describe('HeldRefundReminderBannerContainer', () => {
    beforeEach(() => {
        navigateMock.mockReset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('shows the single-refund reminder when one refund is held', async () => {
        vi.spyOn(orderApi, 'getHeldRefunds').mockResolvedValue([HELD_ONE]);

        renderWithProviders(<HeldRefundReminderBannerContainer />);

        expect(await screen.findByText(t('order.refund.heldReminderBanner.titleSingle'))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(HELD_ONE.orderRef))).toBeInTheDocument();
    });

    it('shows the consolidated reminder when multiple refunds are held', async () => {
        vi.spyOn(orderApi, 'getHeldRefunds').mockResolvedValue([HELD_ONE, HELD_TWO]);

        renderWithProviders(<HeldRefundReminderBannerContainer />);

        expect(await screen.findByText(t('order.refund.heldReminderBanner.titleMultiple'))).toBeInTheDocument();
        expect(
            screen.getByText(
                new RegExp(
                    t('order.refund.heldReminderBanner.messageMultiple', {
                        count: 2,
                        amount: '700,000 ₫',
                    }).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                )
            )
        ).toBeInTheDocument();
    });

    it('renders nothing when no refund is held', async () => {
        vi.spyOn(orderApi, 'getHeldRefunds').mockResolvedValue([]);

        const { container } = renderWithProviders(<HeldRefundReminderBannerContainer />);

        await waitFor(() => {
            expect(orderApi.getHeldRefunds).toHaveBeenCalled();
        });
        expect(screen.queryByText(t('order.refund.heldReminderBanner.titleSingle'))).not.toBeInTheDocument();
        expect(screen.queryByText(t('order.refund.heldReminderBanner.titleMultiple'))).not.toBeInTheDocument();
        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing while the query is loading', () => {
        vi.spyOn(orderApi, 'getHeldRefunds').mockReturnValue(new Promise(() => {}));

        const { container } = renderWithProviders(<HeldRefundReminderBannerContainer />);

        expect(container).toBeEmptyDOMElement();
    });

    it('routes to the bank-details settings page when the banner is clicked', async () => {
        vi.spyOn(orderApi, 'getHeldRefunds').mockResolvedValue([HELD_ONE]);

        renderWithProviders(<HeldRefundReminderBannerContainer />);

        const banner = await screen.findByRole('button', {
            name: new RegExp(t('order.refund.heldReminderBanner.titleSingle')),
        });
        await userEvent.click(banner);

        expect(navigateMock).toHaveBeenCalledWith('/settings/payment');
    });
});
