import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';

const meta = {
    title: 'Components/Display/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    ),
};

export const WithFallback: Story = {
    render: () => (
        <Avatar>
            <AvatarImage src='broken-url' alt='@user' />
            <AvatarFallback>AB</AvatarFallback>
        </Avatar>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Avatar className='h-8 w-8'>
                <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar className='h-14 w-14'>
                <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <Avatar className='h-20 w-20'>
                <AvatarFallback>XL</AvatarFallback>
            </Avatar>
        </div>
    ),
};
