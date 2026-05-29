import type { Meta, StoryObj } from '@storybook/react-vite';

import { Slider } from '@/components/slider';

const meta = {
    title: 'Components/Inputs/Slider',
    component: Slider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        min: { control: { type: 'number' } },
        max: { control: { type: 'number' } },
        step: { control: { type: 'number' } },
        disabled: { control: 'boolean' },
    },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        defaultValue: [50],
        min: 0,
        max: 100,
        step: 1,
    },
    render: args => (
        <div style={{ width: '300px' }}>
            <Slider {...args} />
        </div>
    ),
};

export const Range: Story = {
    render: () => (
        <div style={{ width: '300px' }}>
            <Slider defaultValue={[25, 75]} min={0} max={100} step={1} />
        </div>
    ),
};

export const Disabled: Story = {
    render: () => (
        <div style={{ width: '300px' }}>
            <Slider defaultValue={[40]} disabled />
        </div>
    ),
};
