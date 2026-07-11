import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomisationGroupModel } from '@/apis';
import { formatVnd } from '@/app/utils';
import { Badge } from '@/components/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

interface FoodCustomisationSectionProps {
    customisations: CustomisationGroupModel[];
    selections: Record<string, string>;
    onChange: (id: string, value: string) => void;
}

function FoodCustomisationSection({ customisations, selections, onChange }: FoodCustomisationSectionProps) {
    const { t } = useTranslation();

    const handleValueChange = useCallback(
        (id: string) => (value: string) => {
            // Guard the empty value so re-clicking a chosen pill can't clear a
            // required single-select group.
            if (value) {
                onChange(id, value);
            }
        },
        [onChange]
    );

    return (
        <div className='space-y-7'>
            {customisations.map(cust => (
                <div key={cust.id} className='space-y-3'>
                    {/* Group header — UPPERCASE eyebrow + optional Required tag */}
                    <div className='flex items-center gap-2'>
                        <span className='text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground'>
                            {cust.label}
                        </span>
                        {cust.required && (
                            <Badge variant='secondary' className='rounded-full px-2 py-0 text-[10px] font-medium'>
                                {t('foodDetail.required')}
                            </Badge>
                        )}
                    </div>

                    {/* Single-select black-pill row: muted track, chosen pill fills solid black */}
                    <ToggleGroup
                        type='single'
                        variant='segmented'
                        value={selections[cust.id] ?? ''}
                        onValueChange={handleValueChange(cust.id)}
                        aria-label={cust.label}
                        className='flex-wrap'
                    >
                        {cust.options.map(opt => (
                            <ToggleGroupItem key={opt.value} value={opt.value} className='h-11 gap-1.5 px-5'>
                                <span className='font-medium'>{opt.label}</span>
                                {opt.surcharge ? (
                                    <span className='text-xs opacity-70'>+{formatVnd(opt.surcharge)}</span>
                                ) : null}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>
            ))}
        </div>
    );
}

export default memo(FoodCustomisationSection);
