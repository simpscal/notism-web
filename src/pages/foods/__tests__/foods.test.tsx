import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { Foods } from '..';
import { FoodItemViewModel } from '../models';

import { FOOD_ENDPOINTS } from '@/apis/food/food.constant';
import i18n from '@/app/i18n/i18n';
import { formatVnd } from '@/app/utils';
import { buildUrl } from '@/mocks/utils';
import { store } from '@/store';
import { setCategories } from '@/store/food';
import { resetStore } from '@/store/root.actions';
import { server } from '@/test/server';
import { renderWithProviders } from '@/test/utils';

const FOODS_URL = buildUrl(FOOD_ENDPOINTS.LIST);

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const DISHES: FoodItemViewModel[] = [
    {
        id: '1',
        name: 'Com Tam Suon',
        description: 'Broken rice with grilled pork',
        price: 55000,
        discountPrice: null,
        imageUrl: '',
        category: 'Rice',
        isAvailable: true,
        stockQuantity: 10,
        quantityUnit: 'portion',
    },
    {
        id: '2',
        name: 'Pho Bo',
        description: 'Beef noodle soup',
        price: 60000,
        discountPrice: 48000,
        imageUrl: '',
        category: 'Noodles',
        isAvailable: true,
        stockQuantity: 10,
        quantityUnit: 'portion',
    },
    {
        id: '3',
        name: 'Bun Cha',
        description: 'Grilled pork with noodles',
        price: 65000,
        discountPrice: null,
        imageUrl: '',
        category: 'Noodles',
        isAvailable: false,
        stockQuantity: 0,
        quantityUnit: 'portion',
    },
];

let lastQuery: Record<string, string | null> = {};

function foodsHandler() {
    return http.get(FOODS_URL, ({ request }) => {
        const url = new URL(request.url);
        lastQuery = {
            category: url.searchParams.get('category'),
            keyword: url.searchParams.get('keyword'),
            sortBy: url.searchParams.get('sortBy'),
            sortOrder: url.searchParams.get('sortOrder'),
        };
        const category = url.searchParams.get('category');
        const items = category ? DISHES.filter(d => d.category === category) : DISHES;
        return HttpResponse.json({ totalCount: items.length, items });
    });
}

function renderFoods() {
    return renderWithProviders(
        <Routes>
            <Route path='/foods' element={<Foods />} />
            <Route path='/foods/:id' element={<div>Dish detail page</div>} />
        </Routes>,
        { initialEntries: ['/foods'] }
    );
}

beforeAll(() => server.listen());

beforeEach(() => {
    lastQuery = {};
    server.use(foodsHandler());
    store.dispatch(
        setCategories([
            { id: 'cat-rice', name: 'Rice' },
            { id: 'cat-noodles', name: 'Noodles' },
        ])
    );
});

afterEach(() => {
    server.resetHandlers();
    store.dispatch(resetStore());
});

afterAll(() => server.close());

describe('Foods menu-browsing surface', () => {
    it('renders the fetched dishes as an image-forward card grid', async () => {
        renderFoods();

        expect(await screen.findByText('Com Tam Suon')).toBeInTheDocument();
        expect(screen.getByText('Pho Bo')).toBeInTheDocument();

        // Price is rendered in the crimson accent role (text-primary).
        const price = screen.getByText(formatVnd(55000));
        expect(price).toHaveClass('text-primary');
    });

    it('renders each available card as a single tap target that opens the dish detail', async () => {
        const user = userEvent.setup();
        renderFoods();

        const card = await screen.findByRole('button', { name: /Com Tam Suon/ });
        // The whole card is one control, not a card wrapping separate buttons.
        expect(within(card).queryByRole('button')).toBeNull();

        await user.click(card);

        expect(await screen.findByText('Dish detail page')).toBeInTheDocument();
    });

    it('disables the tap target for sold-out dishes', async () => {
        renderFoods();

        const soldOut = await screen.findByRole('button', { name: /Bun Cha/ });
        expect(soldOut).toBeDisabled();
    });

    it('renders the category pills as a single-select row with exactly one selected', async () => {
        renderFoods();

        await screen.findByText('Com Tam Suon');

        const allPill = screen.getByRole('radio', { name: t('common.all') });
        const ricePill = screen.getByRole('radio', { name: 'Rice' });
        const noodlesPill = screen.getByRole('radio', { name: 'Noodles' });

        const selected = [allPill, ricePill, noodlesPill].filter(pill => pill.getAttribute('data-state') === 'on');
        expect(selected).toHaveLength(1);
        expect(allPill).toHaveAttribute('data-state', 'on');
    });

    it('updates the grid and refetches when a category pill is selected', async () => {
        const user = userEvent.setup();
        renderFoods();

        await screen.findByText('Pho Bo');

        await user.click(screen.getByRole('radio', { name: 'Rice' }));

        await waitFor(() => expect(lastQuery.category).toBe('Rice'));
        await waitFor(() => expect(screen.queryByText('Pho Bo')).not.toBeInTheDocument());
        expect(screen.getByText('Com Tam Suon')).toBeInTheDocument();

        const ricePill = screen.getByRole('radio', { name: 'Rice' });
        expect(ricePill).toHaveAttribute('data-state', 'on');
    });

    it('refetches with the sort params when the sort control changes', async () => {
        const user = userEvent.setup();
        renderFoods();

        await screen.findByText('Com Tam Suon');

        const trigger = screen.getByRole('combobox', { name: t('foods.sidebar.sortBy') });
        await user.click(trigger);
        await user.click(await screen.findByRole('option', { name: t('foods.sidebar.priceLowHigh') }));

        await waitFor(() => expect(lastQuery.sortBy).toBe('price'));
        expect(lastQuery.sortOrder).toBe('asc');
    });

    it('shows an empty state with exactly one CTA when no dishes match', async () => {
        server.use(http.get(FOODS_URL, () => HttpResponse.json({ totalCount: 0, items: [] })));
        renderFoods();

        expect(await screen.findByText(t('foods.empty.title'))).toBeInTheDocument();

        const cta = screen.getByRole('button', { name: t('foods.empty.showAll') });
        expect(cta).toBeInTheDocument();
        // Exactly one CTA in the empty state region (no card buttons remain).
        expect(screen.getAllByRole('button', { name: t('foods.empty.showAll') })).toHaveLength(1);
    });
});
