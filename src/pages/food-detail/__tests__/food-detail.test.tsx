import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import FoodDetail from '../food-detail';

import { store } from '@/store';
import { resetCart } from '@/store/cart';
import { renderWithProviders } from '@/test/utils';

const FOOD_URL = '*/foods/food-1';

const BASE_FOOD = {
    id: 'food-1',
    name: 'Pho Bo',
    description: 'A delicious bowl of pho',
    price: 50000,
    discountPrice: null,
    imageUrls: ['https://example.com/pho.jpg'],
    category: 'Noodles',
    isAvailable: true,
    stockQuantity: 10,
    quantityUnit: 'bowl',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: null,
};

const SIZE_GROUP = {
    id: 'group-size',
    label: 'Size',
    required: true,
    options: [
        { value: 'small', label: 'Small' },
        { value: 'large', label: 'Large', surcharge: 10000 },
    ],
};

const EXTRAS_GROUP = {
    id: 'group-extras',
    label: 'Extras',
    required: true,
    options: [
        { value: 'egg', label: 'Egg', surcharge: 5000 },
        { value: 'beef', label: 'Extra Beef', surcharge: 15000 },
    ],
};

const server = setupServer();

const respondWithFood = (customisations: unknown[]) =>
    server.use(http.get(FOOD_URL, () => HttpResponse.json({ ...BASE_FOOD, customisations })));

beforeAll(() => server.listen());
beforeEach(() => {
    store.dispatch(resetCart());
});
afterEach(() => {
    server.resetHandlers();
    store.dispatch(resetCart());
});
afterAll(() => server.close());

const renderDetail = () => renderWithProviders(<FoodDetail />, { route: '/foods/food-1', path: '/foods/:id' });

describe('FoodDetail — customisation surcharge', () => {
    it('renders the food name in the success state', async () => {
        respondWithFood([]);
        renderDetail();

        expect(await screen.findByRole('heading', { name: 'Pho Bo' })).toBeInTheDocument();
    });

    it('renders the error state when the request fails', async () => {
        server.use(http.get(FOOD_URL, () => HttpResponse.json({ message: 'boom' }, { status: 500 })));
        renderDetail();

        await waitFor(() => {
            expect(screen.queryByRole('heading', { name: 'Pho Bo' })).not.toBeInTheDocument();
        });
    });

    it('pre-selects the first option of each required group by default (AC4)', async () => {
        respondWithFood([SIZE_GROUP]);
        renderDetail();

        const smallOption = await screen.findByRole('radio', { name: /Small/ });
        await waitFor(() => expect(smallOption).toBeChecked());
    });

    it('carries the selected surcharge into the cart item total (AC1)', async () => {
        respondWithFood([SIZE_GROUP]);
        renderDetail();

        const largeOption = await screen.findByRole('radio', { name: /Large/ });
        await userEvent.click(largeOption);

        const addButton = screen.getByRole('button', { name: /Add to Cart/ });
        await userEvent.click(addButton);

        await waitFor(() => {
            const item = store.getState().cart.items.find(i => i.id === 'food-1');
            expect(item?.surcharge).toBe(10000);
        });
    });

    it('aggregates surcharge across multiple selected groups (AC2)', async () => {
        respondWithFood([SIZE_GROUP, EXTRAS_GROUP]);
        renderDetail();

        await userEvent.click(await screen.findByRole('radio', { name: /Large/ }));
        await userEvent.click(screen.getByRole('radio', { name: /Extra Beef/ }));

        const addButton = screen.getByRole('button', { name: /Add to Cart/ });
        await userEvent.click(addButton);

        await waitFor(() => {
            const item = store.getState().cart.items.find(i => i.id === 'food-1');
            // large (10000) + extra beef (15000)
            expect(item?.surcharge).toBe(25000);
        });
    });
});
