import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import SettingsPayment from '../settings-payment';

import { USER_ENDPOINTS } from '@/apis/user/user.constant';
import { UserRoleEnum } from '@/app/enums';
import { buildUrl } from '@/mocks/utils';
import { store } from '@/store';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user';
import { server } from '@/test/server';
import { getByI18nText, queryByI18nText, renderWithProviders } from '@/test/utils';

const BANK_ACCOUNT_URL = buildUrl(USER_ENDPOINTS.BANK_ACCOUNT);

const toastSuccessMock = vi.fn();

vi.mock('sonner', () => ({
    toast: {
        success: (...args: unknown[]) => toastSuccessMock(...args),
    },
}));

beforeAll(() => server.listen());
beforeEach(() => {
    store.dispatch(
        setUser({
            id: '1',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            avatarUrl: null,
            role: UserRoleEnum.Admin,
        })
    );
});
afterEach(() => {
    server.resetHandlers();
    toastSuccessMock.mockClear();
    store.dispatch(resetStore());
});
afterAll(() => server.close());

describe('SettingsPayment (admin variant)', () => {
    it('renders loading skeletons initially', () => {
        server.use(
            http.get(BANK_ACCOUNT_URL, async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return HttpResponse.json(null);
            })
        );

        const { container } = renderWithProviders(<SettingsPayment />);

        expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0);
    });

    it('renders error state with a working retry button when fetch fails', async () => {
        let attempt = 0;

        server.use(
            http.get(BANK_ACCOUNT_URL, () => {
                attempt += 1;

                if (attempt === 1) {
                    return HttpResponse.error();
                }

                return HttpResponse.json(null);
            })
        );

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(getByI18nText('settings.payment.loadErrorTitle')).toBeInTheDocument();
        });

        const retryButton = screen.getByRole('button', { name: /retry/i });
        await userEvent.click(retryButton);

        await waitFor(() => {
            expect(screen.getByLabelText('Bank Name')).toBeInTheDocument();
        });

        expect(queryByI18nText('settings.payment.loadErrorTitle')).not.toBeInTheDocument();
    });

    it('renders empty form when API returns null', async () => {
        server.use(http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null)));

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByLabelText('Bank Name')).toBeInTheDocument();
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

    it('shows validation errors when required fields are emptied', async () => {
        server.use(http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null)));

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByLabelText('Bank Name')).toBeInTheDocument();
        });

        const bankNameInput = screen.getByLabelText('Bank Name');
        await userEvent.type(bankNameInput, 'Test');

        await waitFor(() => {
            const saveButton = screen.getByRole('button', { name: /save changes/i });
            expect(saveButton).not.toBeDisabled();
        });

        await userEvent.clear(bankNameInput);

        await waitFor(() => {
            expect(getByI18nText('settings.payment.bankNameRequired')).toBeInTheDocument();
        });
    });

    it('submits form and shows success confirmation on save', async () => {
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
            expect(toastSuccessMock).toHaveBeenCalledWith('Bank account saved successfully!');
        });
    });
});
