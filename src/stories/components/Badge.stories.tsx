import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@/components/badge';

const meta = {
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline', 'success'],
            description: 'Visual style of the badge',
        },
        children: {
            control: 'text',
        },
    },
    args: {
        children: 'Badge',
        variant: 'default',
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Destructive',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
        children: 'Success',
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='default'>Default</Badge>
            <Badge variant='secondary'>Secondary</Badge>
            <Badge variant='destructive'>Destructive</Badge>
            <Badge variant='outline'>Outline</Badge>
            <Badge variant='success'>Success</Badge>
        </div>
    ),
};

export const InContext: Story = {
    render: () => (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <span className='font-mono text-sm font-medium'>Order #1042</span>
                <Badge variant='success'>Delivered</Badge>
            </div>
            <div className='flex items-center gap-2'>
                <span className='font-mono text-sm font-medium'>Order #1041</span>
                <Badge variant='secondary'>Processing</Badge>
            </div>
            <div className='flex items-center gap-2'>
                <span className='font-mono text-sm font-medium'>Order #1040</span>
                <Badge variant='destructive'>Cancelled</Badge>
            </div>
            <div className='flex items-center gap-2'>
                <span className='font-mono text-sm font-medium'>Order #1039</span>
                <Badge variant='outline'>Pending</Badge>
            </div>
        </div>
    ),
};

export const SemanticMarkers: Story = {
    name: 'Semantic Markers (Pill)',
    render: () => (
        <div className='flex flex-col gap-6'>
            <div>
                <p className='text-xs tracking-caps text-muted-foreground mb-3'>Category tags</p>
                <div className='flex flex-wrap items-center gap-2'>
                    {['Pizza', 'Burgers', 'Salads', 'Desserts', 'Drinks'].map(tag => (
                        <Badge key={tag} variant='secondary' className='rounded-pill'>
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>
            <div>
                <p className='text-xs tracking-caps text-muted-foreground mb-3'>Status indicators</p>
                <div className='flex flex-wrap items-center gap-2'>
                    <Badge variant='success' className='rounded-pill'>
                        Open
                    </Badge>
                    <Badge variant='default' className='rounded-pill'>
                        In progress
                    </Badge>
                    <Badge variant='secondary' className='rounded-pill'>
                        On hold
                    </Badge>
                    <Badge variant='destructive' className='rounded-pill'>
                        Closed
                    </Badge>
                </div>
            </div>
            <div>
                <p className='text-xs tracking-caps text-muted-foreground mb-3'>Notification counts</p>
                <div className='flex flex-wrap items-center gap-3'>
                    <Badge variant='default' className='rounded-pill px-2 min-w-[1.5rem] justify-center'>
                        3
                    </Badge>
                    <Badge variant='destructive' className='rounded-pill px-2 min-w-[1.5rem] justify-center'>
                        12
                    </Badge>
                    <Badge variant='secondary' className='rounded-pill px-2 min-w-[1.5rem] justify-center'>
                        99+
                    </Badge>
                </div>
            </div>
        </div>
    ),
};
