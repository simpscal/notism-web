import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress } from '@/uis/progress';

const meta = {
    title: 'Components/Display/Progress',
    component: Progress,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: { type: 'range', min: 0, max: 100, step: 1 },
        },
    },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: 60,
    },
    render: args => (
        <div style={{ width: '300px' }}>
            <Progress {...args} />
        </div>
    ),
};

export const Values: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
            <Progress value={0} />
            <Progress value={25} />
            <Progress value={50} />
            <Progress value={75} />
            <Progress value={100} />
        </div>
    ),
};
