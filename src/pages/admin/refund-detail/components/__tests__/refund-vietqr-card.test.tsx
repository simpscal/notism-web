import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import RefundVietQrCard from '../refund-vietqr-card';

import { getByI18nText, renderWithProviders } from '@/test/utils';

const REFUND_ID = '3f1a2b3c-4d5e-6f70-8192-a3b4c5d6e7f8';
const N_FORMAT = '3f1a2b3c4d5e6f708192a3b4c5d6e7f8';

function renderCard(props: Partial<React.ComponentProps<typeof RefundVietQrCard>> = {}) {
    return renderWithProviders(
        <RefundVietQrCard
            refundId={REFUND_ID}
            amount={485_000}
            bankCode='VCB'
            accountNumber='1023456789'
            accountHolderName='Nguyen Van A'
            {...props}
        />
    );
}

describe('RefundVietQrCard', () => {
    it('renders the SePay VietQR image encoding the payout account, full amount, and N-format refund id', () => {
        renderCard();

        const img = screen.getByRole('img');
        const src = new URL(img.getAttribute('src') ?? '');

        expect(`${src.origin}${src.pathname}`).toBe('https://qr.sepay.vn/img');
        expect(src.searchParams.get('bank')).toBe('VCB');
        expect(src.searchParams.get('acc')).toBe('1023456789');
        expect(src.searchParams.get('amount')).toBe('485000');
        expect((src.searchParams.get('des') ?? '').split('-')[0]).toBe(N_FORMAT);
    });

    it('shows the payout fields and the full amount', () => {
        renderCard();

        expect(screen.getByText('VCB')).toBeInTheDocument();
        expect(screen.getByText('1023456789')).toBeInTheDocument();
        expect(screen.getByText('Nguyen Van A')).toBeInTheDocument();
        expect(screen.getByText('485,000 ₫')).toBeInTheDocument();
    });

    it('displays the N-format content token that the QR actually encodes', () => {
        renderCard();

        const tokens = screen.getAllByText(N_FORMAT);
        expect(tokens.length).toBeGreaterThan(0);
    });

    it('renders the waiting-for-transfer caption', () => {
        renderCard();

        expect(getByI18nText('admin.refundDetail.qrWaiting')).toBeInTheDocument();
    });

    it('renders a missing payout details state without a QR image when bank details are absent', () => {
        renderCard({ bankCode: null, accountNumber: null, accountHolderName: null });

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(getByI18nText('admin.refundDetail.qrMissingTitle')).toBeInTheDocument();
    });

    it('treats empty-string bank details as missing payout details', () => {
        renderCard({ bankCode: '', accountNumber: '' });

        expect(screen.queryByRole('img')).not.toBeInTheDocument();
        expect(getByI18nText('admin.refundDetail.qrMissingTitle')).toBeInTheDocument();
    });
});
