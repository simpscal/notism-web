import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import SettingsPayment from '../settings-payment';

import { UserRoleEnum } from '@/app/enums';
import { store } from '@/store';
import { resetStore } from '@/store/root.actions';
import { setUser } from '@/store/user';
import { renderWithProviders } from '@/test/utils';

const BANK_ACCOUNT_URL = '*/users/bank-account';

const toastSuccessMock = vi.fn();

vi.mock('sonner', () => ({
    toast: {
        success: (...args: unknown[]) => toastSuccessMock(...args),
    },
}));

const server = setupServer();

beforeAll(() => server.listen());
beforeEach(() => {
    store.dispatch(
        setUser({
            id: '2',
            firstName: 'Mai',
            lastName: 'Nguyen',
            email: 'mai@example.com',
            avatarUrl: null,
            role: UserRoleEnum.User,
        })
    );
});
afterEach(() => {
    server.resetHandlers();
    toastSuccessMock.mockClear();
    store.dispatch(resetStore());
});
afterAll(() => server.close());

describe('SettingsPayment (customer variant)', () => {
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

    it('renders load-error state with a working retry button when fetch fails', async () => {
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
            expect(screen.getByText('Failed to load bank details')).toBeInTheDocument();
        });

        await userEvent.click(screen.getByRole('button', { name: /retry/i }));

        await waitFor(() => {
            expect(screen.getByLabelText('Bank name')).toBeInTheDocument();
        });

        expect(screen.queryByText('Failed to load bank details')).not.toBeInTheDocument();
    });

    it('renders an empty form when no bank details exist yet', async () => {
        server.use(http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null)));

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByLabelText('Bank name')).toBeInTheDocument();
        });

        expect(screen.getByLabelText('Bank name')).toHaveValue('');
        expect(screen.getByLabelText('Account number')).toHaveValue('');
        expect(screen.getByLabelText('Account holder name')).toHaveValue('');
    });

    it('pre-fills the form from the saved bank account', async () => {
        server.use(
            http.get(BANK_ACCOUNT_URL, () =>
                HttpResponse.json({
                    bankCode: 'Vietcombank',
                    accountNumber: '1023456789',
                    accountHolderName: 'Nguyen Van A',
                })
            )
        );

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByDisplayValue('Vietcombank')).toBeInTheDocument();
        });

        expect(screen.getByDisplayValue('1023456789')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Nguyen Van A')).toBeInTheDocument();
    });

    it('blocks save with inline validation when a required field is empty', async () => {
        server.use(http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null)));

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByLabelText('Bank name')).toBeInTheDocument();
        });

        const bankNameInput = screen.getByLabelText('Bank name');
        await userEvent.type(bankNameInput, 'Test');

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /save changes/i })).not.toBeDisabled();
        });

        await userEvent.clear(bankNameInput);

        await waitFor(() => {
            expect(screen.getByText('Bank name is required')).toBeInTheDocument();
        });

        expect(screen.getByRole('button', { name: /save changes/i })).toBeDisabled();
    });

    it('saves to /users/bank-account and fires a success toast', async () => {
        const putBody = vi.fn();

        server.use(
            http.get(BANK_ACCOUNT_URL, () => HttpResponse.json(null)),
            http.put(BANK_ACCOUNT_URL, async ({ request }) => {
                putBody(await request.json());
                return HttpResponse.json(null, { status: 200 });
            })
        );

        renderWithProviders(<SettingsPayment />);

        await waitFor(() => {
            expect(screen.getByLabelText('Bank name')).toBeInTheDocument();
        });

        await userEvent.type(screen.getByLabelText('Bank name'), 'Vietcombank');
        await userEvent.type(screen.getByLabelText('Account number'), '1023456789');
        await userEvent.type(screen.getByLabelText('Account holder name'), 'Nguyen Van A');

        await userEvent.click(await screen.findByRole('button', { name: /save changes/i }));

        await waitFor(() => {
            expect(toastSuccessMock).toHaveBeenCalledWith('Bank account details saved');
        });

        expect(putBody).toHaveBeenCalledWith({
            bankCode: 'Vietcombank',
            accountNumber: '1023456789',
            accountHolderName: 'Nguyen Van A',
        });
    });
});
