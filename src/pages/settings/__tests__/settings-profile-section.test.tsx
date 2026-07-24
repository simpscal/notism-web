import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import SettingsProfileSection from '../components/settings-profile-section';

import { USER_ENDPOINTS } from '@/apis/user/user.constant';
import { UserRoleType } from '@/app/types';
import { buildUrl } from '@/mocks/utils';
import { store } from '@/store';
import { setUser } from '@/store/user';
import { server } from '@/test/server';
import { getByI18nText, renderWithProviders } from '@/test/utils';

const PROFILE_URL = buildUrl(USER_ENDPOINTS.PROFILE);

const successToast = vi.fn();

vi.mock('sonner', () => ({
    toast: {
        success: (...args: unknown[]) => successToast(...args),
        error: vi.fn(),
    },
}));

function seedUser() {
    store.dispatch(
        setUser({
            id: '1',
            firstName: 'Mai',
            lastName: 'Nguyen',
            email: 'mai@example.com',
            avatarUrl: null,
            role: UserRoleType.User,
        })
    );
}

beforeAll(() => server.listen());
afterEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
});
afterAll(() => server.close());

beforeEach(() => {
    seedUser();
});

describe('SettingsProfileSection', () => {
    it('renders the heading, grouped fields, and footer actions in the success/default state', () => {
        renderWithProviders(<SettingsProfileSection />);

        expect(screen.getByRole('heading', { level: 2, name: /^profile$/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/first name/i)).toHaveValue('Mai');
        expect(screen.getByLabelText(/last name/i)).toHaveValue('Nguyen');
        expect(screen.getByLabelText(/email/i)).toHaveValue('mai@example.com');
        expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('keeps the email field disabled', () => {
        renderWithProviders(<SettingsProfileSection />);

        expect(screen.getByLabelText(/email/i)).toBeDisabled();
    });

    it('shows an inline validation error beneath the field and issues no API call when input is invalid', async () => {
        const updateHandler = vi.fn(() => HttpResponse.json(null));
        server.use(http.put(PROFILE_URL, updateHandler));

        renderWithProviders(<SettingsProfileSection />);

        const lastName = screen.getByLabelText(/last name/i);
        await userEvent.clear(lastName);

        await waitFor(() => {
            const error = getByI18nText('auth.validation.lastNameRequired');
            expect(error).toBeInTheDocument();
            expect(error).toHaveAttribute('data-slot', 'field-error');
        });

        expect(lastName).toHaveAttribute('aria-invalid', 'true');

        const saveButton = screen.getByRole('button', { name: /save changes/i });
        await userEvent.click(saveButton);

        expect(updateHandler).not.toHaveBeenCalled();
    });

    it('shows a success toast and keeps the updated values displayed after saving valid changes', async () => {
        server.use(http.put(PROFILE_URL, () => HttpResponse.json(null, { status: 200 })));

        renderWithProviders(<SettingsProfileSection />);

        const lastName = screen.getByLabelText(/last name/i);
        await userEvent.clear(lastName);
        await userEvent.type(lastName, 'Tran');

        const saveButton = await screen.findByRole('button', { name: /save changes/i });
        await waitFor(() => expect(saveButton).not.toBeDisabled());
        await userEvent.click(saveButton);

        await waitFor(() => {
            expect(successToast).toHaveBeenCalledWith('Profile updated successfully!');
        });

        expect(screen.getByLabelText(/last name/i)).toHaveValue('Tran');
    });
});
