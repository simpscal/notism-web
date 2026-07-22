import type { Meta, StoryObj } from '@storybook/react-vite';

import Spinner from '@/uis/spinner';

const meta = {
    title: 'Components/Display/Spinner',
    component: Spinner,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
    },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        size: 'md',
    },
};

export const Sizes: Story = {
    args: {
        size: 'md',
    },
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Spinner size='xs' />
            <Spinner size='sm' />
            <Spinner size='md' />
            <Spinner size='lg' />
            <Spinner size='xl' />
        </div>
    ),
};
