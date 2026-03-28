import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';

function LandingFooter() {
    const { t } = useTranslation();

    return (
        <footer className='border-t'>
            <div className='mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6'>
                <p className='text-xs text-muted-foreground'>
                    © {new Date().getFullYear()} Notism. {t('landing.footer.allRightsReserved')}
                </p>
                <div className='flex items-center gap-4 text-xs'>
                    <Link
                        to={`/${ROUTES.FOODS.LIST}`}
                        className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                        {t('landing.header.foods')}
                    </Link>
                    <Link
                        to={`/${ROUTES.AUTH.LOGIN}`}
                        className='text-muted-foreground hover:text-foreground transition-colors'
                    >
                        {t('landing.header.logIn')}
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default memo(LandingFooter);
