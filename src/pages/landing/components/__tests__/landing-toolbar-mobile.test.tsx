import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import LandingToolbarMobile from '../landing-toolbar-mobile';

import { renderWithProviders } from '@/test/utils';

describe('LandingToolbarMobile', () => {
    it('renders the brand name in the bottom bar', () => {
        renderWithProviders(<LandingToolbarMobile isAuthenticated={false} />);
        expect(screen.getByText('Notism')).toBeInTheDocument();
    });

    it('renders log in button when not authenticated', () => {
        renderWithProviders(<LandingToolbarMobile isAuthenticated={false} />);
        expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
    });

    it('renders browse button when authenticated', () => {
        renderWithProviders(<LandingToolbarMobile isAuthenticated={true} />);
        expect(screen.getByRole('link', { name: /browse/i })).toBeInTheDocument();
    });

    it('renders the hamburger menu button with accessible label', () => {
        renderWithProviders(<LandingToolbarMobile isAuthenticated={false} />);
        expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument();
    });

    it('hamburger button meets minimum touch target size', () => {
        renderWithProviders(<LandingToolbarMobile isAuthenticated={false} />);
        const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
        expect(menuButton.className).toMatch(/min-h-\[44px\]/);
        expect(menuButton.className).toMatch(/min-w-\[44px\]/);
    });

    it('opens the sheet nav drawer when hamburger is clicked', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LandingToolbarMobile isAuthenticated={false} />);
        const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
        await user.click(menuButton);
        expect(screen.getByText(/how it works/i)).toBeInTheDocument();
        expect(screen.getByText(/faq/i)).toBeInTheDocument();
    });

    it('renders sign up and log in links in drawer when not authenticated and drawer is open', async () => {
        const user = userEvent.setup();
        renderWithProviders(<LandingToolbarMobile isAuthenticated={false} />);
        const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
        await user.click(menuButton);
        expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });
});
