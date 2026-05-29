import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from '@/components/skeleton';

const meta = {
    title: 'Components/Display/Skeleton',
    component: Skeleton,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton className='h-4 w-[250px]' />
                <Skeleton className='h-4 w-[200px]' />
            </div>
        </div>
    ),
};

export const Card: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
            <Skeleton className='h-[125px] w-full rounded-xl' />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-4/5' />
                <Skeleton className='h-4 w-3/5' />
            </div>
        </div>
    ),
};
