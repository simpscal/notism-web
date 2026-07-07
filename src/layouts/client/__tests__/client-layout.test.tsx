import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ClientLayout from '../client-layout';

import i18n from '@/app/i18n/i18n';
import { store } from '@/store';
import { loadCart } from '@/store/cart/cart.thunks';
import { resetStore } from '@/store/root.actions';
import { renderWithProviders } from '@/test/utils';

const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, opts);

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
    it('renders the routed Outlet content alongside the persistent order sidebar', async () => {
        localStorage.setItem('cart_items', JSON.stringify([makeItem()]));
        await store.dispatch(loadCart());

        renderLayoutAt('/foods');

        // The child route still mounts through the <Outlet>.
        expect(screen.getByText('routed page body')).toBeInTheDocument();
        // The order sidebar is mounted persistently and reads the cart.
        expect(screen.getAllByText(t('orderSidebar.title')).length).toBeGreaterThan(0);
        expect(screen.getByText('Pho')).toBeInTheDocument();
    });

    it('keeps routing unchanged across consumer routes', () => {
        renderLayoutAt('/cart');

        expect(screen.getByText('routed page body')).toBeInTheDocument();
    });
});
