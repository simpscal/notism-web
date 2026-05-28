import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
            description: 'Visual style of the button',
        },
        size: {
            control: 'select',
            options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
            description: 'Size of the button',
        },
        disabled: {
            control: 'boolean',
        },
        children: {
            control: 'text',
        },
    },
    args: {
        children: 'Button',
        variant: 'default',
        size: 'default',
        disabled: false,
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Delete item',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Cancel',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Ghost',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        children: 'Learn more →',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Small',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Large',
    },
};

export const ExtraSmall: Story = {
    args: {
        size: 'xs',
        children: 'Extra small',
    },
};

export const Icon: Story = {
    args: {
        size: 'icon',
        children: (
            <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <path d='M12 5v14M5 12l7 7 7-7' />
            </svg>
        ),
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        children: 'Disabled',
    },
};

export const WithLeadingIcon: Story = {
    args: {
        children: (
            <>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                >
                    <path d='M12 5v14M5 12l7 7 7-7' />
                </svg>
                Download
            </>
        ),
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className='flex flex-col gap-6'>
            {(['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const).map(variant => (
                <div key={variant} className='flex flex-wrap items-center gap-3'>
                    <span className='w-24 text-xs text-muted-foreground capitalize'>{variant}</span>
                    {(['xs', 'sm', 'default', 'lg'] as const).map(size => (
                        <Button key={size} variant={variant} size={size}>
                            {size === 'default' ? 'Button' : size}
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    ),
};

export const AllIconSizes: Story = {
    render: () => (
        <div className='flex flex-wrap items-center gap-3'>
            {(['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const).map(size => (
                <Button key={size} size={size} title={size}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    >
                        <circle cx='12' cy='12' r='10' />
                        <path d='M12 8v4l3 3' />
                    </svg>
                </Button>
            ))}
        </div>
    ),
};

export const ElevatedContext: Story = {
    name: 'On Elevated Surface',
    render: () => (
        <div className='flex flex-col gap-6'>
            <div className='shadow-surface rounded-container bg-card p-6 flex flex-col gap-3'>
                <p className='text-xs tracking-caps text-muted-foreground'>Surface tier (shadow-surface)</p>
                <div className='flex flex-wrap items-center gap-3'>
                    <Button>Primary Action</Button>
                    <Button variant='outline'>Secondary</Button>
                    <Button variant='ghost'>Tertiary</Button>
                </div>
            </div>
            <div className='shadow-elevated rounded-container bg-card p-6 flex flex-col gap-3'>
                <p className='text-xs tracking-caps text-muted-foreground'>Elevated tier (shadow-elevated)</p>
                <div className='flex flex-wrap items-center gap-3'>
                    <Button>Primary Action</Button>
                    <Button variant='outline'>Secondary</Button>
                    <Button variant='ghost'>Tertiary</Button>
                </div>
            </div>
        </div>
    ),
};
