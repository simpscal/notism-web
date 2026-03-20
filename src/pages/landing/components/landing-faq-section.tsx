import { memo } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/accordion';

function LandingFaqSection() {
    return (
        <section className='px-4 py-12 sm:py-16'>
            <div className='mx-auto max-w-3xl space-y-6'>
                <div className='space-y-3 text-center'>
                    <h3 className='text-2xl font-bold tracking-tight'>Frequently asked questions</h3>
                    <p className='mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
                        Quick answers about ordering, delivery, and checkout.
                    </p>
                </div>

                <Accordion type='single' collapsible defaultValue='item-1' className='w-full'>
                    <AccordionItem value='item-1'>
                        <AccordionTrigger>How do I start an order?</AccordionTrigger>
                        <AccordionContent>
                            Go to Foods, pick what you want, review your summary, and proceed to checkout.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-2'>
                        <AccordionTrigger>Is payment processing secure?</AccordionTrigger>
                        <AccordionContent>
                            Yes. Your checkout uses protected payment processing and clear confirmation steps.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value='item-3'>
                        <AccordionTrigger>Can I track my delivery?</AccordionTrigger>
                        <AccordionContent>
                            You can view delivery progress in real time after checkout, so you always know what to
                            expect.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    );
}

export default memo(LandingFaqSection);
