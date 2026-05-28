import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/popover';

const meta = {
    title: 'Components/Popover',
    component: Popover,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline'>Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div className='flex flex-col gap-2'>
                    <h4 className='font-medium text-sm'>Popover Content</h4>
                    <p className='text-sm text-muted-foreground'>
                        This is an example of popover content. Place any content here.
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const OpenByDefault: Story = {
    render: () => (
        <div className='pb-32'>
            <Popover defaultOpen>
                <PopoverTrigger asChild>
                    <Button variant='outline'>Settings</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className='grid gap-4'>
                        <div className='space-y-2'>
                            <h4 className='font-medium leading-none'>Dimensions</h4>
                            <p className='text-sm text-muted-foreground'>Set the dimensions for the layer.</p>
                        </div>
                        <div className='grid gap-2'>
                            <div className='grid grid-cols-3 items-center gap-4'>
                                <Label htmlFor='width'>Width</Label>
                                <Input id='width' defaultValue='100%' className='col-span-2 h-8' />
                            </div>
                            <div className='grid grid-cols-3 items-center gap-4'>
                                <Label htmlFor='height'>Height</Label>
                                <Input id='height' defaultValue='auto' className='col-span-2 h-8' />
                            </div>
                        </div>
                        <Button size='sm'>Apply</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button>Add item</Button>
            </PopoverTrigger>
            <PopoverContent align='start'>
                <div className='grid gap-3'>
                    <h4 className='font-medium text-sm'>New Menu Item</h4>
                    <div className='grid gap-2'>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='item-name'>Name</Label>
                            <Input id='item-name' placeholder='e.g. Margherita Pizza' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Label htmlFor='item-price'>Price</Label>
                            <Input id='item-price' placeholder='0.00' type='number' />
                        </div>
                    </div>
                    <div className='flex justify-end gap-2'>
                        <Button variant='outline' size='sm'>
                            Cancel
                        </Button>
                        <Button size='sm'>Save</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    ),
};

export const AlignStart: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline'>Align Start</Button>
            </PopoverTrigger>
            <PopoverContent align='start'>
                <p className='text-sm text-muted-foreground'>Popover aligned to the start of the trigger.</p>
            </PopoverContent>
        </Popover>
    ),
};

export const AlignEnd: Story = {
    render: () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='outline'>Align End</Button>
            </PopoverTrigger>
            <PopoverContent align='end'>
                <p className='text-sm text-muted-foreground'>Popover aligned to the end of the trigger.</p>
            </PopoverContent>
        </Popover>
    ),
};

export const ElevatedPopover: Story = {
    name: 'Elevated Tier Shadow',
    render: () => (
        <div className='pb-48'>
            <Popover defaultOpen>
                <PopoverTrigger asChild>
                    <Button variant='outline'>Quick Settings</Button>
                </PopoverTrigger>
                <PopoverContent className='shadow-elevated'>
                    <div className='grid gap-4'>
                        <div className='space-y-1'>
                            <h4 className='font-medium leading-none tracking-tight-design'>Display Options</h4>
                            <p className='text-xs tracking-caps text-muted-foreground'>appearance</p>
                        </div>
                        <div className='grid gap-2'>
                            <div className='grid grid-cols-3 items-center gap-4'>
                                <Label htmlFor='pop-width'>Width</Label>
                                <Input id='pop-width' defaultValue='100%' className='col-span-2 h-8' />
                            </div>
                            <div className='grid grid-cols-3 items-center gap-4'>
                                <Label htmlFor='pop-height'>Height</Label>
                                <Input id='pop-height' defaultValue='auto' className='col-span-2 h-8' />
                            </div>
                        </div>
                        <Button size='sm'>Apply</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    ),
};
