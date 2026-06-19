import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import PaymentCard from '../payment-card';

import { PaymentStatusEnum } from '@/features/order';
import { renderWithProviders } from '@/test/utils';

interface RenderOverrides {
    paymentStatus?: string;
    paymentMethod?: string;
    isPending?: boolean;
}

function renderCard(overrides: RenderOverrides = {}) {
    const onConfirm = vi.fn();
    const props = {
        paymentStatus: PaymentStatusEnum.Unpaid as string,
        paymentMethod: 'card',
        isPending: false,
        onConfirm,
        ...overrides,
    };
    const utils = renderWithProviders(<PaymentCard {...props} />);
    return { ...utils, onConfirm };
}

/** The read-only "Current status" badge text (scoped to its row). */
function currentBadgeText(): string {
    const label = screen.getByText('Current status');
    const row = label.parentElement as HTMLElement;
    const badge = row.querySelector('[data-slot="badge"]') ?? row.lastElementChild;
    return badge?.textContent ?? '';
}

/** Opens the Select and clicks the option with the given visible label. */
async function pickStatus(user: ReturnType<typeof userEvent.setup>, optionLabel: string) {
    const trigger = screen.getByRole('combobox', { name: /update payment status/i });
    await user.click(trigger);
    const option = await screen.findByRole('option', { name: optionLabel });
    await user.click(option);
}

describe('PaymentCard', () => {
    it('renders the current payment-status badge and the method in the default state', () => {
        renderCard({ paymentStatus: PaymentStatusEnum.Paid, paymentMethod: 'card' });

        expect(currentBadgeText()).toBe('Paid');
        expect(screen.getByText('card')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /update payment status/i })).toBeEnabled();
    });

    it('does NOT open the dialog or call onConfirm when re-selecting the current status', async () => {
        const user = userEvent.setup();
        const { onConfirm } = renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Pending Payment');

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('opens the confirmation dialog when a different status is selected', async () => {
        const user = userEvent.setup();
        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Paid');

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Change payment status?')).toBeInTheDocument();
    });

    it('confirms the change: calls onConfirm with the picked status', async () => {
        const user = userEvent.setup();
        const { onConfirm } = renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Paid');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Confirm change' }));

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onConfirm).toHaveBeenCalledWith('paid');
    });

    it('does not call onConfirm and keeps the current status when the dialog is cancelled', async () => {
        const user = userEvent.setup();
        const { onConfirm } = renderCard({ paymentStatus: PaymentStatusEnum.Unpaid });

        await pickStatus(user, 'Paid');
        const dialog = await screen.findByRole('dialog');
        await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

        await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
        expect(onConfirm).not.toHaveBeenCalled();
        expect(currentBadgeText()).toBe('Pending Payment');
    });

    it('shows the saving label and disables the Select while pending', () => {
        renderCard({ paymentStatus: PaymentStatusEnum.Unpaid, isPending: true });

        expect(screen.getByText('Saving…')).toBeInTheDocument();
        expect(screen.getByRole('combobox', { name: /update payment status/i })).toBeDisabled();
    });

    it('renders the Unpaid option as "Pending Payment"', async () => {
        const user = userEvent.setup();
        renderCard({ paymentStatus: PaymentStatusEnum.Paid });

        const trigger = screen.getByRole('combobox', { name: /update payment status/i });
        await user.click(trigger);

        expect(await screen.findByRole('option', { name: 'Pending Payment' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Paid' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Failed' })).toBeInTheDocument();
    });

    it('renders Refunded as a selectable option', async () => {
        const user = userEvent.setup();
        renderCard({ paymentStatus: PaymentStatusEnum.Paid });

        const trigger = screen.getByRole('combobox', { name: /update payment status/i });
        await user.click(trigger);

        expect(await screen.findByRole('option', { name: 'Refunded' })).toBeInTheDocument();
    });
});
