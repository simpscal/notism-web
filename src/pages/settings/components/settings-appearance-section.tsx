import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { cn } from '@/app/utils/tailwind.utils';
import { Button } from '@/components/button';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { useTheme } from '@/core/contexts/theme.context';

type ThemeValue = 'light' | 'dark' | 'system';

/** Light-surface preview mockup (used directly and as the left half of System). */
function LightPreview() {
    return (
        <div className='flex h-full w-full flex-col bg-[#ffffff]'>
            <div className='flex h-3 items-center gap-1 border-b border-[#e5e7eb] bg-[#f3f4f6] px-1.5'>
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
                <span className='h-1 w-1 rounded-full bg-[#d1d5db]' />
            </div>
            <div className='flex flex-1'>
                <div className='flex w-1/3 flex-col gap-1 bg-[#f3f4f6] p-1.5'>
                    <span className='h-1 w-full rounded-full bg-[#cbd5e1]' />
                    <span className='h-1 w-2/3 rounded-full bg-[#cbd5e1]' />
                    <span className='h-1 w-3/4 rounded-full bg-[#cbd5e1]' />
                </div>
                <div className='flex flex-1 flex-col gap-1 p-1.5'>
                    <span className='h-1 w-3/4 rounded-full bg-[#94a3b8]' />
                    <span className='h-1 w-full rounded-full bg-[#cbd5e1]' />
                    <span className='h-1 w-1/2 rounded-full bg-[#cbd5e1]' />
                </div>
            </div>
        </div>
    );
}

/** Dark-surface preview mockup (used directly and as the right half of System). */
function DarkPreview() {
    return (
        <div className='flex h-full w-full flex-col bg-[#0d1117]'>
            <div className='flex h-3 items-center gap-1 border-b border-[#30363d] bg-[#161b22] px-1.5'>
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
                <span className='h-1 w-1 rounded-full bg-[#484f58]' />
            </div>
            <div className='flex flex-1'>
                <div className='flex w-1/3 flex-col gap-1 bg-[#161b22] p-1.5'>
                    <span className='h-1 w-full rounded-full bg-[#30363d]' />
                    <span className='h-1 w-2/3 rounded-full bg-[#30363d]' />
                    <span className='h-1 w-3/4 rounded-full bg-[#30363d]' />
                </div>
                <div className='flex flex-1 flex-col gap-1 p-1.5'>
                    <span className='h-1 w-3/4 rounded-full bg-[#8b949e]' />
                    <span className='h-1 w-full rounded-full bg-[#30363d]' />
                    <span className='h-1 w-1/2 rounded-full bg-[#30363d]' />
                </div>
            </div>
        </div>
    );
}

/** System preview — diagonal split showing both light and dark halves. */
function SystemPreview() {
    return (
        <div className='relative h-full w-full overflow-hidden'>
            <div className='absolute inset-0'>
                <DarkPreview />
            </div>
            <div className='absolute inset-0' style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}>
                <LightPreview />
            </div>
            <div
                className='pointer-events-none absolute inset-0'
                aria-hidden
                style={{
                    background:
                        'linear-gradient(to top right, transparent calc(50% - 0.5px), rgba(120,120,120,0.6) 50%, transparent calc(50% + 0.5px))',
                }}
            />
        </div>
    );
}

function SettingsAppearanceSection() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    // Selection is staged locally; it is only applied and persisted on Save changes.
    const [selectedTheme, setSelectedTheme] = useState<ThemeValue>(theme);

    // Keep the staged selection in sync when the applied theme changes (e.g. after saving).
    useEffect(() => {
        setSelectedTheme(theme);
    }, [theme]);

    const hasUnsavedChanges = selectedTheme !== theme;

    const handleSave = () => {
        setTheme(selectedTheme);
        toast.success(t('settings.appearance.saveSuccess'));
    };

    const themeOptions: {
        value: ThemeValue;
        label: string;
        description: string;
        Preview: React.ComponentType;
    }[] = [
        {
            value: 'light',
            label: t('settings.appearance.light'),
            description: t('settings.appearance.lightDescription'),
            Preview: LightPreview,
        },
        {
            value: 'dark',
            label: t('settings.appearance.dark'),
            description: t('settings.appearance.darkDescription'),
            Preview: DarkPreview,
        },
        {
            value: 'system',
            label: t('settings.appearance.system'),
            description: t('settings.appearance.systemDescription'),
            Preview: SystemPreview,
        },
    ];

    return (
        <div className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                <div className='space-y-1'>
                    <h2 className='text-lg font-semibold tracking-tight'>{t('settings.appearance.title')}</h2>
                    <p className='text-sm text-muted-foreground'>{t('settings.appearance.subtitle')}</p>
                </div>

                <fieldset className='space-y-3'>
                    <legend className='text-sm font-medium'>{t('settings.appearance.sectionTitle')}</legend>
                    <p className='text-xs text-muted-foreground'>
                        {t('settings.appearance.currentlyApplied')}{' '}
                        <span className='font-medium capitalize text-foreground'>
                            {t(`settings.appearance.${theme}`)}
                        </span>
                    </p>
                    <RadioGroup
                        value={selectedTheme}
                        onValueChange={value => setSelectedTheme(value as ThemeValue)}
                        className='grid grid-cols-1 gap-3 sm:grid-cols-3'
                    >
                        {themeOptions.map(option => {
                            const Preview = option.Preview;
                            const isSelected = selectedTheme === option.value;

                            return (
                                <Label
                                    key={option.value}
                                    htmlFor={`theme-${option.value}`}
                                    className={cn(
                                        'flex cursor-pointer flex-col gap-3 rounded-lg border p-3 transition-colors',
                                        isSelected
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'border-border hover:bg-accent'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'aspect-[4/3] w-full overflow-hidden rounded-md border',
                                            isSelected ? 'border-primary/40' : 'border-border'
                                        )}
                                        aria-hidden
                                    >
                                        <Preview />
                                    </div>
                                    <div className='flex items-center justify-between gap-2'>
                                        <div className='min-w-0'>
                                            <span className='block text-sm font-medium text-foreground'>
                                                {option.label}
                                            </span>
                                            <p className='mt-0.5 truncate text-xs font-normal text-muted-foreground'>
                                                {option.description}
                                            </p>
                                        </div>
                                        <RadioGroupItem
                                            value={option.value}
                                            id={`theme-${option.value}`}
                                            className='shrink-0'
                                        />
                                    </div>
                                </Label>
                            );
                        })}
                    </RadioGroup>
                </fieldset>
            </div>

            <div className='flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4'>
                <Button type='button' disabled={!hasUnsavedChanges} onClick={handleSave}>
                    {t('settings.appearance.saveChanges')}
                </Button>
            </div>
        </div>
    );
}

export default memo(SettingsAppearanceSection);
