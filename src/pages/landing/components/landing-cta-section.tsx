import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/app/constants';
import { Button } from '@/uis/button';

interface LandingCtaSectionProps {
    isAuthenticated?: boolean;
}

function LandingCtaSection({ isAuthenticated = false }: LandingCtaSectionProps) {
    const { t } = useTranslation();

    return (
        <section className='px-4 py-12 sm:py-16'>
            <div className='mx-auto max-w-7xl rounded-3xl border bg-gradient-to-br from-primary/15 via-background to-background p-6 sm:p-10'>
                <div className='grid gap-8 md:grid-cols-[1fr_auto] md:items-center'>
                    <div className='space-y-3'>
                        <h3 className='text-2xl font-bold tracking-tight'>{t('landing.cta.title')}</h3>
                        <p className='max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
                            {t('landing.cta.description')}
                        </p>
                    </div>

                    <div className='flex flex-col gap-3 sm:flex-row'>
                        {!isAuthenticated ? (
                            <Button size='lg' asChild>
                                <Link to={`/${ROUTES.AUTH.SIGNUP}`}>{t('landing.cta.signUp')}</Link>
                            </Button>
                        ) : null}
                        <Button size='lg' variant='outline' asChild>
                            <Link to={`/${ROUTES.FOODS.LIST}`}>{t('landing.cta.browseFoods')}</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default memo(LandingCtaSection);
