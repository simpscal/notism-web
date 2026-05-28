import { configureStore } from '@reduxjs/toolkit';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import '../../app/i18n/i18n';

import LandingCtaSection from '../../pages/landing/components/landing-cta-section';
import LandingFaqSection from '../../pages/landing/components/landing-faq-section';
import LandingFeaturesSection from '../../pages/landing/components/landing-features-section';
import LandingFooter from '../../pages/landing/components/landing-footer';
import LandingHeader from '../../pages/landing/components/landing-header';
import LandingHeroSection from '../../pages/landing/components/landing-hero-section';
import LandingTrustSection from '../../pages/landing/components/landing-trust-section';
import authReducer from '../../store/auth/auth.slice';
import cartReducer from '../../store/cart/cart.slice';
import foodReducer from '../../store/food/food.slice';
import userReducer, { setUser } from '../../store/user/user.slice';

// ---------------------------------------------------------------------------
// Store factory — creates an isolated store instance per story so state
// does not bleed between stories rendered in the same Storybook session.
// ---------------------------------------------------------------------------

function makeStore(preloadUser = false) {
    const s = configureStore({
        reducer: {
            auth: authReducer,
            user: userReducer,
            cart: cartReducer,
            food: foodReducer,
        },
    });

    if (preloadUser) {
        s.dispatch(
            setUser({
                id: '1',
                firstName: 'Alex',
                lastName: 'Rivera',
                email: 'alex.rivera@example.com',
                avatarUrl: 'https://placehold.co/40x40?text=AR',
            })
        );
    }

    return s;
}

// ---------------------------------------------------------------------------
// Shared QueryClient — no network calls in stories; all queries are idle.
// ---------------------------------------------------------------------------

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false, staleTime: Infinity },
        mutations: { retry: false },
    },
});

// ---------------------------------------------------------------------------
// Page wrapper — composes sections in the same order as landing.tsx without
// importing the page component directly (which reads Redux state internally).
// Each story passes isAuthenticated explicitly to header and CTA.
// ---------------------------------------------------------------------------

interface LandingPageProps {
    isAuthenticated?: boolean;
    preloadUser?: boolean;
}

function LandingPage({ isAuthenticated = false, preloadUser = false }: LandingPageProps) {
    const store = makeStore(preloadUser);

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/']}>
                    <div className='flex h-screen w-full flex-col overflow-hidden bg-background'>
                        <LandingHeader isAuthenticated={isAuthenticated} />
                        <main className='flex-1 overflow-y-auto overflow-x-hidden'>
                            <LandingHeroSection />
                            <LandingTrustSection />
                            <LandingFeaturesSection />
                            <LandingFaqSection />
                            <LandingCtaSection isAuthenticated={isAuthenticated} />
                            <LandingFooter />
                        </main>
                    </div>
                </MemoryRouter>
            </QueryClientProvider>
        </Provider>
    );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta = {
    title: 'Surfaces/Landing',
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj;

// ---------------------------------------------------------------------------
// Default — visitor who has not signed in.
// Header shows "Sign up" and "Log in" nav links.
// CTA section shows the "Sign up" button.
// ---------------------------------------------------------------------------

export const Default: Story = {
    name: 'Default (Unauthenticated)',
    render: () => <LandingPage isAuthenticated={false} preloadUser={false} />,
};

// ---------------------------------------------------------------------------
// Authenticated — signed-in user browsing back to the landing page.
// Header hides auth nav links; CTA section shows only "Browse foods".
// ---------------------------------------------------------------------------

export const Authenticated: Story = {
    name: 'Authenticated',
    render: () => <LandingPage isAuthenticated={true} preloadUser={true} />,
};
