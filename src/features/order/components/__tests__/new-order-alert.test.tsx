import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import NewOrderAlert, { type NewOrderAlertData } from '../new-order-alert';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

const t = (key: string) => i18n.t(key);

const ORDER: NewOrderAlertData = {
    orderId: 'ord-8001',
    orderNumber: 'ORD-20260625-1042',
    placedAt: '25 Jun 2026, 12:04',
    itemCount: 3,
    total: '285,000 ₫',
};

describe('NewOrderAlert', () => {
    it('shows the order number and the time the order was placed', () => {
        renderWithProviders(<NewOrderAlert order={ORDER} onViewOrder={vi.fn()} onDismiss={vi.fn()} />);

        expect(screen.getByText(ORDER.orderNumber)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(ORDER.placedAt))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(ORDER.total))).toBeInTheDocument();
    });

    it('emits the order id when "View order" is clicked', async () => {
        const onViewOrder = vi.fn();
        renderWithProviders(<NewOrderAlert order={ORDER} onViewOrder={onViewOrder} onDismiss={vi.fn()} />);

        await userEvent.click(screen.getByRole('button', { name: t('admin.newOrder.viewOrder') }));

        expect(onViewOrder).toHaveBeenCalledWith(ORDER.orderId);
    });

    it('emits dismiss when the close button is clicked', async () => {
        const onDismiss = vi.fn();
        renderWithProviders(<NewOrderAlert order={ORDER} onViewOrder={vi.fn()} onDismiss={onDismiss} />);

        await userEvent.click(screen.getByRole('button', { name: t('admin.newOrder.dismiss') }));

        expect(onDismiss).toHaveBeenCalledTimes(1);
    });
});
