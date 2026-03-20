import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';

function LandingFooter() {
    return (
        <footer className='border-t'>
            <div className='mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6'>
                <p className='text-xs text-muted-foreground'>
                    © {new Date().getFullYear()} Notism. All rights reserved.
                </p>
                <div className='flex items-center gap-4 text-xs'>
                    <Link
                        to={`/${ROUTES.FOODS.LIST}`}
                        className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                        Foods
                    </Link>
                    <Link
                        to={`/${ROUTES.AUTH.LOGIN}`}
                        className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                        Log in
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default memo(LandingFooter);
