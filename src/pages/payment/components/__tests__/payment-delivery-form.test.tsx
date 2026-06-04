import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import PaymentDeliveryForm from '../payment-delivery-form';

import { renderWithProviders } from '@/test/utils';

describe('PaymentDeliveryForm', () => {
    it('renders delivery address input form when no saved address', () => {
        renderWithProviders(<PaymentDeliveryForm savedAddress={null} totalPrice={100000} onPlaceOrder={vi.fn()} />);

        expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/delivery notes/i)).toBeInTheDocument();
    });

    it('shows Place order button with formatted total when no saved address', () => {
        renderWithProviders(<PaymentDeliveryForm savedAddress={null} totalPrice={395000} onPlaceOrder={vi.fn()} />);

        expect(screen.getByRole('button', { name: /place order/i })).toHaveTextContent('395,000 ₫');
    });

    it('shows cash preparation reminder with formatted total', () => {
        renderWithProviders(<PaymentDeliveryForm savedAddress={null} totalPrice={395000} onPlaceOrder={vi.fn()} />);

        // Amount appears in both the reminder span and the button; verify at least one matches
        expect(screen.getAllByText(/395,000 ₫/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/prepare the exact amount/i)).toBeInTheDocument();
    });

    it('renders read-only address display when saved address provided', () => {
        renderWithProviders(
            <PaymentDeliveryForm savedAddress='123 Nguyen Hue, District 1' totalPrice={100000} onPlaceOrder={vi.fn()} />
        );

        expect(screen.getByText('Delivering to')).toBeInTheDocument();
        expect(screen.getByText('123 Nguyen Hue, District 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
        // Form inputs should not be visible initially
        expect(screen.queryByLabelText(/delivery address/i)).not.toBeInTheDocument();
    });

    it('switches to editable form when Edit is clicked in saved-address mode', async () => {
        renderWithProviders(
            <PaymentDeliveryForm savedAddress='123 Nguyen Hue, District 1' totalPrice={100000} onPlaceOrder={vi.fn()} />
        );

        const editBtn = screen.getByRole('button', { name: /edit/i });
        await userEvent.click(editBtn);

        expect(screen.getByLabelText(/delivery address/i)).toBeInTheDocument();
    });

    it('calls onPlaceOrder when Place order button is clicked (no saved address)', async () => {
        const onPlaceOrder = vi.fn();
        renderWithProviders(
            <PaymentDeliveryForm savedAddress={null} totalPrice={100000} onPlaceOrder={onPlaceOrder} />
        );

        await userEvent.click(screen.getByRole('button', { name: /place order/i }));

        expect(onPlaceOrder).toHaveBeenCalledTimes(1);
    });

    it('calls onPlaceOrder when Place order button is clicked (saved address, read-only)', async () => {
        const onPlaceOrder = vi.fn();
        renderWithProviders(
            <PaymentDeliveryForm savedAddress='123 Nguyen Hue' totalPrice={100000} onPlaceOrder={onPlaceOrder} />
        );

        const placeOrderBtn = screen.getByRole('button', { name: /place order/i });
        await userEvent.click(placeOrderBtn);

        expect(onPlaceOrder).toHaveBeenCalledTimes(1);
    });

    it('disables button and inputs when disabled prop is true', () => {
        renderWithProviders(
            <PaymentDeliveryForm savedAddress={null} totalPrice={100000} disabled onPlaceOrder={vi.fn()} />
        );

        expect(screen.getByRole('button', { name: /place order/i })).toBeDisabled();
        expect(screen.getByLabelText(/delivery address/i)).toBeDisabled();
    });
});
