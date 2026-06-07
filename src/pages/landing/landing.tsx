import { memo } from 'react';

import LandingCtaSection from './components/landing-cta-section';
import LandingFaqSection from './components/landing-faq-section';
import LandingFeaturesSection from './components/landing-features-section';
import LandingFooter from './components/landing-footer';
import LandingHeroSection from './components/landing-hero-section';
import LandingToolbarDesktop from './components/landing-toolbar-desktop';
import LandingToolbarMobile from './components/landing-toolbar-mobile';
import LandingTrustSection from './components/landing-trust-section';

import { useAppSelector } from '@/core/hooks';

function Landing() {
    const user = useAppSelector(state => state.user.user);
    const isAuthenticated = Boolean(user);

    return (
        <div className='flex h-screen w-full flex-col overflow-hidden bg-background'>
            <LandingToolbarDesktop isAuthenticated={isAuthenticated} />
            <LandingToolbarMobile isAuthenticated={isAuthenticated} />
            <main className='flex-1 overflow-y-auto overflow-x-hidden pb-16 lg:pb-0'>
                <LandingHeroSection />
                <LandingTrustSection />
                <LandingFeaturesSection />
                <LandingFaqSection />
                <LandingCtaSection isAuthenticated={isAuthenticated} />
                <LandingFooter />
            </main>
        </div>
    );
}

export default memo(Landing);
