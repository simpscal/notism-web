import type { Meta, StoryObj } from '@storybook/react-vite';

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
    render: args => (
        <Accordion {...args} style={{ width: '400px' }}>
            <AccordionItem value='item-1'>
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                    Yes. It comes with default styles that match the other components style.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
                <AccordionTrigger>Is it animated?</AccordionTrigger>
                <AccordionContent>
                    Yes. It is animated by default, but you can disable it if you prefer.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const Multiple: Story = {
    args: {
        type: 'multiple',
    },
    render: args => (
        <Accordion {...args} style={{ width: '400px' }}>
            <AccordionItem value='item-1'>
                <AccordionTrigger>Section One</AccordionTrigger>
                <AccordionContent>Content for section one.</AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
                <AccordionTrigger>Section Two</AccordionTrigger>
                <AccordionContent>Content for section two.</AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
                <AccordionTrigger>Section Three</AccordionTrigger>
                <AccordionContent>Content for section three.</AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};
