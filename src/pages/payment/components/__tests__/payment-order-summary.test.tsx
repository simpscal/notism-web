import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaymentOrderSummary from '../payment-order-summary';

import { CartItemViewModel } from '@/features/cart/models';
import { renderWithProviders } from '@/test/utils';

function makeItem(overrides: Partial<CartItemViewModel> = {}): CartItemViewModel {
    return {
        id: 'item-1',
        name: 'Test Food',
        description: 'A test food item',
        price: 50000,
        discountPrice: null,
        imageUrl: '',
        category: 'Test',
        quantity: 2,
        stockQuantity: 10,
        quantityUnit: 'portion',
        isSelected: true,
        customisations: [],
        totalSurcharge: 0,
        ...overrides,
    };
}

describe('PaymentOrderSummary', () => {
    it('calculates line total including surcharge when totalSurcharge > 0', () => {
        // effectivePrice = 50000, surcharge = 10000, quantity = 2 → line total 120,000; grand total 999,999 (different)
        const item = makeItem({ totalSurcharge: 10000, quantity: 2 });
        renderWithProviders(<PaymentOrderSummary items={[item]} totalPrice={999999} />);

        // line total = (50000 + 10000) * 2 = 120,000
        expect(screen.getByText('120,000 ₫')).toBeInTheDocument();
        // grand total is a distinct value
        expect(screen.getByText('999,999 ₫')).toBeInTheDocument();
    });

    it('shows customisation label and surcharge badge when totalSurcharge > 0', () => {
        const item = makeItem({
            totalSurcharge: 10000,
            customisations: [
                {
                    groupId: 'g1',
                    groupLabel: 'Size',
                    optionId: 'o1',
                    optionLabel: 'Large (260 g)',
                    surcharge: 10000,
                    availableOptions: [],
                },
            ],
        });
        renderWithProviders(<PaymentOrderSummary items={[item]} totalPrice={999999} />);

        expect(screen.getByText('Large (260 g)')).toBeInTheDocument();
        expect(screen.getByText('+10,000 ₫')).toBeInTheDocument();
    });

    it('calculates line total without surcharge when totalSurcharge is 0', () => {
        // effectivePrice = 50000, surcharge = 0, quantity = 2 → line total 100,000; grand total 999,999 (different)
        const item = makeItem({ totalSurcharge: 0, quantity: 2 });
        renderWithProviders(<PaymentOrderSummary items={[item]} totalPrice={999999} />);

        // line total = 50000 * 2 = 100,000
        expect(screen.getByText('100,000 ₫')).toBeInTheDocument();
        // grand total is a distinct value
        expect(screen.getByText('999,999 ₫')).toBeInTheDocument();
    });

    it('does not show surcharge badge when totalSurcharge is 0', () => {
        const item = makeItem({
            totalSurcharge: 0,
            customisations: [
                {
                    groupId: 'g1',
                    groupLabel: 'Size',
                    optionId: 'o1',
                    optionLabel: 'Regular',
                    surcharge: null,
                    availableOptions: [],
                },
            ],
        });
        renderWithProviders(<PaymentOrderSummary items={[item]} totalPrice={999999} />);

        // Label shown but no "+…" badge
        expect(screen.getByText('Regular')).toBeInTheDocument();
        expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
    });

    it('joins multiple customisation optionLabels with ", "', () => {
        const item = makeItem({
            totalSurcharge: 15000,
            customisations: [
                {
                    groupId: 'g1',
                    groupLabel: 'Size',
                    optionId: 'o1',
                    optionLabel: 'Large (260 g)',
                    surcharge: 10000,
                    availableOptions: [],
                },
                {
                    groupId: 'g2',
                    groupLabel: 'Sauce',
                    optionId: 'o2',
                    optionLabel: 'Extra sauce',
                    surcharge: 5000,
                    availableOptions: [],
                },
            ],
        });
        renderWithProviders(<PaymentOrderSummary items={[item]} totalPrice={999999} />);

        expect(screen.getByText('Large (260 g), Extra sauce')).toBeInTheDocument();
    });

    it('does not show customisation row when customisations array is empty', () => {
        const item = makeItem({ customisations: [], totalSurcharge: 0 });
        renderWithProviders(<PaymentOrderSummary items={[item]} totalPrice={999999} />);

        expect(screen.getByText('Test Food')).toBeInTheDocument();
        expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
    });

    it('displays grand total from totalPrice prop for mixed items', () => {
        // item1: 50000 * 1 = 50,000; item2: (30000+5000)*2 = 70,000; sum = 120,000
        const item1 = makeItem({ id: 'item-1', price: 50000, totalSurcharge: 0, quantity: 1 });
        const item2 = makeItem({ id: 'item-2', price: 30000, totalSurcharge: 5000, quantity: 2, name: 'Food B' });
        renderWithProviders(<PaymentOrderSummary items={[item1, item2]} totalPrice={120000} />);

        // item1 line total: 50,000
        expect(screen.getByText('50,000 ₫')).toBeInTheDocument();
        // item2 line total: 70,000
        expect(screen.getByText('70,000 ₫')).toBeInTheDocument();
        // grand total: 120,000 (from totalPrice prop)
        expect(screen.getByText('120,000 ₫')).toBeInTheDocument();
    });
});
