import { memo } from 'react';

import LandingCtaSection from './components/landing-cta-section';
import LandingFaqSection from './components/landing-faq-section';
import LandingFeaturesSection from './components/landing-features-section';
import LandingFooter from './components/landing-footer';
import LandingHeader from './components/landing-header';
import LandingHeroSection from './components/landing-hero-section';
import LandingTrustSection from './components/landing-trust-section';

import { useAppSelector } from '@/core/hooks';

function Landing() {
    const user = useAppSelector(state => state.user.user);
    const isAuthenticated = Boolean(user);

    return (
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
    );
}

export default memo(Landing);
