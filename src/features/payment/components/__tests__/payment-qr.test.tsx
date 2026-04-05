import { screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import PaymentQr from '../payment-qr';

import i18n from '@/app/i18n/i18n';
import { renderWithProviders } from '@/test/utils';

const t = (key: string) => i18n.t(key);

const UNPAID_BANKING_ORDER_WITH_QR = {
    paymentMethod: 'banking',
    paymentStatus: 'unpaid',
    paymentQr: {
        bankCode: 'VCB',
        accountNumber: '1234567890',
        accountHolderName: 'Nguyen Van A',
        amount: 150000,
        orderReference: 'ORD-ABC123',
    },
    slugId: 'ABC123',
    paidAt: null,
};

const PAID_BANKING_ORDER = {
    paymentMethod: 'banking',
    paymentStatus: 'paid',
    paymentQr: null,
    slugId: 'ABC123',
    paidAt: '2024-03-15T10:30:00Z',
};

const COD_ORDER = {
    paymentMethod: 'cashOnDelivery',
    paymentStatus: 'unpaid',
    paymentQr: null,
    slugId: 'ABC123',
    paidAt: null,
};

const BANKING_ORDER_NO_BANK_CONFIG = {
    paymentMethod: 'banking',
    paymentStatus: 'unpaid',
    paymentQr: null,
    slugId: 'ABC123',
    paidAt: null,
};

describe('PaymentQr', () => {
    it('renders nothing for COD orders', () => {
        const { container } = renderWithProviders(<PaymentQr {...COD_ORDER} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders QR payment card for unpaid banking order with bank configured', () => {
        renderWithProviders(<PaymentQr {...UNPAID_BANKING_ORDER_WITH_QR} />);

        expect(screen.getByText(t('payment.qr.completePayment'))).toBeInTheDocument();
        expect(screen.getByText(t('payment.qr.scanDescription'))).toBeInTheDocument();

        const qrImg = screen.getByAltText('VietQR payment code for order ABC123');
        expect(qrImg).toBeInTheDocument();
        expect(qrImg.getAttribute('src')).toContain('VCB-1234567890-compact2.jpg');
        expect(qrImg.getAttribute('src')).toContain('amount=150000');
        expect(qrImg.getAttribute('src')).toContain('addInfo=ORD-ABC123');
    });

    it('renders bank details in QR payment card', () => {
        renderWithProviders(<PaymentQr {...UNPAID_BANKING_ORDER_WITH_QR} />);

        expect(screen.getByText('VCB')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
        expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
        expect(screen.getByText('150.000 ₫')).toBeInTheDocument();
    });

    it('renders order reference note', () => {
        renderWithProviders(<PaymentQr {...UNPAID_BANKING_ORDER_WITH_QR} />);

        expect(screen.getByText(new RegExp(t('payment.qr.includeReference')))).toBeInTheDocument();
        expect(screen.getByText('ABC123')).toBeInTheDocument();
    });

    it('swaps QR image for ErrorState fallback on image load error', () => {
        renderWithProviders(<PaymentQr {...UNPAID_BANKING_ORDER_WITH_QR} />);

        const qrImg = screen.getByAltText('VietQR payment code for order ABC123');
        fireEvent.error(qrImg);

        expect(screen.getByText(t('payment.qr.qrUnavailable'))).toBeInTheDocument();
        expect(screen.queryByAltText('VietQR payment code for order ABC123')).not.toBeInTheDocument();
    });

    it('renders Payment Confirmed banner for paid banking order', () => {
        renderWithProviders(<PaymentQr {...PAID_BANKING_ORDER} />);

        expect(screen.getByText(t('payment.qr.confirmed'))).toBeInTheDocument();
        const card = screen.getByRole('status');
        expect(card).toBeInTheDocument();
    });

    it('renders Payment Details Unavailable error state when bank is not configured', () => {
        renderWithProviders(<PaymentQr {...BANKING_ORDER_NO_BANK_CONFIG} />);

        expect(screen.getByText(t('payment.qr.unavailableTitle'))).toBeInTheDocument();
        expect(screen.getByText(t('payment.qr.unavailableDescription'))).toBeInTheDocument();
    });
});
