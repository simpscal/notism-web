import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '@/components/label';
import { Slider } from '@/components/slider';

const meta = {
    title: 'Components/Slider',
    component: Slider,
    tags: ['autodocs'],
    argTypes: {
        min: { control: { type: 'number' } },
        max: { control: { type: 'number' } },
        step: { control: { type: 'number' } },
        disabled: { control: 'boolean' },
    },
    args: {
        className: 'w-[320px]',
        min: 0,
        max: 100,
        defaultValue: [40],
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSteps: Story = {
    args: {
        defaultValue: [25],
        step: 25,
    },
    render: args => (
        <div className='flex flex-col gap-2 w-[320px]'>
            <div className='flex justify-between text-xs text-muted-foreground'>
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
            </div>
            <Slider {...args} />
        </div>
    ),
};

export const Range: Story = {
    args: {
        defaultValue: [20, 70],
    },
};

export const SmallRange: Story = {
    render: () => (
        <div className='flex flex-col gap-2 w-[320px]'>
            <Label>Price range</Label>
            <Slider defaultValue={[10, 50]} min={0} max={100} step={5} />
            <div className='flex justify-between text-xs text-muted-foreground'>
                <span>$0</span>
                <span>$100</span>
            </div>
        </div>
    ),
};

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: [60],
    },
};

export const FullRange: Story = {
    args: {
        defaultValue: [0, 100],
    },
};

export const AllExamples: Story = {
    render: () => (
        <div className='flex flex-col gap-6 w-[320px]'>
            <div className='flex flex-col gap-2'>
                <Label>Single handle (default)</Label>
                <Slider defaultValue={[40]} />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Range</Label>
                <Slider defaultValue={[20, 70]} />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>With steps (step=25)</Label>
                <Slider defaultValue={[50]} step={25} />
            </div>
            <div className='flex flex-col gap-2'>
                <Label>Disabled</Label>
                <Slider defaultValue={[60]} disabled />
            </div>
        </div>
    ),
};
