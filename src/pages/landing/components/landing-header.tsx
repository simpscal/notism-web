import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/components/button';

const NAV_LINKS = [
    { label: 'Foods', to: `/${ROUTES.FOODS.LIST}` },
    { label: 'Log in', to: `/${ROUTES.AUTH.LOGIN}` },
    { label: 'Sign up', to: `/${ROUTES.AUTH.SIGNUP}` },
] as const;

interface LandingHeaderProps {
    isAuthenticated?: boolean;
}

function LandingHeader(props: LandingHeaderProps) {
    const { isAuthenticated = false } = props;

    return (
        <header className='border-b bg-background/90 backdrop-blur'>
            <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6'>
                <Link to={ROUTES.HOME} aria-label='Go to home' className='cursor-pointer'>
                    <h1 className='text-lg font-semibold text-primary tracking-tight transition-opacity hover:opacity-80 md:text-2xl'>
                        Notism
                    </h1>
                </Link>

                <nav className='flex items-center gap-2'>
                    <Button variant='ghost' asChild className='hidden sm:inline-flex'>
                        <Link to={NAV_LINKS[0].to}>{NAV_LINKS[0].label}</Link>
                    </Button>

                    {!isAuthenticated ? (
                        <>
                            <Button variant='ghost' asChild className='hidden sm:inline-flex'>
                                <Link to={NAV_LINKS[1].to}>{NAV_LINKS[1].label}</Link>
                            </Button>

                            <Button size='sm' asChild>
                                <Link to={NAV_LINKS[2].to}>{NAV_LINKS[2].label}</Link>
                            </Button>
                        </>
                    ) : null}
                </nav>
            </div>
        </header>
    );
}

export default memo(LandingHeader);
