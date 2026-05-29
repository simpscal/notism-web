import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/accordion';

const meta = {
    title: 'Components/Display/Accordion',
    component: Accordion,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        type: 'single',
        collapsible: true,
    },
    render: function Render(args) {
        const { t } = useTranslation();
        return (
            <Accordion {...args} style={{ width: '400px' }}>
                <AccordionItem value='item-1'>
                    <AccordionTrigger>{t('storybook.accordion.q1')}</AccordionTrigger>
                    <AccordionContent>{t('storybook.accordion.a1')}</AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-2'>
                    <AccordionTrigger>{t('storybook.accordion.q2')}</AccordionTrigger>
                    <AccordionContent>{t('storybook.accordion.a2')}</AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-3'>
                    <AccordionTrigger>{t('storybook.accordion.q3')}</AccordionTrigger>
                    <AccordionContent>{t('storybook.accordion.a3')}</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    },
};

export const Multiple: Story = {
    args: {
        type: 'multiple',
    },
    render: function Render(args) {
        const { t } = useTranslation();
        return (
            <Accordion {...args} style={{ width: '400px' }}>
                <AccordionItem value='item-1'>
                    <AccordionTrigger>{t('storybook.accordion.sectionOne')}</AccordionTrigger>
                    <AccordionContent>{t('storybook.accordion.contentOne')}</AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-2'>
                    <AccordionTrigger>{t('storybook.accordion.sectionTwo')}</AccordionTrigger>
                    <AccordionContent>{t('storybook.accordion.contentTwo')}</AccordionContent>
                </AccordionItem>
                <AccordionItem value='item-3'>
                    <AccordionTrigger>{t('storybook.accordion.sectionThree')}</AccordionTrigger>
                    <AccordionContent>{t('storybook.accordion.contentThree')}</AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    },
};
