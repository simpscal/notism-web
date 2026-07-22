import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import type { CustomisationGroupModel } from '@/apis';
import { formatVnd } from '@/app/utils';
import { Badge } from '@/uis/badge';
import { Label } from '@/uis/label';
import { RadioGroup, RadioGroupItem } from '@/uis/radio-group';
import { Separator } from '@/uis/separator';

interface FoodCustomisationSectionProps {
    customisations: CustomisationGroupModel[];
    selections: Record<string, string>;
    onChange: (id: string, value: string) => void;
}

function FoodCustomisationSection({ customisations, selections, onChange }: FoodCustomisationSectionProps) {
    const { t } = useTranslation();

    const handleValueChange = useCallback(
        (id: string) => (value: string) => {
            onChange(id, value);
        },
        [onChange]
    );

    return (
        <div className='space-y-6'>
            <div className='flex items-center gap-2'>
                <Separator className='flex-1' />
                <span className='text-xs font-semibold uppercase tracking-widest text-muted-foreground'>
                    {t('foodDetail.customiseYourOrder')}
                </span>
                <Separator className='flex-1' />
            </div>

            {customisations.map(cust => (
                <div key={cust.id} className='space-y-2'>
                    <div className='flex items-center gap-2'>
                        <Label className='text-sm font-semibold'>{cust.label}</Label>
                        {cust.required && (
                            <Badge variant='secondary' className='text-xs'>
                                {t('foodDetail.required')}
                            </Badge>
                        )}
                    </div>
                    <RadioGroup
                        value={selections[cust.id] ?? ''}
                        onValueChange={handleValueChange(cust.id)}
                        className='grid gap-2'
                    >
                        {cust.options.map(opt => (
                            <Label
                                key={opt.value}
                                className='flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors hover:bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 font-normal'
                            >
                                <RadioGroupItem value={opt.value} />
                                <span className='flex flex-1 items-center justify-between text-sm'>
                                    <span>{opt.label}</span>
                                    {opt.surcharge ? (
                                        <span className='text-xs font-semibold text-primary'>
                                            +{formatVnd(opt.surcharge)}
                                        </span>
                                    ) : null}
                                </span>
                            </Label>
                        ))}
                    </RadioGroup>
                </div>
            ))}
        </div>
    );
}

export default memo(FoodCustomisationSection);
