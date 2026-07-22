import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/uis/accordion';

function LandingFaqSection() {
    const { t } = useTranslation();

    return (
        <section id='faq' className='px-4 py-12 sm:py-16'>
            <div className='mx-auto max-w-3xl space-y-6'>
                <div className='space-y-3 text-center'>
                    <h3 className='text-2xl font-bold tracking-tight'>{t('landing.faq.title')}</h3>
                    <p className='mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
                        {t('landing.faq.subtitle')}
                    </p>
                </div>

                <Accordion type='single' collapsible defaultValue='item-1' className='w-full'>
                    <AccordionItem value='item-1'>
                        <AccordionTrigger>{t('landing.faq.items.0.question')}</AccordionTrigger>
                        <AccordionContent>{t('landing.faq.items.0.answer')}</AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-2'>
                        <AccordionTrigger>{t('landing.faq.items.1.question')}</AccordionTrigger>
                        <AccordionContent>{t('landing.faq.items.1.answer')}</AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-3'>
                        <AccordionTrigger>{t('landing.faq.items.2.question')}</AccordionTrigger>
                        <AccordionContent>{t('landing.faq.items.2.answer')}</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}

export default memo(LandingFaqSection);
