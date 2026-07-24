import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { loadLocale, normalizeLocale, SupportedLocale } from './locale-loader';

const DETECTION_OPTIONS = {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
};

// Runs the same lookup order as `detection.order` below, standalone, so only the active
// locale's JSON is fetched — `lookupLocalStorage` must match i18next-browser-languagedetector's
// own default key ('i18nextLng') since that's the key `caches: ['localStorage']` writes to.
function detectLocale(): SupportedLocale {
    const detector = new LanguageDetector(undefined, {
        order: DETECTION_OPTIONS.order,
        lookupLocalStorage: 'i18nextLng',
    });
    const detected = detector.detect();
    const first = Array.isArray(detected) ? detected[0] : detected;
    return normalizeLocale(first);
}

async function initI18n() {
    const locale = detectLocale();
    const bundle = await loadLocale(locale);

    await i18n
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
            fallbackLng: 'en',
            lng: locale,
            interpolation: {
                escapeValue: false,
            },
            resources: {
                [locale]: { translation: bundle },
            },
            detection: DETECTION_OPTIONS,
        });

    return i18n;
}

export const i18nReady = initI18n();

export default i18n;
