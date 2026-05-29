'use client';

import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { cn } from '@/app/utils/tailwind.utils';
import { Button } from '@/components/button';
import { Calendar } from '@/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/select';

export function DatePickerWithPresets() {
    const { t } = useTranslation();
    const [date, setDate] = React.useState<Date>();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'outline'}
                    className={cn('w-[240px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP') : <span>{t('common.pickDate')}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='flex w-auto flex-col space-y-2 p-2'>
                <Select onValueChange={value => setDate(addDays(new Date(), parseInt(value)))}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('common.select')} />
                    </SelectTrigger>
                    <SelectContent position='popper'>
                        <SelectItem value='0'>{t('common.today')}</SelectItem>
                        <SelectItem value='1'>{t('common.tomorrow')}</SelectItem>
                        <SelectItem value='3'>{t('common.inThreeDays')}</SelectItem>
                        <SelectItem value='7'>{t('common.inAWeek')}</SelectItem>
                    </SelectContent>
                </Select>
                <div className='rounded-md border'>
                    <Calendar mode='single' selected={date} onSelect={setDate} />
                </div>
            </PopoverContent>
        </Popover>
    );
}
