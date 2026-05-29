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
    title: 'Components/Utilities/Drawer',
    component: Drawer,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
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
                    <DrawerTitle>Move Goal</DrawerTitle>
                    <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                </DrawerHeader>
                <div style={{ padding: '16px' }}>
                    <p>Drawer content goes here.</p>
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
