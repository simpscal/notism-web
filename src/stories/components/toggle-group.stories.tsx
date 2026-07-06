import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

const meta = {
    title: 'Components/Inputs/ToggleGroup',
    component: ToggleGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { type: 'multiple' },
    render: () => (
        <ToggleGroup type='multiple'>
            <ToggleGroupItem value='bold' aria-label='Toggle bold'>
                <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value='italic' aria-label='Toggle italic'>
                <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value='underline' aria-label='Toggle underline'>
                <Underline />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const SingleSelect: Story = {
    args: { type: 'single' },
    render: () => (
        <ToggleGroup type='single' defaultValue='center'>
            <ToggleGroupItem value='left' aria-label='Align left'>
                <AlignLeft />
            </ToggleGroupItem>
            <ToggleGroupItem value='center' aria-label='Align center'>
                <AlignCenter />
            </ToggleGroupItem>
            <ToggleGroupItem value='right' aria-label='Align right'>
                <AlignRight />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const Segmented: Story = {
    args: { type: 'single' },
    render: () => (
        <ToggleGroup type='single' variant='segmented' defaultValue='month'>
            <ToggleGroupItem value='day' aria-label='Day'>
                Day
            </ToggleGroupItem>
            <ToggleGroupItem value='week' aria-label='Week'>
                Week
            </ToggleGroupItem>
            <ToggleGroupItem value='month' aria-label='Month'>
                Month
            </ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const Outline: Story = {
    args: { type: 'multiple' },
    render: () => (
        <ToggleGroup type='multiple' variant='outline'>
            <ToggleGroupItem value='bold' aria-label='Toggle bold'>
                <Bold />
            </ToggleGroupItem>
            <ToggleGroupItem value='italic' aria-label='Toggle italic'>
                <Italic />
            </ToggleGroupItem>
            <ToggleGroupItem value='underline' aria-label='Toggle underline'>
                <Underline />
            </ToggleGroupItem>
        </ToggleGroup>
    ),
};
