import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LandingToolbarDesktop from '../landing-toolbar-desktop';

import { renderWithProviders } from '@/test/utils';

describe('LandingToolbarDesktop', () => {
    it('renders the brand name', () => {
        renderWithProviders(<LandingToolbarDesktop isAuthenticated={false} />);
        expect(screen.getByText('Notism')).toBeInTheDocument();
    });

    it('renders nav links', () => {
        renderWithProviders(<LandingToolbarDesktop isAuthenticated={false} />);
        expect(screen.getByText(/menu/i)).toBeInTheDocument();
        expect(screen.getByText(/how it works/i)).toBeInTheDocument();
        expect(screen.getByText(/faq/i)).toBeInTheDocument();
    });

    it('renders sign up and log in buttons when not authenticated', () => {
        renderWithProviders(<LandingToolbarDesktop isAuthenticated={false} />);
        expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
    });

    it('renders browse menu button when authenticated', () => {
        renderWithProviders(<LandingToolbarDesktop isAuthenticated={true} />);
        expect(screen.getByRole('link', { name: /browse menu/i })).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /log in/i })).not.toBeInTheDocument();
    });

    it('renders as a sticky header', () => {
        renderWithProviders(<LandingToolbarDesktop isAuthenticated={false} />);
        const header = screen.getByRole('banner');
        expect(header.className).toMatch(/sticky/);
    });
});
