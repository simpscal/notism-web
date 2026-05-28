import type { Meta, StoryObj } from '@storybook/react-vite';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/accordion';

const meta = {
    title: 'Components/Accordion',
    component: Accordion,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Accordion type='single' collapsible className='w-[480px]'>
            <AccordionItem value='item-1'>
                <AccordionTrigger>What is Notism?</AccordionTrigger>
                <AccordionContent>
                    Notism is a collaborative platform that helps teams manage projects, track progress, and stay
                    aligned through intuitive workflows.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
                <AccordionTrigger>How does billing work?</AccordionTrigger>
                <AccordionContent>
                    We offer flexible monthly or annual billing. Annual plans save you 20% compared to monthly. You can
                    cancel or change your plan at any time.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
                <AccordionTrigger>Can I invite my team?</AccordionTrigger>
                <AccordionContent>
                    Yes — invite unlimited team members on any paid plan. Each member gets their own workspace and
                    permissions can be configured per project.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4'>
                <AccordionTrigger>Is there a free trial?</AccordionTrigger>
                <AccordionContent>
                    All plans come with a 14-day free trial. No credit card required. You'll have full access to all
                    features during the trial period.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const MultipleOpen: Story = {
    render: () => (
        <Accordion type='multiple' className='w-[480px]'>
            <AccordionItem value='item-1'>
                <AccordionTrigger>Section One</AccordionTrigger>
                <AccordionContent>
                    Multiple sections can be open simultaneously when <code>type="multiple"</code> is set.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
                <AccordionTrigger>Section Two</AccordionTrigger>
                <AccordionContent>
                    This section can be open at the same time as Section One. Click both to see them expand together.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
                <AccordionTrigger>Section Three</AccordionTrigger>
                <AccordionContent>
                    Content for the third section lives here. All three can be expanded at once.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};

export const DefaultOpen: Story = {
    render: () => (
        <Accordion type='single' defaultValue='item-1' collapsible className='w-[480px]'>
            <AccordionItem value='item-1'>
                <AccordionTrigger>Pre-expanded Item</AccordionTrigger>
                <AccordionContent>
                    This item is open by default using the <code>defaultValue</code> prop.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
                <AccordionTrigger>Another Item</AccordionTrigger>
                <AccordionContent>Click to expand this one and the first will collapse.</AccordionContent>
            </AccordionItem>
        </Accordion>
    ),
};
