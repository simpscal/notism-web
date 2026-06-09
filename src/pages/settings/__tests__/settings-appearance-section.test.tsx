import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import SettingsAppearanceSection from '../components/settings-appearance-section';

import { ThemeProvider } from '@/core/contexts/theme.context';
import { renderWithProviders } from '@/test/utils';

const successToast = vi.fn();

vi.mock('sonner', () => ({
    toast: {
        success: (...args: unknown[]) => successToast(...args),
        error: vi.fn(),
    },
}));

function renderWithTheme(ui: ReactElement, defaultTheme: 'light' | 'dark' | 'system' = 'system') {
    return renderWithProviders(<ThemeProvider defaultTheme={defaultTheme}>{ui}</ThemeProvider>);
}

beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: vi.fn().mockImplementation((query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });
});

afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
});

describe('SettingsAppearanceSection', () => {
    it('renders the pane heading, theme legend, and footer save action', () => {
        renderWithTheme(<SettingsAppearanceSection />, 'system');

        expect(screen.getByRole('heading', { level: 2, name: /^appearance$/i })).toBeInTheDocument();
        expect(screen.getByText(/customize how the application looks/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('renders all three theme options as radios', () => {
        renderWithTheme(<SettingsAppearanceSection />, 'system');

        expect(screen.getByRole('radio', { name: /light/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /dark/i })).toBeInTheDocument();
        expect(screen.getByRole('radio', { name: /system/i })).toBeInTheDocument();
    });

    it('marks the current theme preference as the selected option', () => {
        renderWithTheme(<SettingsAppearanceSection />, 'dark');

        expect(screen.getByRole('radio', { name: /dark/i })).toBeChecked();
        expect(screen.getByRole('radio', { name: /light/i })).not.toBeChecked();
        expect(screen.getByRole('radio', { name: /system/i })).not.toBeChecked();
    });

    it('shows the currently-applied theme helper text reflecting the live theme', () => {
        renderWithTheme(<SettingsAppearanceSection />, 'light');

        const applied = screen.getByText(/currently applied/i);
        expect(within(applied).getByText(/^light$/i)).toBeInTheDocument();
    });

    it('applies the new theme immediately on selection and moves the selection marker', async () => {
        renderWithTheme(<SettingsAppearanceSection />, 'system');

        await userEvent.click(screen.getByRole('radio', { name: /dark/i }));

        expect(screen.getByRole('radio', { name: /dark/i })).toBeChecked();
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('vite-ui-theme')).toBe('dark');
    });

    it('fires a success toast when Save changes is clicked', async () => {
        renderWithTheme(<SettingsAppearanceSection />, 'system');

        await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

        expect(successToast).toHaveBeenCalledWith('Appearance preferences saved!');
    });
});
