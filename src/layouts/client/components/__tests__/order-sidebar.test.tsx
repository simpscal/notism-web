import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import OrderSidebar from '../order-sidebar';

import i18n from '@/app/i18n/i18n';
import { store } from '@/store';
import { loadCart } from '@/store/cart/cart.thunks';
import { resetStore } from '@/store/root.actions';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const toastSuccess = vi.fn();
vi.mock('sonner', () => ({
    toast: {
        success: (...args: unknown[]) => toastSuccess(...args),
        error: vi.fn(),
    },
}));

const makeItem = (overrides?: Partial<Record<string, unknown>>) => ({
    id: 'item-1',
    name: 'Pho',
    description: 'Beef noodle soup',
    price: 50000,
    discountPrice: null,
    imageUrl: '',
    category: 'Main',
    quantity: 2,
    stockQuantity: 99,
    quantityUnit: 'bowl',
    customisations: [],
    totalSurcharge: 0,
    isSelected: true,
    ...overrides,
});

async function seedCart(items: ReturnType<typeof makeItem>[]) {
    localStorage.setItem('cart_items', JSON.stringify(items));
    await store.dispatch(loadCart());
}

beforeEach(() => {
    store.dispatch(resetStore());
    localStorage.clear();
    toastSuccess.mockClear();
});

afterEach(() => {
    store.dispatch(resetStore());
    localStorage.clear();
});

const noop = vi.fn();

describe('OrderSidebar', () => {
    it('renders the running order lines with their price and the crimson total', async () => {
        await seedCart([makeItem({ quantity: 2 })]);

        renderWithProviders(<OrderSidebar open={false} onOpenChange={noop} />);

        expect(await screen.findByText('Pho')).toBeInTheDocument();
        // Line price = 2 x 50,000 and the running total both render.
        expect(screen.getAllByText('100,000 ₫').length).toBeGreaterThan(0);
        expect(screen.getByText(t('orderSidebar.title'))).toBeInTheDocument();
        expect(screen.getByText(t('cart.total'))).toBeInTheDocument();
    });

    it('renders the empty state with a single browse CTA when the cart is empty', async () => {
        await seedCart([]);

        renderWithProviders(<OrderSidebar open={false} onOpenChange={noop} />);

        expect(await screen.findByText(t('orderSidebar.empty.title'))).toBeInTheDocument();
        expect(screen.getByRole('button', { name: t('orderSidebar.browseMenu') })).toBeInTheDocument();
        // No checkout CTA on an empty order (no dead end, but no commit either).
        expect(screen.queryByRole('button', { name: t('orderSidebar.checkout') })).not.toBeInTheDocument();
    });

    it('increments a line quantity through the shared stepper and updates the price', async () => {
        await seedCart([makeItem({ quantity: 2 })]);

        renderWithProviders(<OrderSidebar open={false} onOpenChange={noop} />);

        await screen.findByText('Pho');
        await userEvent.click(screen.getByRole('button', { name: 'Increase Pho' }));

        await waitFor(() => expect(screen.getAllByText('150,000 ₫').length).toBeGreaterThan(0));
        expect(store.getState().cart.items[0].quantity).toBe(3);
    });

    it('removes a line when its remove control is pressed', async () => {
        await seedCart([makeItem({ quantity: 2 })]);

        renderWithProviders(<OrderSidebar open={false} onOpenChange={noop} />);

        await screen.findByText('Pho');
        await userEvent.click(screen.getByRole('button', { name: t('orderSidebar.removeItem', { name: 'Pho' }) }));

        await waitFor(() => expect(screen.getByText(t('orderSidebar.empty.title'))).toBeInTheDocument());
        expect(store.getState().cart.items).toHaveLength(0);
    });

    it('renders the same order panel inside the drawer when open', async () => {
        await seedCart([makeItem({ quantity: 2 })]);

        renderWithProviders(<OrderSidebar open onOpenChange={noop} />);

        const dialog = await screen.findByRole('dialog');
        expect(within(dialog).getByText('Pho')).toBeInTheDocument();
        expect(within(dialog).getByText(t('cart.total'))).toBeInTheDocument();
    });
});
