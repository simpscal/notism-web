import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from './button';

import { loadLocale, preloadLocale } from '@/app/i18n/locale-loader';

type IdleCallbackWindow = Window & {
    requestIdleCallback?: (callback: () => void) => number;
    cancelIdleCallback?: (handle: number) => void;
};

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language;
    const otherLanguage = currentLanguage === 'en' ? 'vi' : 'en';

    useEffect(() => {
        const idleWindow = window as IdleCallbackWindow;
        const preload = () => preloadLocale(otherLanguage);

        if (typeof idleWindow.requestIdleCallback === 'function') {
            const idleHandle = idleWindow.requestIdleCallback(preload);
            return () => idleWindow.cancelIdleCallback?.(idleHandle);
        }

        const timeoutHandle = setTimeout(preload, 1);
        return () => clearTimeout(timeoutHandle);
    }, [otherLanguage]);

    const handleLanguageToggle = useCallback(async () => {
        const bundle = await loadLocale(otherLanguage);

        if (!i18n.hasResourceBundle(otherLanguage, 'translation')) {
            i18n.addResourceBundle(otherLanguage, 'translation', bundle);
        }

        i18n.changeLanguage(otherLanguage);
    }, [otherLanguage, i18n]);

    return (
        <Button
            variant='ghost'
            size='sm'
            onClick={handleLanguageToggle}
            className='text-xs font-medium'
            title={`Current language: ${currentLanguage.toUpperCase()}`}
        >
            {currentLanguage === 'en' ? '🇻🇳 VI' : '🇬🇧 EN'}
        </Button>
    );
}
