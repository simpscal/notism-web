import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import ClientLayout from '../client-layout';

import { i18nReady } from '@/app/i18n/i18n';
import { store } from '@/store';
import { loadCart } from '@/store/cart/cart.thunks';
import { resetStore } from '@/store/root.actions';
import { renderWithProviders } from '@/test/utils';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

// The order banners open live order queries; stub them out so the layout test
// stays focused on the shell structure.
vi.mock('@/features/order', () => ({
    HeldRefundReminderBannerContainer: () => null,
    RefundPaidBannerStack: () => null,
}));

const makeItem = () => ({
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
    isSelected: true,
});

// i18n loads its locale bundle asynchronously; the toolbars call useTranslation
// and suspend until it resolves, so wait for it before rendering the shell.
beforeAll(async () => {
    await i18nReady;
});

beforeEach(() => {
    store.dispatch(resetStore());
    localStorage.clear();
});

afterEach(() => {
    store.dispatch(resetStore());
    localStorage.clear();
});

function renderLayoutAt(path: string) {
    return renderWithProviders(
        <Routes>
            <Route element={<ClientLayout />}>
                <Route path='foods' element={<div>routed page body</div>} />
                <Route path='cart' element={<div>routed page body</div>} />
            </Route>
        </Routes>,
        { initialEntries: [path] }
    );
}

describe('ClientLayout shell', () => {
    it('renders the toolbars and the routed Outlet content', async () => {
        localStorage.setItem('cart_items', JSON.stringify([makeItem()]));
        await store.dispatch(loadCart());

        renderLayoutAt('/foods');

        // The child route still mounts through the <Outlet>.
        expect(screen.getByText('routed page body')).toBeInTheDocument();
        // Desktop + mobile toolbars each expose a cart affordance that routes to
        // /cart; there is no persistent order sidebar in the shell.
        const cartLinks = screen.getAllByRole('link', { name: /cart/i });
        expect(cartLinks.length).toBeGreaterThan(0);
        cartLinks.forEach(link => expect(link).toHaveAttribute('href', '/cart'));
    });

    it('keeps routing unchanged across consumer routes', () => {
        renderLayoutAt('/cart');

        expect(screen.getByText('routed page body')).toBeInTheDocument();
    });
});
