import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@/components/badge';

const meta = {
    title: 'Components/Display/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline', 'success'],
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Badge',
        variant: 'default',
    },
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge variant='default'>Default</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='destructive'>Destructive</Badge>
            <Badge variant='outline'>Outline</Badge>
            <Badge variant='success'>Success</Badge>
        </div>
    ),
};
