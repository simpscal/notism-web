import { Menu, UtensilsCrossed, X } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/sheet';

interface LandingToolbarMobileProps {
    isAuthenticated: boolean;
}

function LandingToolbarMobile({ isAuthenticated }: LandingToolbarMobileProps) {
    const { t } = useTranslation();
    const [sheetOpen, setSheetOpen] = useState(false);

    const NAV_LINKS = [
        { label: t('landing.toolbar.menu'), href: `/${ROUTES.FOODS.LIST}` },
        { label: t('landing.toolbar.howItWorks'), href: '#features' },
        { label: t('landing.toolbar.faq'), href: '#faq' },
    ] as const;

    return (
        <>
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side='left' className='w-72 px-0 lg:hidden'>
                    <SheetHeader className='px-4 pb-2'>
                        <SheetTitle className='text-primary font-semibold tracking-tight text-lg'>Notism</SheetTitle>
                    </SheetHeader>
                    <nav className='flex flex-col gap-1 px-2 mt-2'>
                        {NAV_LINKS.map(link => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setSheetOpen(false)}
                                className='flex items-center gap-3 rounded-full px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground'
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                    <div className='mt-4 border-t px-4 pt-4 space-y-2'>
                        {isAuthenticated ? (
                            <Button className='w-full rounded-full gap-2' asChild>
                                <Link to={`/${ROUTES.FOODS.LIST}`} onClick={() => setSheetOpen(false)}>
                                    <UtensilsCrossed className='h-4 w-4' />
                                    {t('landing.toolbar.browseMenu')}
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button variant='outline' className='w-full rounded-full' asChild>
                                    <Link to={`/${ROUTES.AUTH.SIGNUP}`} onClick={() => setSheetOpen(false)}>
                                        {t('landing.toolbar.signUp')}
                                    </Link>
                                </Button>
                                <Button className='w-full rounded-full' asChild>
                                    <Link to={`/${ROUTES.AUTH.LOGIN}`} onClick={() => setSheetOpen(false)}>
                                        {t('landing.toolbar.logIn')}
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Fixed bottom bar */}
            <div className='fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-t bg-background/90 backdrop-blur px-4 lg:hidden'>
                <span className='text-base font-semibold text-primary tracking-tight'>Notism</span>
                <div className='flex items-center gap-2'>
                    {isAuthenticated ? (
                        <Button size='sm' className='rounded-full' asChild>
                            <Link to={`/${ROUTES.FOODS.LIST}`}>
                                <UtensilsCrossed className='mr-1.5 h-4 w-4' />
                                {t('landing.toolbar.browseMenu')}
                            </Link>
                        </Button>
                    ) : (
                        <Button size='sm' className='rounded-full' asChild>
                            <Link to={`/${ROUTES.AUTH.LOGIN}`}>{t('landing.toolbar.logIn')}</Link>
                        </Button>
                    )}
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <button
                                aria-label='Open navigation menu'
                                className='flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground'
                            >
                                {sheetOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                            </button>
                        </SheetTrigger>
                    </Sheet>
                </div>
            </div>
        </>
    );
}

export default memo(LandingToolbarMobile);
