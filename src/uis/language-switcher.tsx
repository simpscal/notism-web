import { Button } from './button';

type LanguageSwitcherProps = {
    currentLanguage: string;
    onToggleLanguage: () => void;
};

export function LanguageSwitcher({ currentLanguage, onToggleLanguage }: LanguageSwitcherProps) {
    return (
        <Button
            variant='ghost'
            size='sm'
            onClick={onToggleLanguage}
            className='text-xs font-medium'
            title={`Current language: ${currentLanguage.toUpperCase()}`}
        >
            {currentLanguage === 'en' ? '🇻🇳 VI' : '🇬🇧 EN'}
        </Button>
    );
}
