import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { loadLocale, normalizeLocale, preloadLocale } from './locale-loader';

type IdleCallbackWindow = Window & {
    requestIdleCallback?: (callback: () => void) => number;
    cancelIdleCallback?: (handle: number) => void;
};

export function useLanguageToggle() {
    const { i18n } = useTranslation();

    const currentLanguage = normalizeLocale(i18n.language);
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

    const toggleLanguage = useCallback(async () => {
        const bundle = await loadLocale(otherLanguage);

        if (!i18n.hasResourceBundle(otherLanguage, 'translation')) {
            i18n.addResourceBundle(otherLanguage, 'translation', bundle);
        }

        i18n.changeLanguage(otherLanguage);
    }, [otherLanguage, i18n]);

    return { currentLanguage, otherLanguage, toggleLanguage };
}
