import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import Cart from '../cart';

import i18n from '@/app/i18n/i18n';
import { store } from '@/store';
import { loadCart } from '@/store/cart/cart.thunks';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user/user.slice';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const CART_URL = 'http://localhost:5000/api/cart';
const ITEM_URL = (id: string) => `${CART_URL}/items/${id}`;

const toastError = vi.fn();
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: (...args: unknown[]) => toastError(...args),
    },
}));

const makeCartItem = (overrides?: Partial<Record<string, unknown>>) => ({
    id: 'item-1',
    name: 'Pho',
    description: 'Beef noodle soup',
    price: 50000,
    discountPrice: null,
    imageUrl: '',
    category: 'Main',
    quantity: 1,
    stockQuantity: 99,
    quantityUnit: 'bowl',
    customisations: [],
    totalSurcharge: 0,
    ...overrides,
});

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
    server.resetHandlers();
    toastError.mockClear();
});
afterAll(() => server.close());

beforeEach(async () => {
    store.dispatch(resetStore());
    store.dispatch(setUser({ id: 'user-1' } as never));
});

async function seedCart() {
    server.use(http.get(CART_URL, () => HttpResponse.json({ items: [makeCartItem({ quantity: 1 })] })));
    await store.dispatch(loadCart());
}

function getQuantityControls() {
    // The quantity badge sits between the - and + buttons on the line item.
    const buttons = screen.getAllByRole('button');
    const incrementBtn = buttons.find(b => b.querySelector('svg.lucide-plus'));
    const decrementBtn = buttons.find(b => b.querySelector('svg.lucide-minus'));
    return { incrementBtn: incrementBtn!, decrementBtn: decrementBtn! };
}

describe('Cart — quantity controls', () => {
    it('reflects an increment without a page refresh', async () => {
        await seedCart();
        // Lean { id } reply, matching the real backend.
        server.use(http.patch(ITEM_URL('item-1'), () => HttpResponse.json({ id: 'item-1' })));

        renderWithProviders(<Cart />);

        const lineItem = (await screen.findAllByText('Pho'))[0].closest('div[class*="cursor-pointer"]')!;
        expect(within(lineItem as HTMLElement).getByText('1')).toBeInTheDocument();

        const { incrementBtn } = getQuantityControls();
        await userEvent.click(incrementBtn);

        await waitFor(() => expect(within(lineItem as HTMLElement).getByText('2')).toBeInTheDocument());
    });

    it('accumulates rapid successive increments (qty 1 -> 4 after three clicks)', async () => {
        await seedCart();
        server.use(http.patch(ITEM_URL('item-1'), () => HttpResponse.json({ id: 'item-1' })));

        renderWithProviders(<Cart />);
        const lineItem = (await screen.findAllByText('Pho'))[0].closest('div[class*="cursor-pointer"]')!;

        const { incrementBtn } = getQuantityControls();
        await userEvent.click(incrementBtn);
        await userEvent.click(incrementBtn);
        await userEvent.click(incrementBtn);

        await waitFor(() => expect(within(lineItem as HTMLElement).getByText('4')).toBeInTheDocument());
        // Order total recalculates in lockstep: 4 x 50000.
        const summary = screen.getByText(t('cart.orderSummary')).closest('div[class*="rounded"]')!;
        expect(within(summary as HTMLElement).getByText('Pho ×4')).toBeInTheDocument();
    });

    it('surfaces an error toast and keeps the original quantity when the save fails', async () => {
        await seedCart();
        server.use(http.patch(ITEM_URL('item-1'), () => new HttpResponse(null, { status: 500 })));

        renderWithProviders(<Cart />);
        const lineItem = (await screen.findAllByText('Pho'))[0].closest('div[class*="cursor-pointer"]')!;

        const { incrementBtn } = getQuantityControls();
        await userEvent.click(incrementBtn);

        await waitFor(() => expect(toastError).toHaveBeenCalled());
        await waitFor(() => expect(within(lineItem as HTMLElement).getByText('1')).toBeInTheDocument());
    });
});
