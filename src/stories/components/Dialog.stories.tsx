import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/dialog';
import { Input } from '@/components/input';

const meta = {
    title: 'Components/Dialog',
    component: Dialog,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline'>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                        This is a description of what this dialog is for. It provides context to the user.
                    </DialogDescription>
                </DialogHeader>
                <p className='text-sm text-muted-foreground'>
                    Any content can go here — forms, information, confirmations, etc.
                </p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                    <Button>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const WithForm: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your account details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-4 py-2'>
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-sm font-medium' htmlFor='dialog-name'>
                            Full name
                        </label>
                        <Input id='dialog-name' defaultValue='Jane Doe' />
                    </div>
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-sm font-medium' htmlFor='dialog-email'>
                            Email
                        </label>
                        <Input id='dialog-email' type='email' defaultValue='jane@example.com' />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DialogClose>
                    <Button>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Destructive: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='destructive'>Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. Your account and all associated data will be permanently removed.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant='outline'>Keep Account</Button>
                    </DialogClose>
                    <Button variant='destructive'>Yes, Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const DefaultOpen: Story = {
    render: () => (
        <Dialog defaultOpen>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pre-opened Dialog</DialogTitle>
                    <DialogDescription>
                        This dialog is open by default, useful for design review in Storybook.
                    </DialogDescription>
                </DialogHeader>
                <p className='text-sm text-muted-foreground'>
                    Use <code className='font-mono text-xs bg-muted px-1 py-0.5 rounded'>defaultOpen</code> or{' '}
                    <code className='font-mono text-xs bg-muted px-1 py-0.5 rounded'>open</code> prop to control
                    visibility programmatically.
                </p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const ModalElevation: Story = {
    name: 'Modal Elevation & Scrim',
    render: () => (
        <div className='relative w-full min-h-[400px]'>
            {/* Background content to show scrim effect */}
            <div className='flex flex-col gap-4 p-6'>
                <p className='text-sm font-medium'>Background content visible behind the scrim overlay</p>
                <div className='flex gap-3'>
                    <div className='h-20 w-32 rounded-lg bg-muted' />
                    <div className='h-20 w-32 rounded-lg bg-muted' />
                    <div className='h-20 w-32 rounded-lg bg-muted' />
                </div>
            </div>
            {/* Scrim overlay */}
            <div className='absolute inset-0 scrim' />
            {/* Dialog panel with modal shadow */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background rounded-xl border p-6 shadow-modal flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <h3 className='text-lg font-semibold leading-none tracking-tight-design'>Confirm Action</h3>
                    <p className='text-sm text-muted-foreground'>
                        This demonstrates the modal tier: shadow-modal elevation with the scrim backdrop overlay using
                        design token --scrim.
                    </p>
                </div>
                <div className='flex justify-end gap-2'>
                    <Button variant='outline'>Cancel</Button>
                    <Button>Confirm</Button>
                </div>
            </div>
        </div>
    ),
};
