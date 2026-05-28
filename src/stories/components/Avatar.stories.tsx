import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';

const meta = {
    title: 'Components/Avatar',
    component: Avatar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='shadcn' />
            <AvatarFallback>SC</AvatarFallback>
        </Avatar>
    ),
};

export const WithFallback: Story = {
    render: () => (
        <Avatar>
            {/* Intentionally broken src to trigger fallback */}
            <AvatarImage src='/broken-image.png' alt='User' />
            <AvatarFallback>JD</AvatarFallback>
        </Avatar>
    ),
};

export const InitialsOnly: Story = {
    render: () => (
        <Avatar>
            <AvatarFallback>AB</AvatarFallback>
        </Avatar>
    ),
};

export const CustomSize: Story = {
    render: () => (
        <div className='flex items-center gap-4'>
            <Avatar className='h-6 w-6'>
                <AvatarFallback className='text-xs'>XS</AvatarFallback>
            </Avatar>
            <Avatar className='h-8 w-8'>
                <AvatarFallback className='text-xs'>SM</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar className='h-14 w-14'>
                <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <Avatar className='h-20 w-20'>
                <AvatarFallback className='text-lg'>XL</AvatarFallback>
            </Avatar>
        </div>
    ),
};

export const AvatarGroup: Story = {
    render: () => (
        <div className='flex -space-x-2'>
            {['JD', 'AB', 'MK', 'PL', 'RS'].map((initials, i) => (
                <Avatar key={i} className='ring-2 ring-background'>
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            ))}
            <Avatar className='ring-2 ring-background'>
                <AvatarFallback className='text-xs bg-muted text-muted-foreground'>+8</AvatarFallback>
            </Avatar>
        </div>
    ),
};

export const WithUserInfo: Story = {
    render: () => (
        <div className='flex items-center gap-3'>
            <Avatar>
                <AvatarImage src='https://github.com/shadcn.png' alt='Jane Doe' />
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className='flex flex-col'>
                <span className='text-sm font-medium'>Jane Doe</span>
                <span className='text-xs text-muted-foreground'>jane.doe@example.com</span>
            </div>
        </div>
    ),
};
