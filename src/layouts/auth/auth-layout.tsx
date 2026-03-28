import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

import { LanguageSwitcher } from '@/components/language-switcher';

function AuthLayout() {
    const { t } = useTranslation();
    return (
        <div className='min-h-screen w-screen overflow-y-auto bg-background'>
            <div className='absolute right-4 top-4 md:right-6 md:top-6'>
                <LanguageSwitcher />
            </div>
            <div className='mx-auto flex min-h-screen max-w-7xl flex-col items-stretch lg:flex-row'>
                <section className='relative hidden w-full flex-1 items-center justify-center overflow-hidden lg:block lg:w-1/2'>
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent' />
                    <div className='relative px-10'>
                        <div className='inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm'>
                            {t('landing.hero.subtitle')}
                        </div>

                        <h1 className='mt-6 text-4xl font-semibold tracking-tight text-primary'>Notism</h1>
                        <p className='mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground'>
                            {t('auth.enterCredentials')}
                        </p>

                        <ul className='mt-8 grid gap-3 text-sm text-muted-foreground'>
                            <li className='flex items-start gap-3'>
                                <span className='mt-2 h-2 w-2 rounded-full bg-primary' />
                                <span>{t('landing.features.items.0.description')}</span>
                            </li>
                            <li className='flex items-start gap-3'>
                                <span className='mt-2 h-2 w-2 rounded-full bg-primary' />
                                <span>{t('landing.features.items.1.description')}</span>
                            </li>
                            <li className='flex items-start gap-3'>
                                <span className='mt-2 h-2 w-2 rounded-full bg-primary' />
                                <span>{t('landing.features.items.2.description')}</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className='flex flex-1 items-center justify-center p-4 sm:p-6 lg:w-1/2'>
                    <div className='w-full max-w-md rounded-lg border bg-card p-4 shadow-sm sm:p-6 md:p-8'>
                        <Outlet />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default memo(AuthLayout);
