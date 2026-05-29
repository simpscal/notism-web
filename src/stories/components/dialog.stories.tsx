import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/dialog';
import { Input } from '@/components/input';
import { Label } from '@/components/label';

const meta = {
    title: 'Components/Utilities/Dialog',
    component: Dialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='outline'>Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <div style={{ display: 'grid', gap: '16px', padding: '16px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px', alignItems: 'center' }}>
                        <Label htmlFor='name'>Name</Label>
                        <Input id='name' defaultValue='Pedro Duarte' />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '16px', alignItems: 'center' }}>
                        <Label htmlFor='username'>Username</Label>
                        <Input id='username' defaultValue='@peduarte' />
                    </div>
                </div>
                <DialogFooter>
                    <Button type='submit'>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};

export const Simple: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='outline'>Cancel</Button>
                    <Button variant='destructive'>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};
