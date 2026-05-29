import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader2, Mail } from 'lucide-react';

import { Button } from '@/components/button';

const meta = {
    title: 'Components/Inputs/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
        },
        size: {
            control: 'select',
            options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
        },
        disabled: { control: 'boolean' },
        children: { control: 'text' },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'Button',
        variant: 'default',
        size: 'default',
    },
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant='default'>Default</Button>
            <Button variant='destructive'>Destructive</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='link'>Link</Button>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button size='xs'>Extra Small</Button>
            <Button size='sm'>Small</Button>
            <Button size='default'>Default</Button>
            <Button size='lg'>Large</Button>
        </div>
    ),
};

export const WithIcon: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '8px' }}>
            <Button>
                <Mail />
                Login with Email
            </Button>
        </div>
    ),
};

export const Loading: Story = {
    render: () => (
        <Button disabled>
            <Loader2 className='animate-spin' />
            Please wait
        </Button>
    ),
};

export const Disabled: Story = {
    args: {
        children: 'Disabled',
        disabled: true,
    },
};
