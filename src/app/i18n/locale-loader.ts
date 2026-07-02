export type SupportedLocale = 'en' | 'vi';

export type TranslationResource = Record<string, unknown>;

const loaders: Record<SupportedLocale, () => Promise<{ default: TranslationResource }>> = {
    en: () => import('./locales/en.json'),
    vi: () => import('./locales/vi.json'),
};

const promises: Partial<Record<SupportedLocale, Promise<TranslationResource>>> = {};

export function normalizeLocale(locale: string | undefined | null): SupportedLocale {
    return locale?.slice(0, 2).toLowerCase() === 'vi' ? 'vi' : 'en';
}

function load(locale: SupportedLocale): Promise<TranslationResource> {
    let promise = promises[locale];
    if (!promise) {
        promise = loaders[locale]().then(module => module.default);
        promises[locale] = promise;
    }
    return promise;
}

export function loadLocale(locale: string): Promise<TranslationResource> {
    return load(normalizeLocale(locale));
}

export function preloadLocale(locale: string): Promise<TranslationResource> {
    return load(normalizeLocale(locale));
}
