import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/drawer';

const meta = {
    title: 'Components/Drawer',
    component: Drawer,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant='outline'>Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Drawer Title</DrawerTitle>
                    <DrawerDescription>
                        Slide up from the bottom. Drag the handle or press Escape to close.
                    </DrawerDescription>
                </DrawerHeader>
                <div className='px-4 py-2 text-sm text-muted-foreground'>
                    Drawer content goes here. It can contain any UI — lists, forms, settings, etc.
                </div>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>Add Item</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Add New Item</DrawerTitle>
                    <DrawerDescription>Fill in the details below to add a new item to your board.</DrawerDescription>
                </DrawerHeader>
                <div className='px-4 py-2 flex flex-col gap-4'>
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-sm font-medium' htmlFor='item-name'>
                            Item name
                        </label>
                        <input
                            id='item-name'
                            className='h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
                            placeholder='Enter item name'
                        />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-sm font-medium' htmlFor='item-desc'>
                            Description
                        </label>
                        <textarea
                            id='item-desc'
                            rows={3}
                            className='w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50 resize-none'
                            placeholder='Optional description'
                        />
                    </div>
                </div>
                <DrawerFooter>
                    <Button>Create item</Button>
                    <DrawerClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
};

export const DestructiveAction: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant='destructive'>Delete item</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Delete this item?</DrawerTitle>
                    <DrawerDescription>
                        This action cannot be undone. The item will be permanently removed from your board.
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button variant='destructive'>Yes, delete</Button>
                    <DrawerClose asChild>
                        <Button variant='outline'>Keep it</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    ),
};

export const ModalElevation: Story = {
    name: 'Modal Tier Elevation',
    render: () => (
        <div className='relative w-full min-h-[400px]'>
            {/* Background content */}
            <div className='flex flex-col gap-4 p-6'>
                <p className='text-sm font-medium'>Background content behind the drawer scrim</p>
                <div className='grid grid-cols-3 gap-3'>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className='h-16 rounded-lg bg-muted' />
                    ))}
                </div>
            </div>
            {/* Scrim */}
            <div className='absolute inset-0 scrim' />
            {/* Drawer panel */}
            <div className='absolute inset-x-0 bottom-0 bg-background rounded-t-xl border-t shadow-modal p-6 flex flex-col gap-4'>
                <div className='mx-auto w-10 h-1 rounded-full bg-muted' />
                <h3 className='text-lg font-semibold tracking-tight-design'>Quick Actions</h3>
                <p className='text-sm text-muted-foreground'>
                    Drawer panel using shadow-modal elevation with scrim backdrop.
                </p>
                <div className='flex gap-2'>
                    <Button className='flex-1'>Confirm</Button>
                    <Button variant='outline' className='flex-1'>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    ),
};
