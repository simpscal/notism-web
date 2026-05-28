import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from '@/components/separator';

const meta = {
    title: 'Components/Separator',
    component: Separator,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
    render: () => (
        <div className='w-[320px]'>
            <div className='text-sm font-medium'>Menu Items</div>
            <p className='text-sm text-muted-foreground'>Manage your restaurant menu.</p>
            <Separator className='my-4' />
            <div className='flex flex-col gap-1'>
                <p className='text-sm text-muted-foreground'>12 active items</p>
                <p className='text-sm text-muted-foreground'>3 out of stock</p>
            </div>
        </div>
    ),
};

export const Vertical: Story = {
    render: () => (
        <div className='flex h-8 items-center gap-3 text-sm'>
            <span>Orders</span>
            <Separator orientation='vertical' />
            <span>Menu</span>
            <Separator orientation='vertical' />
            <span>Reports</span>
            <Separator orientation='vertical' />
            <span>Settings</span>
        </div>
    ),
};

export const BetweenSections: Story = {
    render: () => (
        <div className='w-[360px] rounded-container shadow-surface border p-4 flex flex-col gap-4'>
            <div>
                <h4 className='font-mono text-sm font-medium'>Order #1042</h4>
                <p className='text-xs text-muted-foreground'>Placed 2 minutes ago</p>
            </div>
            <Separator />
            <div className='flex flex-col gap-1 text-sm'>
                <div className='flex justify-between'>
                    <span>Margherita Pizza</span>
                    <span>$14.00</span>
                </div>
                <div className='flex justify-between'>
                    <span>Garden Salad</span>
                    <span>$8.50</span>
                </div>
                <div className='flex justify-between'>
                    <span>Lemonade x2</span>
                    <span>$6.00</span>
                </div>
            </div>
            <Separator />
            <div className='flex justify-between text-sm font-medium'>
                <span>Total</span>
                <span>$28.50</span>
            </div>
        </div>
    ),
};

export const InNavigation: Story = {
    render: () => (
        <nav className='flex flex-col w-[200px] gap-1 text-sm'>
            <a href='#' className='px-3 py-2 rounded-md hover:bg-muted'>
                Dashboard
            </a>
            <a href='#' className='px-3 py-2 rounded-md bg-muted font-medium'>
                Orders
            </a>
            <Separator className='my-1' />
            <a href='#' className='px-3 py-2 rounded-md hover:bg-muted'>
                Reports
            </a>
            <a href='#' className='px-3 py-2 rounded-md hover:bg-muted'>
                Analytics
            </a>
            <Separator className='my-1' />
            <a href='#' className='px-3 py-2 rounded-md hover:bg-muted text-muted-foreground'>
                Settings
            </a>
        </nav>
    ),
};
