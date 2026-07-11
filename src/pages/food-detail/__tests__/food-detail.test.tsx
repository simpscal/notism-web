import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { delay, http, HttpResponse } from 'msw';
import { Route, Routes } from 'react-router-dom';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { FoodDetail } from '..';

import type { FoodDetailModel } from '@/apis';
import { FOOD_ENDPOINTS } from '@/apis/food/food.constant';
import i18n from '@/app/i18n/i18n';
import { formatVnd } from '@/app/utils';
import { buildUrl } from '@/mocks/utils';
import { store } from '@/store';
import { resetStore } from '@/store/root.actions';
import { server } from '@/test/server';
import { renderWithProviders } from '@/test/utils';

const DISH_ID = 'food-crispy-chicken';
const DETAIL_URL = buildUrl(FOOD_ENDPOINTS.DETAIL(DISH_ID));

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

const DISH: FoodDetailModel = {
    id: DISH_ID,
    name: 'Crispy chicken burger',
    description: 'Buttermilk-brined chicken thigh, double-fried for crunch.',
    price: 89000,
    discountPrice: null,
    imageUrls: [''],
    category: 'Burgers',
    isAvailable: true,
    stockQuantity: 24,
    quantityUnit: '1 burger',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: null,
    customisations: [
        {
            id: 'size',
            label: 'Size',
            required: true,
            options: [
                { value: 'single', label: 'Single' },
                { value: 'double', label: 'Double', surcharge: 25000 },
                { value: 'triple', label: 'Triple', surcharge: 45000 },
            ],
        },
        {
            id: 'meal',
            label: 'Build your meal',
            required: false,
            options: [
                { value: 'solo', label: 'Burger only' },
                { value: 'fries', label: 'Plus Fries', surcharge: 20000 },
            ],
        },
    ],
};

function detailHandler(dish: FoodDetailModel = DISH) {
    return http.get(DETAIL_URL, () => HttpResponse.json(dish));
}

function renderDetail() {
    return renderWithProviders(
        <Routes>
            <Route path='/foods/:id' element={<FoodDetail />} />
            <Route path='/foods' element={<div>Menu page</div>} />
            <Route path='/cart' element={<div>Cart page</div>} />
        </Routes>,
        { initialEntries: [`/foods/${DISH_ID}`] }
    );
}

beforeAll(() => server.listen());

beforeEach(() => {
    server.use(detailHandler());
});

afterEach(() => {
    server.resetHandlers();
    store.dispatch(resetStore());
});

afterAll(() => server.close());

describe('FoodDetail — on-theme dish surface', () => {
    it('renders the single-focus dish with a muted category eyebrow and one display-weight title', async () => {
        renderDetail();

        const title = await screen.findByRole('heading', { name: DISH.name });
        expect(title).toBeInTheDocument();

        const eyebrow = screen.getByText(DISH.category);
        expect(eyebrow).toHaveClass('uppercase');
        expect(eyebrow).toHaveClass('text-muted-foreground');
    });

    it('renders the dish price as the loudest crimson element at display scale', async () => {
        renderDetail();

        await screen.findByRole('heading', { name: DISH.name });

        // The unit price and the Add total coincide before any selection, so pick
        // the crimson display-scale element specifically.
        const price = screen.getAllByText(formatVnd(DISH.price)).find(el => el.classList.contains('text-3xl'));
        expect(price).toBeDefined();
        expect(price).toHaveClass('text-primary');
    });

    it('shows the loading skeleton while fetching', () => {
        server.use(
            http.get(DETAIL_URL, async () => {
                await delay('infinite');
                return HttpResponse.json(DISH);
            })
        );

        const { container } = renderDetail();

        expect(screen.queryByRole('heading', { name: DISH.name })).not.toBeInTheDocument();
        expect(container.querySelector('[data-slot="skeleton"]')).toBeInTheDocument();
    });

    it('shows the error state when the request fails', async () => {
        server.use(http.get(DETAIL_URL, () => HttpResponse.json(null, { status: 500 })));

        renderDetail();

        expect(await screen.findByText(t('foodDetail.error.title'))).toBeInTheDocument();
    });

    it('renders each option group under an UPPERCASE eyebrow with a single-select black-pill row', async () => {
        renderDetail();

        await screen.findByRole('heading', { name: DISH.name });

        const sizeEyebrow = screen.getByText('Size');
        expect(sizeEyebrow).toHaveClass('uppercase');
        expect(screen.getByText('Build your meal')).toHaveClass('uppercase');

        const sizeGroup = screen.getByRole('group', { name: 'Size' });
        const options = within(sizeGroup).getAllByRole('radio');
        expect(options).toHaveLength(3);
        expect(options.every(o => o.getAttribute('data-state') === 'off')).toBe(true);
    });

    it('keeps exactly one option selected per single-select row', async () => {
        const user = userEvent.setup();
        renderDetail();

        await screen.findByRole('heading', { name: DISH.name });

        const sizeGroup = screen.getByRole('group', { name: 'Size' });
        await user.click(within(sizeGroup).getByRole('radio', { name: /Single/ }));

        const selected = within(sizeGroup)
            .getAllByRole('radio')
            .filter(o => o.getAttribute('data-state') === 'on');
        expect(selected).toHaveLength(1);
        expect(within(sizeGroup).getByRole('radio', { name: /Single/ })).toHaveAttribute('data-state', 'on');
    });

    it('steps the quantity with the circular −/+ controls within bounds', async () => {
        const user = userEvent.setup();
        renderDetail();

        await screen.findByRole('heading', { name: DISH.name });

        const decrement = screen.getByRole('button', { name: t('foodDetail.decreaseQuantity') });
        const increment = screen.getByRole('button', { name: t('foodDetail.increaseQuantity') });

        // Floor at 1.
        expect(decrement).toBeDisabled();

        await user.click(increment);
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(decrement).toBeEnabled();

        await user.click(decrement);
        expect(decrement).toBeDisabled();
    });

    it('gates the black split-pill Add control on required options, then enables it', async () => {
        const user = userEvent.setup();
        renderDetail();

        await screen.findByRole('heading', { name: DISH.name });

        const addButton = screen.getByRole('button', { name: new RegExp(t('foodDetail.addToOrder')) });
        expect(addButton).toBeDisabled();
        expect(screen.getByText(t('foodDetail.selectAllRequired'))).toBeInTheDocument();

        const sizeGroup = screen.getByRole('group', { name: 'Size' });
        await user.click(within(sizeGroup).getByRole('radio', { name: /Single/ }));

        expect(addButton).toBeEnabled();
        expect(screen.queryByText(t('foodDetail.selectAllRequired'))).not.toBeInTheDocument();
    });

    it('shows the success banner after adding to the order', async () => {
        const user = userEvent.setup();
        renderDetail();

        await screen.findByRole('heading', { name: DISH.name });

        const sizeGroup = screen.getByRole('group', { name: 'Size' });
        await user.click(within(sizeGroup).getByRole('radio', { name: /Single/ }));

        await user.click(screen.getByRole('button', { name: new RegExp(t('foodDetail.addToOrder')) }));

        await waitFor(() =>
            expect(screen.getByText(t('foodDetail.addedBanner', { name: DISH.name, qty: 1 }))).toBeInTheDocument()
        );
    });
});
