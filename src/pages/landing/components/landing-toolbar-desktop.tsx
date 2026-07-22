import { UtensilsCrossed } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/uis/button';

interface LandingToolbarDesktopProps {
    isAuthenticated: boolean;
}

function LandingToolbarDesktop({ isAuthenticated }: LandingToolbarDesktopProps) {
    const { t } = useTranslation();

    const NAV_LINKS = [
        { label: t('landing.toolbar.menu'), to: `/${ROUTES.FOODS.LIST}`, hash: false },
        { label: t('landing.toolbar.howItWorks'), to: '#features', hash: true },
        { label: t('landing.toolbar.faq'), to: '#faq', hash: true },
    ] as const;

    const navClassName =
        'rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground';

    return (
        <header className='sticky top-0 z-50 hidden h-16 w-full border-b bg-background/90 backdrop-blur lg:flex'>
            <div className='mx-auto flex h-full w-full max-w-7xl items-center px-6'>
                {/* Left — brand */}
                <div className='flex flex-1 items-center'>
                    <Link
                        to={ROUTES.HOME}
                        className='text-lg font-semibold text-primary tracking-tight transition-opacity hover:opacity-80'
                    >
                        Notism
                    </Link>
                </div>

                {/* Center — nav */}
                <nav className='flex items-center gap-1'>
                    {NAV_LINKS.map(link =>
                        link.hash ? (
                            <a key={link.label} href={link.to} className={navClassName}>
                                {link.label}
                            </a>
                        ) : (
                            <Link key={link.label} to={link.to} className={navClassName}>
                                {link.label}
                            </Link>
                        )
                    )}
                </nav>

                {/* Right — CTA */}
                <div className='flex flex-1 items-center justify-end gap-2'>
                    {isAuthenticated ? (
                        <Button size='sm' className='rounded-full' asChild>
                            <Link to={`/${ROUTES.FOODS.LIST}`}>
                                <UtensilsCrossed className='mr-1.5 h-4 w-4' />
                                {t('landing.toolbar.browseMenu')}
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant='ghost' size='sm' className='rounded-full' asChild>
                                <Link to={`/${ROUTES.AUTH.SIGNUP}`}>{t('landing.toolbar.signUp')}</Link>
                            </Button>
                            <Button size='sm' className='rounded-full' asChild>
                                <Link to={`/${ROUTES.AUTH.LOGIN}`}>{t('landing.toolbar.logIn')}</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default memo(LandingToolbarDesktop);
