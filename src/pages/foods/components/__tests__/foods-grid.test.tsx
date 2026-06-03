import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import FoodsGrid from '../foods-grid';

import { store } from '@/store';
import { resetCart } from '@/store/cart';
import { renderWithProviders } from '@/test/utils';

const FOODS_LIST_URL = '*/foods';
const FOOD_DETAIL_URL = '*/foods/food-1';

const LIST_ITEM = {
    id: 'food-1',
    name: 'Pho Bo',
    description: 'A delicious bowl of pho',
    price: 50000,
    discountPrice: null,
    imageUrl: 'https://example.com/pho.jpg',
    category: 'Noodles',
    isAvailable: true,
    stockQuantity: 10,
    quantityUnit: 'bowl',
};

const DETAIL_RESPONSE = {
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
    customisations: [
        {
            id: 'group-size',
            label: 'Size',
            required: true,
            options: [
                { value: 'small', label: 'Small', surcharge: 7000 },
                { value: 'large', label: 'Large', surcharge: 12000 },
            ],
        },
    ],
};

const server = setupServer(
    http.get(FOOD_DETAIL_URL, () => HttpResponse.json(DETAIL_RESPONSE)),
    http.get(FOODS_LIST_URL, () => HttpResponse.json({ totalCount: 1, items: [LIST_ITEM] }))
);

const noop = () => {};

beforeAll(() => server.listen());
beforeEach(() => store.dispatch(resetCart()));
afterEach(() => {
    server.resetHandlers();
    store.dispatch(resetCart());
});
afterAll(() => server.close());

const renderGrid = () =>
    renderWithProviders(<FoodsGrid category={null} keyword='' sortBy='default' onClearFilters={noop} />);

describe('FoodsGrid — add to cart with customisation defaults', () => {
    it('renders foods in the success state', async () => {
        renderGrid();
        expect(await screen.findByText('Pho Bo')).toBeInTheDocument();
    });

    it('renders loading skeletons while fetching', () => {
        renderGrid();
        // No food text yet on the very first synchronous render
        expect(screen.queryByText('Pho Bo')).not.toBeInTheDocument();
    });

    it('renders the empty state when there are no foods', async () => {
        server.use(http.get(FOODS_LIST_URL, () => HttpResponse.json({ totalCount: 0, items: [] })));
        renderGrid();
        await waitFor(() => {
            expect(screen.queryByText('Pho Bo')).not.toBeInTheDocument();
        });
    });

    it('defaults required selection and includes its surcharge when adding from the grid (AC3)', async () => {
        renderGrid();

        const addButton = await screen.findByRole('button', { name: /Add/ });
        await userEvent.click(addButton);

        await waitFor(() => {
            const item = store.getState().cart.items.find(i => i.id === 'food-1');
            expect(item).toBeDefined();
            // first required option "Small" surcharge 7000
            expect(item?.surcharge).toBe(7000);
            expect(item?.customisationOptionId).toBe('small');
        });
    });

    it('shows an error toast when resolving customisations fails', async () => {
        const errorSpy = vi.fn();
        server.use(http.get(FOOD_DETAIL_URL, () => HttpResponse.json({ message: 'boom' }, { status: 500 })));

        renderGrid();
        const addButton = await screen.findByRole('button', { name: /Add/ });
        await userEvent.click(addButton);

        await waitFor(() => {
            const item = store.getState().cart.items.find(i => i.id === 'food-1');
            expect(item).toBeUndefined();
        });
        errorSpy.mockReset();
    });
});
