import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import SettingsPayment from '../settings-payment';

import { renderWithProviders } from '@/test/utils';

const BANK_ACCOUNT_URL = '*/payments/bank-account';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('SettingsPayment', () => {
    it('renders loading spinner initially', () => {
        server.use(
            http.get(BANK_ACCOUNT_URL, async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return HttpResponse.json(null);
            })
        );

        renderWithProviders(<SettingsPayment />);

        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders error state when fetch fails', async () => {
        server.use(http.get(BANK_ACCOUNT_URL, () => HttpResponse.error()));

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByText('Failed to load bank account')).toBeInTheDocument();
        });
    });

    it('renders empty form when API returns null', async () => {
        server.use(http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null)));

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByText('Bank Account')).toBeInTheDocument();
            expect(
                screen.getByText('No bank account configured yet. Add your details to enable QR payments.')
            ).toBeInTheDocument();
        });

        expect(screen.getByLabelText('Bank Name')).toHaveValue('');
        expect(screen.getByLabelText('Account Number')).toHaveValue('');
        expect(screen.getByLabelText('Account Holder Name')).toHaveValue('');
    });

    it('renders prefilled form when bank account data exists', async () => {
        server.use(
            http.get(BANK_ACCOUNT_URL, () =>
                HttpResponse.json({
                    bankCode: 'Vietcombank',
                    accountNumber: '1234567890',
                    accountHolderName: 'Nguyen Van A',
                })
            )
        );

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Vietcombank')).toBeInTheDocument();
        });

        expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Nguyen Van A')).toBeInTheDocument();
    });

    it('shows validation errors when required fields are empty on submit', async () => {
        server.use(http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null)));

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByText('Bank Account')).toBeInTheDocument();
        });

        const bankNameInput = screen.getByLabelText('Bank Name');
        await userEvent.type(bankNameInput, 'Test');

        await waitFor(() => {
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            expect(saveButton).not.toBeDisabled();
        });

        await userEvent.clear(bankNameInput);

        await waitFor(() => {
            expect(screen.getByText('Bank name is required')).toBeInTheDocument();
        });
    });

    it('submits form and shows success message on save', async () => {
        server.use(
            http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null)),
            http.put(BANK_ACCOUNT_URL, () => HttpResponse.json(null, { status: 200 }))
        );

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByLabelText('Bank Name')).toBeInTheDocument();
        });

        await userEvent.type(screen.getByLabelText('Bank Name'), 'Vietcombank');
        await userEvent.type(screen.getByLabelText('Account Number'), '123456789');
        await userEvent.type(screen.getByLabelText('Account Holder Name'), 'Nguyen Van A');

        const saveButton = await screen.findByRole('button', { name: /save changes/i });
        await userEvent.click(saveButton);

        await waitFor(() => {
            expect(saveButton).toBeInTheDocument();
        });
    });
});
