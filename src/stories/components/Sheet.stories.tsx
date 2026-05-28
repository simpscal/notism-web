import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/sheet';

const meta = {
    title: 'Components/Sheet',
    component: Sheet,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='outline'>Open Sheet (Right)</Button>
            </SheetTrigger>
            <SheetContent side='right'>
                <SheetHeader>
                    <SheetTitle>Edit Menu Item</SheetTitle>
                    <SheetDescription>Make changes to your menu item here. Click save when done.</SheetDescription>
                </SheetHeader>
                <div className='flex flex-col gap-4 px-4 py-2'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='item-name'>Name</Label>
                        <Input id='item-name' defaultValue='Margherita Pizza' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='item-price'>Price</Label>
                        <Input id='item-price' defaultValue='14.99' type='number' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='item-category'>Category</Label>
                        <Input id='item-category' defaultValue='Pizza' />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button>Save changes</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const Left: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='outline'>Open Sheet (Left)</Button>
            </SheetTrigger>
            <SheetContent side='left'>
                <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>Browse your restaurant dashboard.</SheetDescription>
                </SheetHeader>
                <nav className='flex flex-col gap-1 px-4 py-2 text-sm'>
                    {['Dashboard', 'Orders', 'Menu', 'Analytics', 'Customers', 'Settings'].map(item => (
                        <SheetClose asChild key={item}>
                            <a href='#' className='px-3 py-2 rounded-md hover:bg-muted transition-colors'>
                                {item}
                            </a>
                        </SheetClose>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    ),
};

export const Top: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='outline'>Open Sheet (Top)</Button>
            </SheetTrigger>
            <SheetContent side='top'>
                <SheetHeader>
                    <SheetTitle>Search</SheetTitle>
                    <SheetDescription>Search for menu items, orders, or customers.</SheetDescription>
                </SheetHeader>
                <div className='px-4 pb-4'>
                    <Input placeholder='Type to search…' />
                </div>
            </SheetContent>
        </Sheet>
    ),
};

export const Bottom: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='outline'>Open Sheet (Bottom)</Button>
            </SheetTrigger>
            <SheetContent side='bottom'>
                <SheetHeader>
                    <SheetTitle>Confirm Order</SheetTitle>
                    <SheetDescription>Review your order before placing it.</SheetDescription>
                </SheetHeader>
                <div className='flex flex-col gap-2 px-4 text-sm'>
                    <div className='flex justify-between'>
                        <span>Margherita Pizza</span>
                        <span>$14.00</span>
                    </div>
                    <div className='flex justify-between'>
                        <span>Garden Salad</span>
                        <span>$8.50</span>
                    </div>
                    <div className='flex justify-between font-medium pt-2 border-t'>
                        <span>Total</span>
                        <span>$22.50</span>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant='outline' className='flex-1'>
                            Cancel
                        </Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button className='flex-1'>Place Order</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const WithoutCloseButton: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='outline'>Open (no close button)</Button>
            </SheetTrigger>
            <SheetContent showCloseButton={false}>
                <SheetHeader>
                    <SheetTitle>Confirmation required</SheetTitle>
                    <SheetDescription>You must confirm or cancel before continuing.</SheetDescription>
                </SheetHeader>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </SheetClose>
                    <SheetClose asChild>
                        <Button>Confirm</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const ModalElevation: Story = {
    name: 'Modal Tier Elevation',
    render: () => (
        <div className='relative w-full min-h-[400px]'>
            {/* Background content to show scrim effect */}
            <div className='flex flex-col gap-4 p-6'>
                <p className='text-sm font-medium'>Background content visible behind the sheet</p>
                <div className='flex gap-3'>
                    <div className='h-20 w-32 rounded-lg bg-muted' />
                    <div className='h-20 w-32 rounded-lg bg-muted' />
                </div>
            </div>
            {/* Scrim */}
            <div className='absolute inset-0 scrim' />
            {/* Sheet panel with modal-tier shadow */}
            <div className='absolute inset-y-0 right-0 w-80 bg-background border-l shadow-modal flex flex-col'>
                <div className='flex flex-col gap-1.5 p-6 border-b'>
                    <h3 className='text-lg font-semibold leading-none tracking-tight-design'>Edit Item</h3>
                    <p className='text-sm text-muted-foreground'>
                        Sheet panel using shadow-modal with scrim backdrop. The modal transition uses --transition-modal
                        timing.
                    </p>
                </div>
                <div className='flex flex-col gap-4 p-6 flex-1'>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='me-name'>Name</Label>
                        <Input id='me-name' defaultValue='Margherita Pizza' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor='me-price'>Price</Label>
                        <Input id='me-price' defaultValue='14.99' type='number' />
                    </div>
                </div>
                <div className='flex justify-end gap-2 p-6 border-t'>
                    <Button variant='outline'>Cancel</Button>
                    <Button>Save changes</Button>
                </div>
            </div>
        </div>
    ),
};
