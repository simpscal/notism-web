import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Label } from '@/components/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/sheet';

const meta = {
    title: 'Components/Utilities/Sheet',
    component: Sheet,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='outline'>Open Sheet</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit profile</SheetTitle>
                    <SheetDescription>Make changes to your profile here. Click save when done.</SheetDescription>
                </SheetHeader>
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
                <SheetFooter>
                    <Button type='submit'>Save changes</Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    ),
};

export const FromLeft: Story = {
    render: () => (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant='outline'>Open Left Sheet</Button>
            </SheetTrigger>
            <SheetContent side='left'>
                <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription>Browse through the available sections.</SheetDescription>
                </SheetHeader>
                <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button variant='ghost' style={{ justifyContent: 'flex-start' }}>
                        Dashboard
                    </Button>
                    <Button variant='ghost' style={{ justifyContent: 'flex-start' }}>
                        Projects
                    </Button>
                    <Button variant='ghost' style={{ justifyContent: 'flex-start' }}>
                        Settings
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    ),
};
