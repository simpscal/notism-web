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

    it('floats the content on a light shell over a dark ambient frame carrying inert line-art', () => {
        const { container } = renderLayoutAt('/foods');

        // The outer app background is the dark ambient frame.
        const frame = container.querySelector('.bg-frame');
        expect(frame).not.toBeNull();

        // The frame carries only decoration — hidden from a11y and non-interactive.
        const decoration = frame!.querySelector('[aria-hidden="true"]');
        expect(decoration).not.toBeNull();
        expect(decoration).toHaveClass('pointer-events-none');

        // A single light shell floats inside the frame and holds the content.
        expect(frame!.querySelector('.bg-muted')).not.toBeNull();
    });

    it('reserves crimson for the checkout commit — the toolbar cart pill is ink', async () => {
        localStorage.setItem('cart_items', JSON.stringify([makeItem()]));
        await store.dispatch(loadCart());

        renderLayoutAt('/foods');

        const cartPill = screen.getByRole('link', { name: /cart,/i });
        expect(cartPill).toHaveClass('bg-selected');
        expect(cartPill).not.toHaveClass('bg-primary');

        // The single crimson order-level action is the checkout commit.
        const checkout = screen.getAllByRole('button', { name: t('orderSidebar.checkout') });
        expect(checkout.length).toBeGreaterThan(0);
        expect(checkout[0]).toHaveClass('bg-primary');
    });
});
