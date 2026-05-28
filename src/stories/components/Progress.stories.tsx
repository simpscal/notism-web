import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from '@/components/progress';

const meta = {
    title: 'Components/Progress',
    component: Progress,
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
            description: 'Progress value (0–100)',
        },
    },
    args: {
        value: 50,
        className: 'w-[320px]',
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
    args: { value: 0 },
};

export const Quarter: Story = {
    args: { value: 25 },
};

export const Half: Story = {
    args: { value: 50 },
};

export const ThreeQuarters: Story = {
    args: { value: 75 },
};

export const Complete: Story = {
    args: { value: 100 },
};

export const AllValues: Story = {
    render: () => (
        <div className='flex flex-col gap-4 w-[320px]'>
            {[0, 25, 50, 75, 100].map(value => (
                <div key={value} className='flex flex-col gap-1'>
                    <div className='flex justify-between text-xs text-muted-foreground'>
                        <span>Progress</span>
                        <span>{value}%</span>
                    </div>
                    <Progress value={value} />
                </div>
            ))}
        </div>
    ),
};
