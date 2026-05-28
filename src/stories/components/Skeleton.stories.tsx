import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from '@/components/skeleton';

const meta = {
    title: 'Components/Skeleton',
    component: Skeleton,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        className: 'h-4 w-[250px]',
    },
};

export const TextLines: Story = {
    render: () => (
        <div className='flex flex-col gap-2 w-[320px]'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-4/5' />
            <Skeleton className='h-4 w-3/5' />
        </div>
    ),
};

export const CardSkeleton: Story = {
    render: () => (
        <div className='flex flex-col gap-4 w-[320px] rounded-2xl border p-6 shadow-sm'>
            <div className='flex items-center gap-3'>
                <Skeleton className='h-10 w-10 rounded-full' />
                <div className='flex flex-col gap-2'>
                    <Skeleton className='h-4 w-[140px]' />
                    <Skeleton className='h-3 w-[100px]' />
                </div>
            </div>
            <Skeleton className='h-32 w-full rounded-xl' />
            <div className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-4/5' />
                <Skeleton className='h-4 w-3/5' />
            </div>
            <div className='flex gap-2'>
                <Skeleton className='h-9 flex-1 rounded-xl' />
                <Skeleton className='h-9 flex-1 rounded-xl' />
            </div>
        </div>
    ),
};

export const AvatarSkeleton: Story = {
    render: () => (
        <div className='flex items-center gap-3'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='flex flex-col gap-2'>
                <Skeleton className='h-4 w-[160px]' />
                <Skeleton className='h-3 w-[120px]' />
            </div>
        </div>
    ),
};

export const TableSkeleton: Story = {
    render: () => (
        <div className='flex flex-col gap-3 w-[480px]'>
            {/* Header */}
            <div className='flex gap-4 pb-2 border-b'>
                <Skeleton className='h-4 w-1/4' />
                <Skeleton className='h-4 w-1/4' />
                <Skeleton className='h-4 w-1/4' />
                <Skeleton className='h-4 w-1/4' />
            </div>
            {/* Rows */}
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex gap-4 py-1'>
                    <Skeleton className='h-4 w-1/4' />
                    <Skeleton className='h-4 w-1/4' style={{ opacity: 1 - i * 0.1 }} />
                    <Skeleton className='h-4 w-1/4' />
                    <Skeleton className='h-4 w-16 rounded-full' />
                </div>
            ))}
        </div>
    ),
};

export const FoodCardSkeleton: Story = {
    render: () => (
        <div className='flex flex-col gap-4 w-[280px] rounded-2xl border overflow-hidden shadow-sm'>
            {/* Image placeholder */}
            <Skeleton className='h-40 w-full rounded-none' />
            <div className='flex flex-col gap-3 px-6 pb-6'>
                <div className='flex items-start justify-between gap-2'>
                    <Skeleton className='h-5 w-[140px]' />
                    <Skeleton className='h-5 w-16 rounded-full' />
                </div>
                <div className='flex flex-col gap-2'>
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-4/5' />
                </div>
                <div className='flex items-center justify-between pt-1'>
                    <Skeleton className='h-6 w-16' />
                    <Skeleton className='h-8 w-[100px] rounded-xl' />
                </div>
            </div>
        </div>
    ),
};

export const GridOfCards: Story = {
    render: () => (
        <div className='grid grid-cols-3 gap-4 w-fit'>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='flex flex-col gap-3 rounded-2xl border p-4 w-[180px]'>
                    <Skeleton className='h-24 w-full rounded-xl' />
                    <Skeleton className='h-4 w-3/4' />
                    <Skeleton className='h-3 w-1/2' />
                </div>
            ))}
        </div>
    ),
};
