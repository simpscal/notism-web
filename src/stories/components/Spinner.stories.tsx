import type { Meta, StoryObj } from '@storybook/react-vite';

import Spinner from '@/components/spinner';

const meta = {
    title: 'Components/Spinner',
    component: Spinner,
    tags: ['autodocs'],
    argTypes: {
        size: {
            control: 'select',
            options: ['xs', 'sm', 'md', 'lg', 'xl'],
            description: 'Size of the spinner',
        },
    },
    args: {
        size: 'md',
    },
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ExtraSmall: Story = {
    args: { size: 'xs' },
};

export const Small: Story = {
    args: { size: 'sm' },
};

export const Medium: Story = {
    args: { size: 'md' },
};

export const Large: Story = {
    args: { size: 'lg' },
};

export const ExtraLarge: Story = {
    args: { size: 'xl' },
};

export const AllSizes: Story = {
    render: () => (
        <div className='flex items-center gap-6'>
            {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
                <div key={size} className='flex flex-col items-center gap-2'>
                    <Spinner size={size} />
                    <span className='text-xs text-muted-foreground'>{size}</span>
                </div>
            ))}
        </div>
    ),
};

export const WithinButton: Story = {
    render: () => (
        <button
            className='flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium opacity-80 cursor-not-allowed'
            disabled
        >
            <Spinner size='sm' className='text-primary-foreground' />
            Processing…
        </button>
    ),
};

export const WithinCard: Story = {
    render: () => (
        <div className='flex items-center justify-center w-[280px] h-[160px] rounded-lg border'>
            <div className='flex flex-col items-center gap-3'>
                <Spinner size='lg' />
                <p className='text-sm text-muted-foreground'>Loading orders…</p>
            </div>
        </div>
    ),
};
