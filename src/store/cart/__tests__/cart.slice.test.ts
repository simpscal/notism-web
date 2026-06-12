import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { resetStore } from '../../root.actions';
import { setUser } from '../../user/user.slice';
import { selectCartItems, selectSelectedCartTotalPrice } from '../cart.selectors';
import { loadCart, updateItemQuantity } from '../cart.thunks';

import { store } from '@/store';

const CART_URL = 'http://localhost:5000/api/cart';
const ITEM_URL = (id: string) => `${CART_URL}/items/${id}`;

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
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
    store.dispatch(resetStore());
    // Authenticate so the thunks take the server-backed branch.
    store.dispatch(setUser({ id: 'user-1' } as never));
});

describe('cart slice — authenticated quantity update', () => {
    it('updates the stored quantity when the PATCH reply is the lean { id } shape', async () => {
        // The backend PATCH /cart/items/{id} returns ONLY { id } — no name/customisations.
        server.use(
            http.get(CART_URL, () => HttpResponse.json({ items: [makeCartItem({ quantity: 1 })] })),
            http.patch(ITEM_URL('item-1'), () => HttpResponse.json({ id: 'item-1' }))
        );

        await store.dispatch(loadCart());
        expect(selectCartItems(store.getState())[0].quantity).toBe(1);

        // Must fulfil (not reject on the lean response) and apply the requested quantity.
        await store.dispatch(updateItemQuantity({ id: 'item-1', quantity: 2 })).unwrap();

        expect(selectCartItems(store.getState())[0].quantity).toBe(2);
    });

    it('recalculates the selected order total after the quantity update', async () => {
        server.use(
            http.get(CART_URL, () => HttpResponse.json({ items: [makeCartItem({ quantity: 1, price: 50000 })] })),
            http.patch(ITEM_URL('item-1'), () => HttpResponse.json({ id: 'item-1' }))
        );

        await store.dispatch(loadCart());
        expect(selectSelectedCartTotalPrice(store.getState())).toBe(50000);

        await store.dispatch(updateItemQuantity({ id: 'item-1', quantity: 3 })).unwrap();

        expect(selectSelectedCartTotalPrice(store.getState())).toBe(150000);
    });
});
