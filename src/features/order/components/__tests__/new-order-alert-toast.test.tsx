import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NewOrderAlertToast, { type NewOrderAlertData } from '../new-order-alert-toast';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

const dismissMock = vi.fn();

vi.mock('sonner', () => ({
    toast: {
        dismiss: (id: string | number) => dismissMock(id),
    },
}));

const t = (key: string) => i18n.t(key);

const TOAST_ID = 'ord-8001';

const ORDER: NewOrderAlertData = {
    orderId: 'ord-8001',
    orderNumber: 'ORD-20260625-1042',
    placedAt: '25 Jun 2026, 12:04',
    itemCount: 3,
    total: '285,000 ₫',
};

describe('NewOrderAlertToast', () => {
    beforeEach(() => {
        dismissMock.mockReset();
    });

    it('shows the order number and the time the order was placed', () => {
        renderWithProviders(<NewOrderAlertToast order={ORDER} toastId={TOAST_ID} onViewOrder={vi.fn()} />);

        expect(screen.getByText(ORDER.orderNumber)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(ORDER.placedAt))).toBeInTheDocument();
        expect(screen.getByText(new RegExp(ORDER.total))).toBeInTheDocument();
    });

    it('emits the order slug and dismisses the toast when "View order" is clicked', async () => {
        const onViewOrder = vi.fn();
        renderWithProviders(<NewOrderAlertToast order={ORDER} toastId={TOAST_ID} onViewOrder={onViewOrder} />);

        await userEvent.click(screen.getByRole('button', { name: t('admin.newOrder.viewOrder') }));

        expect(onViewOrder).toHaveBeenCalledWith(ORDER.orderNumber);
        expect(dismissMock).toHaveBeenCalledWith(TOAST_ID);
    });

    it('dismisses the toast when the close button is clicked', async () => {
        renderWithProviders(<NewOrderAlertToast order={ORDER} toastId={TOAST_ID} onViewOrder={vi.fn()} />);

        await userEvent.click(screen.getByRole('button', { name: t('admin.newOrder.dismiss') }));

        expect(dismissMock).toHaveBeenCalledWith(TOAST_ID);
    });
});
