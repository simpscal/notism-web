import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import OrderDeliveryStatusBadge from '../order-delivery-status-badge';

import { DeliveryStatusEnum } from '@/features/order';
import { getByI18nText, renderWithProviders } from '@/test/utils';

describe('OrderDeliveryStatusBadge', () => {
    it('renders "Order Placed" with the secondary variant when status is Placed', () => {
        renderWithProviders(<OrderDeliveryStatusBadge status={DeliveryStatusEnum.Placed} />);

        const badge = getByI18nText('order.deliveryStatuses.orderPlaced');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-secondary-foreground');
    });

    it('renders "Preparing" with the warning variant when status is Preparing', () => {
        renderWithProviders(<OrderDeliveryStatusBadge status={DeliveryStatusEnum.Preparing} />);

        const badge = getByI18nText('order.deliveryStatuses.preparing');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-warning');
    });

    it('renders "On the Way" with the warning variant when status is OnTheWay', () => {
        renderWithProviders(<OrderDeliveryStatusBadge status={DeliveryStatusEnum.OnTheWay} />);

        const badge = getByI18nText('order.deliveryStatuses.onTheWay');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-warning');
    });

    it('renders "Delivered" with the success variant when status is Delivered', () => {
        renderWithProviders(<OrderDeliveryStatusBadge status={DeliveryStatusEnum.Delivered} />);

        const badge = getByI18nText('order.deliveryStatuses.delivered');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-success');
    });

    it('renders the raw label with a neutral secondary variant for an unknown status', () => {
        renderWithProviders(<OrderDeliveryStatusBadge status={'unmappedStatus' as DeliveryStatusEnum} />);

        const badge = screen.getByText('unmappedStatus');
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('text-secondary-foreground');
    });
});
