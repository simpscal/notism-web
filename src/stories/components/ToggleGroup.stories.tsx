import type { Meta, StoryObj } from '@storybook/react-vite';

import { ToggleGroup, ToggleGroupItem } from '@/components/toggle-group';

const meta = {
    title: 'Components/ToggleGroup',
    component: ToggleGroup,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['single', 'multiple'],
            description: 'Selection mode',
        },
        variant: {
            control: 'select',
            options: ['default', 'outline'],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg'],
        },
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
    render: () => (
        <ToggleGroup type='single' defaultValue='medium'>
            <ToggleGroupItem value='small'>S</ToggleGroupItem>
            <ToggleGroupItem value='medium'>M</ToggleGroupItem>
            <ToggleGroupItem value='large'>L</ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const MultipleSelect: Story = {
    render: () => (
        <ToggleGroup type='multiple' defaultValue={['bold', 'italic']}>
            <ToggleGroupItem value='bold' aria-label='Bold'>
                <strong>B</strong>
            </ToggleGroupItem>
            <ToggleGroupItem value='italic' aria-label='Italic'>
                <em>I</em>
            </ToggleGroupItem>
            <ToggleGroupItem value='underline' aria-label='Underline'>
                <u>U</u>
            </ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const OutlineVariant: Story = {
    render: () => (
        <ToggleGroup type='single' variant='outline' defaultValue='grid'>
            <ToggleGroupItem value='list' aria-label='List view'>
                ☰
            </ToggleGroupItem>
            <ToggleGroupItem value='grid' aria-label='Grid view'>
                ▦
            </ToggleGroupItem>
            <ToggleGroupItem value='map' aria-label='Map view'>
                ◈
            </ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const SmallSize: Story = {
    render: () => (
        <ToggleGroup type='single' size='sm' defaultValue='today'>
            <ToggleGroupItem value='today'>Today</ToggleGroupItem>
            <ToggleGroupItem value='week'>Week</ToggleGroupItem>
            <ToggleGroupItem value='month'>Month</ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const LargeSize: Story = {
    render: () => (
        <ToggleGroup type='single' size='lg' defaultValue='all'>
            <ToggleGroupItem value='all'>All</ToggleGroupItem>
            <ToggleGroupItem value='pending'>Pending</ToggleGroupItem>
            <ToggleGroupItem value='done'>Done</ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const WithDisabledItem: Story = {
    render: () => (
        <ToggleGroup type='single' defaultValue='dine-in'>
            <ToggleGroupItem value='dine-in'>Dine-in</ToggleGroupItem>
            <ToggleGroupItem value='takeout'>Takeout</ToggleGroupItem>
            <ToggleGroupItem value='delivery' disabled>
                Delivery
            </ToggleGroupItem>
        </ToggleGroup>
    ),
};

export const NoSelection: Story = {
    render: () => (
        <ToggleGroup type='single'>
            <ToggleGroupItem value='low'>Low</ToggleGroupItem>
            <ToggleGroupItem value='medium'>Medium</ToggleGroupItem>
            <ToggleGroupItem value='high'>High</ToggleGroupItem>
        </ToggleGroup>
    ),
};
